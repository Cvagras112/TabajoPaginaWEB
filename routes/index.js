const express = require('express');
const isAuthenticated = require('../middleware/auth');
const db = require('../models');

const router = express.Router();

router.get('/', isAuthenticated, async (req, res) => {
  const totalProductos = await db.Producto.count();
  const totalCategorias = await db.Categoria.count();

  res.render('dashboard', {
    usuario: req.usuario,
    totalProductos,
    totalCategorias
  });
});

module.exports = router;
