const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota inicial simples (placeholder)
app.get('/', (req, res) => {
  res.send('<h1>🔥 Servidor PBQE-C rodando!</h1>');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🔥 Servidor rodando na porta ${PORT}`));

module.exports = app;