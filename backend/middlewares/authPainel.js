// middleware/authPainel.js
module.exports = (req, res, next) => {
  try {
    const logged = req.session && req.session.usuarioAtual;
    if (!logged) {
      return res.redirect('/modules/usuarios/login.html');
    }
    next();
  } catch (err) {
    console.error('Erro no middleware authPainel:', err);
    return res.redirect('/modules/usuarios/login.html');
  }
};
