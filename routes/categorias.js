const express = require('express');
const router = express.Router();
const db = require('../models');
const isAuthenticated = require('../middleware/auth');

router.use(isAuthenticated);

router.get('/', async (req, res) => {
  const categorias = await db.Categoria.findAll({ order: [['nombre', 'ASC']] });
  res.render('categorias/index', { usuario: req.usuario, categorias });
});

module.exports = router;
