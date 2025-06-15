const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const { auth } = require('../middleware/auth');
const { body } = require('express-validator');

// Validation middleware
const clienteValidation = [
  body('nome')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  body('telefone')
    .matches(/^(\(\d{2}\)\s?)?\d{4,5}-?\d{4}$/)
    .withMessage('Telefone inválido'),
  body('endereco')
    .isLength({ min: 5, max: 200 })
    .withMessage('Endereço deve ter entre 5 e 200 caracteres'),
  body('email')
    .isEmail()
    .withMessage('Email inválido'),
  body('cpf')
    .notEmpty()
    .withMessage('CPF é obrigatório'),
  body('forma_pagamento')
    .isIn(['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Pix', 'Boleto'])
    .withMessage('Forma de pagamento inválida'),
  body('rg')
    .notEmpty()
    .withMessage('RG é obrigatório')
];

// Routes
router.get('/', auth, clienteController.getAll);
router.get('/:id', auth, clienteController.getById);
router.post('/', auth, clienteValidation, clienteController.create);
router.put('/:id', auth, clienteValidation, clienteController.update);
router.delete('/:id', auth, clienteController.delete);

module.exports = router;
