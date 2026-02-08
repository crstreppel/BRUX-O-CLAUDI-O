const jwt = require('jsonwebtoken');
const permission = require('./permissionMiddleware');

// ======================================================================
// 🧙‍♂️ PBQE-C V2 – Gatekeeper (Auth)
// ----------------------------------------------------------------------
// Regra: o mesmo JWT_SECRET deve ser usado para assinar e verificar tokens.
// Fonte única: config/auth.js
// ======================================================================
const JWT_SECRET = require('../../config/auth').jwtSecret;

function auth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // HTML protegido (/painel): redireciona para login se não autenticado
  if (!token && req.originalUrl.startsWith('/painel')) {
    return res.redirect('/modules/login/login.html');
  }

  if (!token) {
    return res.status(401).json({ erro: 'Token não informado' });
  }

  jwt.verify(token, JWT_SECRET, (err, usuario) => {
    if (err) {
      // Token inválido em HTML protegido → redirect
      if (req.originalUrl.startsWith('/painel')) {
        return res.redirect('/modules/login/login.html');
      }
      return res.status(403).json({ erro: 'Token inválido' });
    }

    req.usuario = usuario;
    next();
  });
}

module.exports = {
  auth,
  permission
};
