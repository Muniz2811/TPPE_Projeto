const express = require('express');
const router = express.Router();
const fabricanteController = require('../controllers/fabricanteController');
const { auth } = require('../middleware/auth');
const { body } = require('express-validator');

// Validation middleware
const fabricanteValidation = [
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
  body('razao_social')
    .isLength({ min: 3, max: 150 })
    .withMessage('Razão social deve ter entre 3 e 150 caracteres'),
  body('cnpj')
    .notEmpty()
    .withMessage('CNPJ é obrigatório'),
  body('contato')
    .notEmpty()
    .withMessage('Nome do contato é obrigatório')
];

// Routes
router.get('/', auth, fabricanteController.getAll);
router.get('/:id', auth, fabricanteController.getById);
router.post('/', auth, fabricanteValidation, fabricanteController.create);
router.put('/:id', auth, fabricanteValidation, fabricanteController.update);
router.delete('/:id', auth, fabricanteController.delete);

module.exports = router;
