const jwt = require('jsonwebtoken');

function isAuthenticated(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/auth/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    res.clearCookie('token');
    return res.redirect('/auth/login');
  }
}

module.exports = isAuthenticated;
