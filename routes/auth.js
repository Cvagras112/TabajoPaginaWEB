const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');

const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await db.Usuario.findOne({ where: { email, activo: true } });

    if (!usuario) {
      return res.render('login', { error: 'Email o contrasena incorrectos' });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res.render('login', { error: 'Email o contrasena incorrectos' });
    }

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.cookie('token', token, { httpOnly: true });
    res.redirect('/');
  } catch (err) {
    res.render('login', { error: 'Error al iniciar sesion' });
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/auth/login');
});

module.exports = router;
