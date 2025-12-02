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
      const { usuario, email, senha } = req.body;

      if (!usuario || !email || !senha) {
        return res.status(400).json({ erro: "Faltou preencher usuário, email ou senha. Sem eles não consigo continuar 😅" });
      }

      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regexEmail.test(email)) {
        return res.status(400).json({ erro: "Opa, acho que seu email não parece correto. Dá uma conferida por favor 😊" });
      }

      const usuarioExiste = await Usuario.findOne({ where: { usuario } });
      if (usuarioExiste) {
        return res.status(400).json({ erro: "Bah, parece que esse usuário já foi escolhido. Bora tentar outro nome?" });
      }

      const emailExiste = await Usuario.findOne({ where: { email } });
      if (emailExiste) {
        return res.status(400).json({ erro: "Esse email já tá na nossa lista. Quer tentar outro?" });
      }

      await Usuario.create({ usuario, email, senha });

      return res.json({ sucesso: true, mensagem: "Usuário criado com sucesso!" });

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

      if (!usuario || !senha) {
        return res.status(400).json({ erro: "Preciso de usuário e senha pra te encontrar direitinho 😉" });
      }

      const user = await Usuario.findOne({ where: { usuario } });

      if (!user) {
        return res.status(400).json({ erro: "Bah, procurei aqui nos meus registros e não achei esse usuário 🤔" });
      }

      if (user.senha !== senha) {
        return res.status(400).json({ erro: "Hmmm… essa senha não bateu com a que tenho aqui. Tenta de novo?" });
      }

      return res.json({ sucesso: true, mensagem: 'Login autorizado!' });

    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(500).json({ erro: 'Erro interno no servidor.' });
    }
  }
};