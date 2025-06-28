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

/**
 * @swagger
 * components:
 *   schemas:
 *     Venda:
 *       type: object
 *       required:
 *         - identificador
 *         - dia
 *         - mes
 *         - ano
 *         - valor_total
 *         - clnt
 *         - prod
 *       properties:
 *         _id:
 *           type: string
 *           description: ID automático gerado pelo MongoDB
 *         identificador:
 *           type: string
 *           description: Identificador único da venda
 *         dia:
 *           type: integer
 *           minimum: 1
 *           maximum: 31
 *           description: Dia da venda
 *         mes:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           description: Mês da venda
 *         ano:
 *           type: integer
 *           minimum: 2000
 *           description: Ano da venda
 *         valor_total:
 *           type: number
 *           format: float
 *           description: Valor total da venda
 *         clnt:
 *           type: string
 *           description: ID do cliente (referência)
 *         prod:
 *           type: string
 *           description: ID do produto (referência)
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
 * /api/vendas:
 *   get:
 *     summary: Retorna todas as vendas
 *     tags: [Vendas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de vendas
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
 *                     $ref: '#/components/schemas/Venda'
 *       401:
 *         description: Não autorizado
 */
router.get('/', auth, vendaController.getAll);

/**
 * @swagger
 * /api/vendas/{id}:
 *   get:
 *     summary: Retorna uma venda pelo ID
 *     tags: [Vendas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da venda
 *     responses:
 *       200:
 *         description: Venda encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Venda'
 *       404:
 *         description: Venda não encontrada
 *       401:
 *         description: Não autorizado
 */
router.get('/:id', auth, vendaController.getById);

/**
 * @swagger
 * /api/vendas:
 *   post:
 *     summary: Cria uma nova venda
 *     tags: [Vendas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identificador
 *               - dia
 *               - mes
 *               - ano
 *               - valor_total
 *               - clnt
 *               - prod
 *             properties:
 *               identificador:
 *                 type: string
 *                 example: "V2023001"
 *               dia:
 *                 type: integer
 *                 example: 15
 *               mes:
 *                 type: integer
 *                 example: 6
 *               ano:
 *                 type: integer
 *                 example: 2023
 *               valor_total:
 *                 type: number
 *                 format: float
 *                 example: 1200.00
 *               clnt:
 *                 type: string
 *                 example: "60d21b4667d0d8992e610c85"
 *               prod:
 *                 type: string
 *                 example: "60d21b4667d0d8992e610c86"
 *     responses:
 *       201:
 *         description: Venda criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Venda'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.post('/', auth, vendaValidation, vendaController.create);

/**
 * @swagger
 * /api/vendas/{id}:
 *   put:
 *     summary: Atualiza uma venda existente
 *     tags: [Vendas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da venda
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Venda'
 *     responses:
 *       200:
 *         description: Venda atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Venda'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Venda não encontrada
 *       401:
 *         description: Não autorizado
 */
router.put('/:id', auth, vendaValidation, vendaController.update);

/**
 * @swagger
 * /api/vendas/{id}:
 *   delete:
 *     summary: Remove uma venda
 *     tags: [Vendas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da venda
 *     responses:
 *       200:
 *         description: Venda removida com sucesso
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
 *                   example: "Venda removida com sucesso"
 *       404:
 *         description: Venda não encontrada
 *       401:
 *         description: Não autorizado
 */
router.delete('/:id', auth, vendaController.delete);

/**
 * @swagger
 * /api/vendas/summary/month/{year}:
 *   get:
 *     summary: Retorna um resumo de vendas por mês para um ano específico
 *     tags: [Vendas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *         description: Ano para filtrar o resumo
 *     responses:
 *       200:
 *         description: Resumo de vendas por mês
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
 *                     type: object
 *                     properties:
 *                       mes:
 *                         type: integer
 *                         example: 6
 *                       total:
 *                         type: number
 *                         example: 5000
 *                       count:
 *                         type: integer
 *                         example: 10
 *       401:
 *         description: Não autorizado
 */
router.get('/summary/month/:year', auth, vendaController.getSummaryByMonth);

/**
 * @swagger
 * /api/vendas/summary/cliente:
 *   get:
 *     summary: Retorna um resumo de vendas por cliente
 *     tags: [Vendas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumo de vendas por cliente
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
 *                     type: object
 *                     properties:
 *                       cliente:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "60d21b4667d0d8992e610c85"
 *                           nome:
 *                             type: string
 *                             example: "João Silva"
 *                       total:
 *                         type: number
 *                         example: 3500
 *                       count:
 *                         type: integer
 *                         example: 7
 *       401:
 *         description: Não autorizado
 */
router.get('/summary/cliente', auth, vendaController.getSummaryByCliente);

module.exports = router;
