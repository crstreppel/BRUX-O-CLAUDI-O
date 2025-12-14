module.exports = function (permissaoChave) {
  return async function (req, res, next) {
    try {
      const usuario = req.usuario;
      if (!usuario) return res.status(401).json({ erro: 'Usuário não autenticado.' });

      const permissoes = usuario.permissoes || [];
      if (!permissoes.includes(permissaoChave)) {
        return res.status(403).json({ erro: 'Acesso negado.' });
      }

      next();
    } catch (err) {
      return res.status(500).json({ erro: err.message });
    }
  };
};