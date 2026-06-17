const express = require('express');
const router = express.Router();
const db = require('../models');
const isAuthenticated = require('../middleware/auth');

router.use(isAuthenticated);

function esAdmin(req) {
  return req.usuario && req.usuario.rol === 'admin';
}

router.get('/', async (req, res) => {
  const productos = await db.Producto.findAll({
    include: [{ model: db.Categoria, as: 'categoria' }],
    order: [['nombre', 'ASC']]
  });
  res.render('productos/index', { usuario: req.usuario, productos, esAdmin: esAdmin(req) });
});

router.get('/nuevo', async (req, res) => {
  if (!esAdmin(req)) return res.redirect('/productos');
  const categorias = await db.Categoria.findAll({ order: [['nombre', 'ASC']] });
  res.render('productos/nuevo', { usuario: req.usuario, categorias, error: null });
});

router.post('/', async (req, res) => {
  if (!esAdmin(req)) return res.redirect('/productos');
  const { nombre, tipo, gtin, precio, stock, disponibilidad, categoria_id } = req.body;
  const categorias = await db.Categoria.findAll({ order: [['nombre', 'ASC']] });

  try {
    await db.Producto.create({
      nombre, tipo: tipo || null, gtin: gtin || null,
      precio: parseFloat(precio) || 0, stock: parseInt(stock) || 0,
      disponibilidad: disponibilidad === '1',
      categoria_id: categoria_id ? parseInt(categoria_id) : null
    });
    res.redirect('/productos');
  } catch (err) {
    res.render('productos/nuevo', { usuario: req.usuario, categorias, error: err.errors ? err.errors[0].message : 'Error al crear' });
  }
});

router.get('/:id', async (req, res) => {
  const producto = await db.Producto.findByPk(req.params.id, {
    include: [{ model: db.Categoria, as: 'categoria' }]
  });
  if (!producto) return res.status(404).render('error', { usuario: req.usuario, mensaje: 'Producto no encontrado' });
  res.render('productos/detalle', { usuario: req.usuario, producto, esAdmin: esAdmin(req) });
});

router.get('/:id/editar', async (req, res) => {
  if (!esAdmin(req)) return res.redirect('/productos');
  const producto = await db.Producto.findByPk(req.params.id);
  if (!producto) return res.status(404).render('error', { usuario: req.usuario, mensaje: 'Producto no encontrado' });
  const categorias = await db.Categoria.findAll({ order: [['nombre', 'ASC']] });
  res.render('productos/editar', { usuario: req.usuario, producto, categorias, error: null });
});

router.post('/:id', async (req, res) => {
  if (!esAdmin(req)) return res.redirect('/productos');
  const producto = await db.Producto.findByPk(req.params.id);
  if (!producto) return res.status(404).render('error', { usuario: req.usuario, mensaje: 'Producto no encontrado' });
  const { nombre, tipo, gtin, precio, stock, disponibilidad, categoria_id } = req.body;
  const categorias = await db.Categoria.findAll({ order: [['nombre', 'ASC']] });

  try {
    await producto.update({
      nombre, tipo: tipo || null, gtin: gtin || null,
      precio: parseFloat(precio) || 0, stock: parseInt(stock) || 0,
      disponibilidad: disponibilidad === '1',
      categoria_id: categoria_id ? parseInt(categoria_id) : null
    });
    res.redirect('/productos');
  } catch (err) {
    res.render('productos/editar', { usuario: req.usuario, producto, categorias, error: err.errors ? err.errors[0].message : 'Error al actualizar' });
  }
});

router.post('/:id/eliminar', async (req, res) => {
  if (!esAdmin(req)) return res.redirect('/productos');
  await db.Producto.destroy({ where: { id: req.params.id } });
  res.redirect('/productos');
});

module.exports = router;
