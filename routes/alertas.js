const express = require('express');
const router = express.Router();
const db = require('../models');
const { Op } = require('sequelize');
const isAuthenticated = require('../middleware/auth');

router.use(isAuthenticated);

router.get('/', async (req, res) => {
  const productos = await db.Producto.findAll({
    where: {
      stock: { [Op.lte]: 10 }
    },
    include: [{ model: db.Categoria, as: 'categoria' }],
    order: [['stock', 'ASC']]
  });

  const agotados = productos.filter(p => p.stock === 0).length;
  const criticos = productos.filter(p => p.stock > 0 && p.stock <= 5).length;
  const bajos = productos.filter(p => p.stock > 5 && p.stock <= 10).length;

  res.render('alertas/index', {
    usuario: req.usuario,
    productos,
    metricas: { total: productos.length, agotados, criticos, bajos }
  });
});

module.exports = router;
