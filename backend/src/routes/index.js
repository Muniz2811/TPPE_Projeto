const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./authRoutes');
const clienteRoutes = require('./clienteRoutes');
const fabricanteRoutes = require('./fabricanteRoutes');
const produtoRoutes = require('./produtoRoutes');
const vendaRoutes = require('./vendaRoutes');

// Define API routes
router.use('/auth', authRoutes);
router.use('/clientes', clienteRoutes);
router.use('/fabricantes', fabricanteRoutes);
router.use('/produtos', produtoRoutes);
router.use('/vendas', vendaRoutes);

// API status route
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API do Sistema de Gestão de Vendas está funcionando!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      clientes: '/api/clientes',
      fabricantes: '/api/fabricantes',
      produtos: '/api/produtos',
      vendas: '/api/vendas'
    }
  });
});

module.exports = router;
