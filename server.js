// Importar o Express
const express = require('express');
const path = require('path')
const app = express();
const port = 3000;

// Middleware para processar dados JSON
app.use(express.json());

// Servir arquivos estáticos (CSS, JS, imagens) da pasta 'frontend'
app.use(express.static(path.join(__dirname, 'frontend')));

// Rota GET simples
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/index.html"));
});

// Rota POST para receber dados JSON
app.post('/dados', (req, res) => {
  const dadosRecebidos = req.body;
  console.log(dadosRecebidos);
  res.send('Dados recebidos com sucesso!');
});

// Servidor rodando
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});


