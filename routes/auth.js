const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const isAuthenticated = require('../middleware/auth');

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

router.get('/restablecer', (req, res) => {
  res.render('auth/restablecer', { error: null, exito: null });
});

router.post('/restablecer', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.render('auth/restablecer', { exito: null, error: 'Ingresa tu email' });
  }

  try {
    const usuario = await db.Usuario.findOne({ where: { email, activo: true } });

    if (!usuario) {
      return res.render('auth/restablecer', { exito: null, error: 'No se encontro un usuario con ese email' });
    }

    const nuevaPassword = Math.random().toString(36).slice(-8);
    const nuevoHash = await bcrypt.hash(nuevaPassword, 10);
    await usuario.update({ password: nuevoHash });

    res.render('auth/restablecer', {
      error: null,
      exito: `Contrasena restablecida. Tu nueva contrasena es: <strong>${nuevaPassword}</strong>`,
      nuevaPassword
    });
  } catch (err) {
    res.render('auth/restablecer', { exito: null, error: 'Error al restablecer la contrasena' });
  }
});

router.get('/cambiar-password', isAuthenticated, (req, res) => {
  res.render('auth/cambiar-password', { usuario: req.usuario, error: null, exito: null });
});

router.post('/cambiar-password', isAuthenticated, async (req, res) => {
  const { password_actual, password_nueva, password_confirmar } = req.body;

  if (!password_actual || !password_nueva || !password_confirmar) {
    return res.render('auth/cambiar-password', {
      usuario: req.usuario, exito: null,
      error: 'Todos los campos son obligatorios'
    });
  }

  if (password_nueva !== password_confirmar) {
    return res.render('auth/cambiar-password', {
      usuario: req.usuario, exito: null,
      error: 'Las contrasenas no coinciden'
    });
  }

  if (password_nueva.length < 6) {
    return res.render('auth/cambiar-password', {
      usuario: req.usuario, exito: null,
      error: 'La contrasena nueva debe tener al menos 6 caracteres'
    });
  }

  try {
    const usuario = await db.Usuario.findByPk(req.usuario.id);

    const passwordValido = await bcrypt.compare(password_actual, usuario.password);
    if (!passwordValido) {
      return res.render('auth/cambiar-password', {
        usuario: req.usuario, exito: null,
        error: 'La contrasena actual es incorrecta'
      });
    }

    const nuevoHash = await bcrypt.hash(password_nueva, 10);
    await usuario.update({ password: nuevoHash });

    res.render('auth/cambiar-password', {
      usuario: req.usuario, error: null,
      exito: 'Contrasena cambiada correctamente'
    });
  } catch (err) {
    res.render('auth/cambiar-password', {
      usuario: req.usuario, exito: null,
      error: 'Error al cambiar la contrasena'
    });
  }
});

module.exports = router;
