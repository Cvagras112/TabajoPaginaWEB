const express = require('express');
const router = express.Router();
const db = require('../models');
const isAuthenticated = require('../middleware/auth');

router.use(isAuthenticated);

router.get('/', async (req, res) => {
  try {
    const cotizaciones = await db.Cotizacion.findAll({
      include: ['usuario'],
      order: [['created_at', 'DESC']]
    });
    res.render('cotizaciones/index', { usuario: req.usuario, cotizaciones, esAdmin: req.usuario.rol === 'admin', mensaje: req.query.mensaje || null });
  } catch (err) {
    res.status(500).render('error', { usuario: req.usuario, mensaje: 'Error al cargar cotizaciones' });
  }
});

router.get('/nueva', async (req, res) => {
  const [productos, categorias] = await Promise.all([
    db.Producto.findAll({ order: [['nombre', 'ASC']] }),
    db.Categoria.findAll({ order: [['nombre', 'ASC']] })
  ]);
  res.render('cotizaciones/nueva', { usuario: req.usuario, productos, categorias, error: null });
});

router.post('/', async (req, res) => {
  const { cliente_nombre, producto_id, cantidad } = req.body;
  const [productos, categorias] = await Promise.all([
    db.Producto.findAll({ order: [['nombre', 'ASC']] }),
    db.Categoria.findAll({ order: [['nombre', 'ASC']] })
  ]);

  if (!cliente_nombre || !producto_id || !cantidad || cantidad < 1) {
    return res.render('cotizaciones/nueva', {
      usuario: req.usuario, productos, categorias,
      error: 'Todos los campos son obligatorios'
    });
  }

  const producto = await db.Producto.findByPk(producto_id);

  if (!producto) {
    return res.render('cotizaciones/nueva', {
      usuario: req.usuario, productos, categorias,
      error: 'Producto no encontrado'
    });
  }

  if (producto.stock < parseInt(cantidad)) {
    return res.status(409).render('cotizaciones/nueva', {
      usuario: req.usuario, productos, categorias,
      error: `Stock insuficiente. "${producto.nombre}" tiene ${producto.stock} unidades disponibles, solicitaste ${cantidad}.`
    });
  }

  const t = await db.sequelize.transaction();

  try {
    const precio = parseFloat(producto.precio);
    const cant = parseInt(cantidad);
    const subtotal = precio * cant;

    const cotizacion = await db.Cotizacion.create({
      cliente_nombre,
      total: subtotal,
      usuario_id: req.usuario.id
    }, { transaction: t });

    await db.DetalleCotizacion.create({
      cotizacion_id: cotizacion.id,
      producto_id,
      cantidad: cant,
      precio_unitario: precio,
      subtotal
    }, { transaction: t });

    await t.commit();
    if (req.usuario.rol === 'admin') {
      res.redirect('/cotizaciones');
    } else {
      res.redirect('/cotizaciones?mensaje=Su+solicitud+sera+revisada+en+breve');
    }
  } catch (err) {
    await t.rollback();
    res.render('cotizaciones/nueva', {
      usuario: req.usuario, productos, categorias,
      error: 'Error al crear la cotizacion'
    });
  }
});

router.get('/:id', async (req, res) => {
  const [cotizacion, productos, categorias] = await Promise.all([
    db.Cotizacion.findByPk(req.params.id, {
      include: [
        'usuario',
        { model: db.DetalleCotizacion, as: 'detalles', include: [{ model: db.Producto, as: 'producto' }] }
      ]
    }),
    db.Producto.findAll({ order: [['nombre', 'ASC']] }),
    db.Categoria.findAll({ order: [['nombre', 'ASC']] })
  ]);

  if (!cotizacion) {
    return res.status(404).render('error', { usuario: req.usuario, mensaje: 'Cotizacion no encontrada' });
  }

  res.render('cotizaciones/detalle', { usuario: req.usuario, cotizacion, productos, categorias, esAdmin: req.usuario.rol === 'admin', error: null });
});

