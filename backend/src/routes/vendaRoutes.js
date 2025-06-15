const express = require('express');
const router = express.Router();
const vendaController = require('../controllers/vendaController');
const { auth } = require('../middleware/auth');
const { body } = require('express-validator');

// Validation middleware
const vendaValidation = [
  body('identificador')
    .notEmpty()
    .withMessage('Identificador é obrigatório'),
  body('dia')
    .isInt({ min: 1, max: 31 })
    .withMessage('Dia deve ser entre 1 e 31'),
  body('mes')
    .isInt({ min: 1, max: 12 })
    .withMessage('Mês deve ser entre 1 e 12'),
  body('ano')
    .isInt({ min: 2000 })
    .withMessage('Ano deve ser maior ou igual a 2000'),
  body('valor_total')
    .isFloat({ min: 0 })
    .withMessage('Valor total deve ser um número positivo'),
  body('clnt')
    .notEmpty()
    .withMessage('Cliente é obrigatório'),
  body('prod')
    .notEmpty()
    .withMessage('Produto é obrigatório')
];

// Routes
router.get('/', auth, vendaController.getAll);
router.get('/:id', auth, vendaController.getById);
router.post('/', auth, vendaValidation, vendaController.create);
router.put('/:id', auth, vendaValidation, vendaController.update);
router.delete('/:id', auth, vendaController.delete);

// Summary routes
router.get('/summary/month/:year', auth, vendaController.getSummaryByMonth);
router.get('/summary/cliente', auth, vendaController.getSummaryByCliente);

module.exports = router;
