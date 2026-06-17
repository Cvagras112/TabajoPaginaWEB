const express = require('express');
const router = express.Router();
const db = require('../models');
const isAuthenticated = require('../middleware/auth');

router.use(isAuthenticated);

function esAdmin(req) {
  return req.usuario && req.usuario.rol === 'admin';
}

router.get('/', async (req, res) => {
  const categorias = await db.Categoria.findAll({ order: [['nombre', 'ASC']] });
  res.render('categorias/index', { usuario: req.usuario, categorias, esAdmin: esAdmin(req) });
});

router.get('/nueva', (req, res) => {
  if (!esAdmin(req)) return res.redirect('/categorias');
  res.render('categorias/nueva', { usuario: req.usuario, error: null });
});

router.post('/', async (req, res) => {
  if (!esAdmin(req)) return res.redirect('/categorias');
  const { nombre, descripcion } = req.body;
  try {
    await db.Categoria.create({ nombre, descripcion: descripcion || null });
    res.redirect('/categorias');
  } catch (err) {
    res.render('categorias/nueva', { usuario: req.usuario, error: err.errors ? err.errors[0].message : 'Error al crear' });
  }
});

router.get('/:id/editar', async (req, res) => {
  if (!esAdmin(req)) return res.redirect('/categorias');
  const categoria = await db.Categoria.findByPk(req.params.id);
  if (!categoria) return res.status(404).render('error', { usuario: req.usuario, mensaje: 'Categoria no encontrada' });
  res.render('categorias/editar', { usuario: req.usuario, categoria, error: null });
});

router.post('/:id', async (req, res) => {
  if (!esAdmin(req)) return res.redirect('/categorias');
  const categoria = await db.Categoria.findByPk(req.params.id);
  if (!categoria) return res.status(404).render('error', { usuario: req.usuario, mensaje: 'Categoria no encontrada' });
  const { nombre, descripcion } = req.body;
  try {
    await categoria.update({ nombre, descripcion: descripcion || null });
    res.redirect('/categorias');
  } catch (err) {
    res.render('categorias/editar', { usuario: req.usuario, categoria, error: err.errors ? err.errors[0].message : 'Error al actualizar' });
  }
});

router.post('/:id/eliminar', async (req, res) => {
  if (!esAdmin(req)) return res.redirect('/categorias');
  await db.Categoria.destroy({ where: { id: req.params.id } });
  res.redirect('/categorias');
});

module.exports = router;
