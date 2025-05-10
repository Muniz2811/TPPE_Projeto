const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Configuração das variáveis de ambiente
dotenv.config();

// Inicialização do app Express
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexão com o MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/sistema-vendas';
mongoose.connect(mongoURI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Rota de teste (Hello World)
app.get('/', (req, res) => {
  res.json({
    message: 'Hello World! API do Sistema de Gestão de Vendas está funcionando!',
    status: 'online',
    timestamp: new Date()
  });
});

// Inicialização do servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

module.exports = app;
