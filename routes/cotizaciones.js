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
    res.render('cotizaciones/index', { usuario: req.usuario, cotizaciones });
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
    res.redirect('/cotizaciones');
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

  res.render('cotizaciones/detalle', { usuario: req.usuario, cotizacion, productos, categorias, error: null });
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
      usuario: req.usuario, cotizacion, productos, categorias,
      error: 'Producto no encontrado'
    });
  }

  if (producto.stock < parseInt(cantidad)) {
    return res.status(409).render('cotizaciones/detalle', {
      usuario: req.usuario, cotizacion, productos, categorias,
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
      usuario: req.usuario, cotizacion, productos, categorias,
      error: 'Error al agregar producto'
    });
  }
});

router.post('/:id/estado', async (req, res) => {
  const { estado } = req.body;
  const cotizacion = await db.Cotizacion.findByPk(req.params.id);

  if (!cotizacion) {
    return res.status(404).render('error', { usuario: req.usuario, mensaje: 'Cotizacion no encontrada' });
  }

  if (!['pendiente', 'aprobada', 'rechazada'].includes(estado)) {
    return res.status(422).render('error', { usuario: req.usuario, mensaje: 'Estado no valido' });
  }

  // rq-05: Si se aprueba, descontar stock
  if (estado === 'aprobada' && cotizacion.estado !== 'aprobada') {
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
            mensaje: `No se puede aprobar. Stock insuficiente de "${producto.nombre}" (disponible: ${producto.stock})`
          });
        }

        await producto.update({ stock: nuevoStock }, { transaction: t });
      }

      await cotizacion.update({ estado }, { transaction: t });
      await t.commit();
    } catch (err) {
      await t.rollback();
      return res.status(500).render('error', { usuario: req.usuario, mensaje: 'Error al aprobar cotizacion' });
    }
  } else {
    await cotizacion.update({ estado });
  }

  res.redirect(`/cotizaciones/${cotizacion.id}`);
});

module.exports = router;
