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

// 🔒 FORÇAR CARGA DOS MODELS (ANTES DAS ASSOCIAÇÕES)
require('./modules/usuarios/usuarioModel');
require('./modules/roles/roleModel');
require('./modules/permissoes/permissaoModel');
require('./modules/status/statusModel');
require('./modules/entidades/entidadesModel');

// Inicialização das associações (AGORA SIM, com models carregados)
initAssociations();

// Rotas de páginas protegidas (Painel)
const painelRoutes = require('./routes/painelRoutes');
app.use('/painel', painelRoutes);

// Rotas de API (PBQE-C)
const usuariosRoutes = require('./modules/usuarios/usuariosRoutes');
const rolesRoutes = require('./modules/roles/roleRoutes');
const permissoesRoutes = require('./modules/permissoes/permissaoRoutes');
const resetSenhaRoutes = require('./modules/seguranca/reset_senha/resetSenhaRoutes');
const entidadesRoutes = require('./modules/entidades/entidadesRoutes');
const enderecosRoutes = require('./modules/enderecos/enderecosRoutes');

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/entidades', entidadesRoutes);
app.use('/api/permissoes', permissoesRoutes);
app.use('/api/seguranca/reset-senha', resetSenhaRoutes);
app.use('/api/enderecos', enderecosRoutes);

// Rota inicial
app.get('/', (req, res) => {
  res.send('<h1>🔥 Servidor PBQE-C rodando!</h1>');
});

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
