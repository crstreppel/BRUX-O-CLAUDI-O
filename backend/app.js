const express = require('express');
const path = require('path');
const sequelize = require('./config/connection');
const initAssociations = require('./config/associations');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rotas de API (PBQE-C)
const usuariosRoutes = require('./modules/usuarios/usuariosRoutes');
const rolesRoutes = require('./modules/roles/roleRoutes');
const permissoesRoutes = require('./modules/permissoes/permissaoRoutes');
const resetSenhaRoutes = require('./modules/seguranca/reset_senha/resetSenhaRoutes');

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/permissoes', permissoesRoutes);
app.use('/api/seguranca/reset-senha', resetSenhaRoutes);

// Rota inicial
app.get('/', (req, res) => {
  res.send('<h1>🔥 Servidor PBQE-C rodando!</h1>');
});

// Inicialização das associações (APÓS models carregados)
initAssociations();

// Inicialização com sync do banco
const PORT = 3000;

sequelize.sync()
  .then(() => {
    console.log('🗂️  Banco sincronizado com Sequelize.');
    app.listen(PORT, () => console.log(`🔥 Servidor rodando na porta ${PORT}`));
  })
  .catch(err => {
    console.error('❌ Erro ao sincronizar banco:', err);
  });

module.exports = app;
