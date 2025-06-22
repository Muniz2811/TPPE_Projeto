const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const DatabaseConnection = require('./config/database');
const routes = require('./routes');

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

// Conexão com o MongoDB usando o gerenciador de conexão
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/sistema-vendas';
DatabaseConnection.connect(mongoURI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas da API
app.use('/api', routes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'Sistema de Gestão de Vendas API',
    status: 'online',
    version: '1.0.0',
    documentation: '/api',
    timestamp: new Date()
  });
});

// Middleware para rotas não encontradas
app.use((req, res, next) => {
  const error = new Error(`Rota não encontrada - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
});

// Inicialização do servidor
const server = app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  console.error('ERRO NÃO TRATADO:', err);
  // Fecha o servidor graciosamente
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
