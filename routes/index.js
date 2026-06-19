const express = require('express');
const isAuthenticated = require('../middleware/auth');
const db = require('../models');

const router = express.Router();

router.get('/', isAuthenticated, async (req, res) => {
  const [totalProductos, totalCategorias, stockBajo, pendientes] = await Promise.all([
    db.Producto.count(),
    db.Categoria.count(),
    db.Producto.count({ where: { stock: { [db.Sequelize.Op.lte]: 10, [db.Sequelize.Op.gt]: 0 } } }),
    db.Cotizacion.count({ where: { estado: 'pendiente' } })
  ]);

  res.render('dashboard', {
    usuario: req.usuario,
    totalProductos,
    totalCategorias,
    stockBajo,
    pendientes
  });
});

module.exports = router;
