const express = require('express');
const router = express.Router();
const db = require('../models');
const isAuthenticated = require('../middleware/auth');

router.use(isAuthenticated);

router.get('/', async (req, res) => {
  const productos = await db.Producto.findAll({
    include: [{ model: db.Categoria, as: 'categoria' }],
    order: [['nombre', 'ASC']]
  });

  const total = productos.length;
  const disponibles = productos.filter(p => p.disponibilidad).length;
  const noDisponibles = total - disponibles;
  const stockBajo = productos.filter(p => p.stock <= 10 && p.stock > 0).length;
  const sinStock = productos.filter(p => p.stock === 0).length;
  const valorTotal = productos.reduce((sum, p) => sum + (parseFloat(p.precio) * p.stock), 0);

  res.render('inventario/index', {
    usuario: req.usuario,
    productos,
    metricas: { total, disponibles, noDisponibles, stockBajo, sinStock, valorTotal },
    esAdmin: req.usuario.rol === 'admin'
  });
});

module.exports = router;
