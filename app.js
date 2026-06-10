const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('express-async-errors');

const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoutes);
app.use('/cotizaciones', require('./routes/cotizaciones'));
app.use('/', require('./routes/index'));

app.use((err, req, res, next) => {
  console.error('ERROR:', err.message);
  res.status(500).render('error', { usuario: req.usuario || {}, mensaje: 'Error interno del servidor' });
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err.message);
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err.message);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
