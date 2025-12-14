module.exports = function (req, res, next) {
  const usuario = req.usuario;
  if (!usuario) {
    return res.status(401).json({ erro: 'Usuário não autenticado.' });
  }
  next();
};