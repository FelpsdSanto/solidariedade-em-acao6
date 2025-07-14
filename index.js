// Carregar variáveis de ambiente do arquivo .env (apenas para desenvolvimento local)
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const User = require('./models/User');

const familiaControllers = require('./controllers/familiaControllers');
const doacaoController = require('./controllers/doacaoController');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com MongoDB Atlas usando variável de ambiente
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Conectado ao MongoDB Atlas!');

    // Só inicia o servidor depois que a conexão estiver OK
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao conectar:', err);
  });

// Rota de teste
app.get('/', (req, res) => {
  res.send('API Solidariedade em Ação funcionando!');
});

// ---------- ROTAS DE USUÁRIO (Cadastro/Login) ----------
app.post('/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const userExistente = await User.findOne({ email });

    if (userExistente) {
      return res.status(400).send('Erro: Email já cadastrado.');
    }

    const novoUsuario = new User({ nome, email, senha });
    await novoUsuario.save();

    res.status(201).send('Usuário cadastrado com sucesso!');
  } catch (err) {
    res.status(500).send('Erro ao cadastrar: ' + err.message);
  }
});

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await User.findOne({ email, senha });

    if (user) {
      res.send('Login bem-sucedido!');
    } else {
      res.status(401).send('Usuário ou senha incorretos.');
    }
  } catch (err) {
    res.status(500).send('Erro ao fazer login: ' + err.message);
  }
});

// ---------- ROTAS DE FAMÍLIA ----------
app.post('/familias', familiaControllers.criarFamilia);
app.get('/familias', familiaControllers.listarFamilias);
app.delete('/familias/:id', familiaControllers.excluirFamilia);
app.get('/familias/exportar', familiaControllers.exportarCSV);

// ---------- ROTAS DE DOAÇÃO ----------
app.post('/doacoes', doacaoController.criarDoacao);
app.get('/doacoes', doacaoController.listarDoacoes);
app.delete('/doacoes/:id', doacaoController.excluirDoacao);
app.get('/doacoes/exportar', doacaoController.exportarCSV);