router.post('/:id/agregar', async (req, res) => {
  const { producto_id, cantidad } = req.body;

  const [cotizacion, productos, categorias, producto] = await Promise.all([
    db.Cotizacion.findByPk(req.params.id, {
      include: [{ model: db.DetalleCotizacion, as: 'detalles', include: [{ model: db.Producto, as: 'producto' }] }]
    }),
    db.Producto.findAll({ order: [['nombre', 'ASC']] }),
    db.Categoria.findAll({ order: [['nombre', 'ASC']] }),
    db.Producto.findByPk(producto_id)
  ]);

  if (!cotizacion) {
    return res.status(404).render('error', { usuario: req.usuario, mensaje: 'Cotizacion no encontrada' });
  }

  if (!producto) {
    return res.render('cotizaciones/detalle', {
      usuario: req.usuario, cotizacion, productos, categorias, esAdmin: req.usuario.rol === 'admin',
      error: 'Producto no encontrado'
    });
  }

  if (producto.stock < parseInt(cantidad)) {
    return res.status(409).render('cotizaciones/detalle', {
      usuario: req.usuario, cotizacion, productos, categorias, esAdmin: req.usuario.rol === 'admin',
      error: `Stock insuficiente. "${producto.nombre}" tiene ${producto.stock} unidades, solicitaste ${cantidad}.`
    });
  }

  const t = await db.sequelize.transaction();

  try {
    const cant = parseInt(cantidad);
    const precio = parseFloat(producto.precio);
    const subtotal = precio * cant;

    await db.DetalleCotizacion.create({
      cotizacion_id: cotizacion.id,
      producto_id,
      cantidad: cant,
      precio_unitario: precio,
      subtotal
    }, { transaction: t });

    const total = parseFloat(cotizacion.total) + subtotal;
    await cotizacion.update({ total }, { transaction: t });

    await t.commit();
    res.redirect(`/cotizaciones/${cotizacion.id}`);
  } catch (err) {
    await t.rollback();
    res.render('cotizaciones/detalle', {
      usuario: req.usuario, cotizacion, productos, categorias, esAdmin: req.usuario.rol === 'admin',
      error: 'Error al agregar producto'
    });
  }
});

router.post('/:id/estado', async (req, res) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).render('error', { usuario: req.usuario, mensaje: 'Solo el administrador puede aprobar o rechazar cotizaciones' });
  }

  const { estado } = req.body;
  const cotizacion = await db.Cotizacion.findByPk(req.params.id);

  if (!cotizacion) {
    return res.status(404).render('error', { usuario: req.usuario, mensaje: 'Cotizacion no encontrada' });
  }

  if (!['aprobada', 'rechazada'].includes(estado)) {
    return res.status(422).render('error', { usuario: req.usuario, mensaje: 'Estado no valido' });
  }

  if (cotizacion.estado !== 'pendiente') {
    return res.status(422).render('error', { usuario: req.usuario, mensaje: 'Solo se puede aprobar o rechazar cotizaciones pendientes' });
  }

  await cotizacion.update({ estado });
  res.redirect(`/cotizaciones/${cotizacion.id}`);
});

router.post('/:id/aceptar', async (req, res) => {
  const cotizacion = await db.Cotizacion.findByPk(req.params.id);

  if (!cotizacion) {
    return res.status(404).render('error', { usuario: req.usuario, mensaje: 'Cotizacion no encontrada' });
  }

  if (cotizacion.estado !== 'aprobada') {
    return res.status(422).render('error', { usuario: req.usuario, mensaje: 'Solo se pueden aceptar cotizaciones aprobadas' });
  }

  const detalles = await db.DetalleCotizacion.findAll({
    where: { cotizacion_id: cotizacion.id },
    include: ['producto']
  });

  const t = await db.sequelize.transaction();

  try {
    for (const detalle of detalles) {
      const producto = detalle.producto;
      const nuevoStock = producto.stock - detalle.cantidad;

      if (nuevoStock < 0) {
        await t.rollback();
        return res.status(409).render('error', {
          usuario: req.usuario,
          mensaje: `No se puede aceptar. Stock insuficiente de "${producto.nombre}" (disponible: ${producto.stock})`
        });
      }

      await producto.update({ stock: nuevoStock }, { transaction: t });
    }

    await cotizacion.update({ estado: 'aceptada' }, { transaction: t });
    await t.commit();
    res.redirect(`/cotizaciones/${cotizacion.id}`);
  } catch (err) {
    await t.rollback();
    return res.status(500).render('error', { usuario: req.usuario, mensaje: 'Error al aceptar cotizacion' });
  }
});

router.post('/:id/eliminar', async (req, res) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).render('error', { usuario: req.usuario, mensaje: 'Solo el administrador puede eliminar cotizaciones' });
  }

  const cotizacion = await db.Cotizacion.findByPk(req.params.id);

  if (!cotizacion) {
    return res.status(404).render('error', { usuario: req.usuario, mensaje: 'Cotizacion no encontrada' });
  }

  if (cotizacion.estado === 'pendiente') {
    return res.status(422).render('error', { usuario: req.usuario, mensaje: 'No se pueden eliminar cotizaciones pendientes. Solo rechazadas o aceptadas.' });
  }

  await db.DetalleCotizacion.destroy({ where: { cotizacion_id: cotizacion.id } });
  await cotizacion.destroy();
  res.redirect('/cotizaciones');
});

module.exports = router;
