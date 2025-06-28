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

/**
 * @swagger
 * components:
 *   schemas:
 *     Cliente:
 *       type: object
 *       required:
 *         - nome
 *         - telefone
 *         - endereco
 *         - email
 *         - cpf
 *         - forma_pagamento
 *         - rg
 *       properties:
 *         _id:
 *           type: string
 *           description: ID automático gerado pelo MongoDB
 *         nome:
 *           type: string
 *           description: Nome do cliente
 *         telefone:
 *           type: string
 *           description: Telefone do cliente
 *         endereco:
 *           type: string
 *           description: Endereço do cliente
 *         email:
 *           type: string
 *           description: Email do cliente
 *         cpf:
 *           type: string
 *           description: CPF do cliente
 *         forma_pagamento:
 *           type: string
 *           enum: ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Pix', 'Boleto']
 *           description: Forma de pagamento preferida do cliente
 *         rg:
 *           type: string
 *           description: RG do cliente
 *         tipo:
 *           type: string
 *           default: 'Cliente'
 *           description: Tipo do documento (discriminador)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do registro
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização
 */

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Retorna todos os clientes
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cliente'
 *       401:
 *         description: Não autorizado
 */
router.get('/', auth, clienteController.getAll);

/**
 * @swagger
 * /api/clientes/{id}:
 *   get:
 *     summary: Retorna um cliente pelo ID
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: Cliente não encontrado
 *       401:
 *         description: Não autorizado
 */
router.get('/:id', auth, clienteController.getById);

/**
 * @swagger
 * /api/clientes:
 *   post:
 *     summary: Cria um novo cliente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - telefone
 *               - endereco
 *               - email
 *               - cpf
 *               - forma_pagamento
 *               - rg
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "João Silva"
 *               telefone:
 *                 type: string
 *                 example: "(11) 98765-4321"
 *               endereco:
 *                 type: string
 *                 example: "Rua Exemplo, 123"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "joao@exemplo.com"
 *               cpf:
 *                 type: string
 *                 example: "123.456.789-00"
 *               forma_pagamento:
 *                 type: string
 *                 enum: ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Pix', 'Boleto']
 *                 example: "Pix"
 *               rg:
 *                 type: string
 *                 example: "12.345.678-9"
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.post('/', auth, clienteValidation, clienteController.create);

/**
 * @swagger
 * /api/clientes/{id}:
 *   put:
 *     summary: Atualiza um cliente existente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Cliente não encontrado
 *       401:
 *         description: Não autorizado
 */
router.put('/:id', auth, clienteValidation, clienteController.update);

/**
 * @swagger
 * /api/clientes/{id}:
 *   delete:
 *     summary: Remove um cliente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Cliente removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cliente removido com sucesso"
 *       404:
 *         description: Cliente não encontrado
 *       401:
 *         description: Não autorizado
 */
router.delete('/:id', auth, clienteController.delete);

module.exports = router;
