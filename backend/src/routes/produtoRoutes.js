const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const { auth } = require('../middleware/auth');
const { body } = require('express-validator');

// Validation middleware
const produtoValidation = [
  body('nome')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  body('valor_custo')
    .isFloat({ min: 0 })
    .withMessage('Valor de custo deve ser um número positivo'),
  body('categoria')
    .notEmpty()
    .withMessage('Categoria é obrigatória'),
  body('valor_venda')
    .isFloat({ min: 0 })
    .withMessage('Valor de venda deve ser um número positivo'),
  body('fabr')
    .notEmpty()
    .withMessage('Fabricante é obrigatório')
];

// Routes
router.get('/', auth, produtoController.getAll);
router.get('/:id', auth, produtoController.getById);
router.post('/', auth, produtoValidation, produtoController.create);
router.put('/:id', auth, produtoValidation, produtoController.update);
router.delete('/:id', auth, produtoController.delete);

module.exports = router;
