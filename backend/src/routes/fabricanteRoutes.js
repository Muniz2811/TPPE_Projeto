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

/**
 * @swagger
 * components:
 *   schemas:
 *     Fabricante:
 *       type: object
 *       required:
 *         - nome
 *         - telefone
 *         - endereco
 *         - email
 *         - razao_social
 *         - cnpj
 *         - contato
 *       properties:
 *         _id:
 *           type: string
 *           description: ID automático gerado pelo MongoDB
 *         nome:
 *           type: string
 *           description: Nome do fabricante
 *         telefone:
 *           type: string
 *           description: Telefone do fabricante
 *         endereco:
 *           type: string
 *           description: Endereço do fabricante
 *         email:
 *           type: string
 *           description: Email do fabricante
 *         razao_social:
 *           type: string
 *           description: Razão social da empresa
 *         cnpj:
 *           type: string
 *           description: CNPJ da empresa
 *         contato:
 *           type: string
 *           description: Nome da pessoa de contato
 *         tipo:
 *           type: string
 *           default: 'Fabricante'
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
 * /api/fabricantes:
 *   get:
 *     summary: Retorna todos os fabricantes
 *     tags: [Fabricantes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de fabricantes
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
 *                     $ref: '#/components/schemas/Fabricante'
 *       401:
 *         description: Não autorizado
 */
router.get('/', auth, fabricanteController.getAll);

/**
 * @swagger
 * /api/fabricantes/{id}:
 *   get:
 *     summary: Retorna um fabricante pelo ID
 *     tags: [Fabricantes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do fabricante
 *     responses:
 *       200:
 *         description: Fabricante encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Fabricante'
 *       404:
 *         description: Fabricante não encontrado
 *       401:
 *         description: Não autorizado
 */
router.get('/:id', auth, fabricanteController.getById);

/**
 * @swagger
 * /api/fabricantes:
 *   post:
 *     summary: Cria um novo fabricante
 *     tags: [Fabricantes]
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
 *               - razao_social
 *               - cnpj
 *               - contato
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Empresa XYZ"
 *               telefone:
 *                 type: string
 *                 example: "(11) 3456-7890"
 *               endereco:
 *                 type: string
 *                 example: "Av. Industrial, 1000"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "contato@empresaxyz.com"
 *               razao_social:
 *                 type: string
 *                 example: "Empresa XYZ Ltda."
 *               cnpj:
 *                 type: string
 *                 example: "12.345.678/0001-90"
 *               contato:
 *                 type: string
 *                 example: "Maria Silva"
 *     responses:
 *       201:
 *         description: Fabricante criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Fabricante'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.post('/', auth, fabricanteValidation, fabricanteController.create);

/**
 * @swagger
 * /api/fabricantes/{id}:
 *   put:
 *     summary: Atualiza um fabricante existente
 *     tags: [Fabricantes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do fabricante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Fabricante'
 *     responses:
 *       200:
 *         description: Fabricante atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Fabricante'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Fabricante não encontrado
 *       401:
 *         description: Não autorizado
 */
router.put('/:id', auth, fabricanteValidation, fabricanteController.update);

/**
 * @swagger
 * /api/fabricantes/{id}:
 *   delete:
 *     summary: Remove um fabricante
 *     tags: [Fabricantes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do fabricante
 *     responses:
 *       200:
 *         description: Fabricante removido com sucesso
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
 *                   example: "Fabricante removido com sucesso"
 *       404:
 *         description: Fabricante não encontrado
 *       401:
 *         description: Não autorizado
 */
router.delete('/:id', auth, fabricanteController.delete);

module.exports = router;
