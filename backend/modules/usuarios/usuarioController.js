const Usuario = require('./usuarioModel');

// =============================================================
// Controller do módulo Usuarios (Maria Fumaça PBQE-C)
// =============================================================

module.exports = {

  // -----------------------------------------
  // 1) Cadastro de usuário
  // -----------------------------------------
  async cadastrarUsuario(req, res) {
    try {
      const { usuario, senha } = req.body;

      // validação simples
      if (!usuario || !senha) {
        return res.status(400).json({ erro: 'Usuário e senha são obrigatórios.' });
      }

      // verifica se já existe
      const existe = await Usuario.findOne({ where: { usuario } });
      if (existe) {
        return res.status(400).json({ erro: 'Usuário já existe.' });
      }

      // cria
      await Usuario.create({ usuario, senha });

      return res.json({ sucesso: true, mensagem: 'Usuário criado com sucesso!' });

    } catch (error) {
      console.error('Erro no cadastro:', error);
      return res.status(500).json({ erro: 'Erro interno no servidor.' });
    }
  },

  // -----------------------------------------
  // 2) Login
  // -----------------------------------------
  async loginUsuario(req, res) {
    try {
      const { usuario, senha } = req.body;

      // validação
      if (!usuario || !senha) {
        return res.status(400).json({ erro: 'Usuário e senha são obrigatórios.' });
      }

      // busca usuário
      const user = await Usuario.findOne({ where: { usuario } });

      if (!user) {
        return res.status(400).json({ erro: 'Usuário não encontrado.' });
      }

      if (user.senha !== senha) {
        return res.status(400).json({ erro: 'Senha incorreta.' });
      }

      // login ok – isso é LAB, nada sofisticado
      return res.json({ sucesso: true, mensagem: 'Login autorizado!' });

    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(500).json({ erro: 'Erro interno no servidor.' });
    }
  }
};