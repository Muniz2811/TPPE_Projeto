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

/**
 * @swagger
 * components:
 *   schemas:
 *     Produto:
 *       type: object
 *       required:
 *         - nome
 *         - valor_custo
 *         - categoria
 *         - valor_venda
 *         - fabr
 *       properties:
 *         _id:
 *           type: string
 *           description: ID automático gerado pelo MongoDB
 *         nome:
 *           type: string
 *           description: Nome do produto
 *         valor_custo:
 *           type: number
 *           format: float
 *           description: Valor de custo do produto
 *         categoria:
 *           type: string
 *           description: Categoria do produto
 *         valor_venda:
 *           type: number
 *           format: float
 *           description: Valor de venda do produto
 *         fabr:
 *           type: string
 *           description: ID do fabricante (referência)
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
 * /api/produtos:
 *   get:
 *     summary: Retorna todos os produtos
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de produtos
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
 *                     $ref: '#/components/schemas/Produto'
 *       401:
 *         description: Não autorizado
 */
router.get('/', auth, produtoController.getAll);

/**
 * @swagger
 * /api/produtos/{id}:
 *   get:
 *     summary: Retorna um produto pelo ID
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Produto'
 *       404:
 *         description: Produto não encontrado
 *       401:
 *         description: Não autorizado
 */
router.get('/:id', auth, produtoController.getById);

/**
 * @swagger
 * /api/produtos:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Produtos]
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
 *               - valor_custo
 *               - categoria
 *               - valor_venda
 *               - fabr
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Smartphone XYZ"
 *               valor_custo:
 *                 type: number
 *                 format: float
 *                 example: 800.00
 *               categoria:
 *                 type: string
 *                 example: "Eletrônicos"
 *               valor_venda:
 *                 type: number
 *                 format: float
 *                 example: 1200.00
 *               fabr:
 *                 type: string
 *                 example: "60d21b4667d0d8992e610c85"
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Produto'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.post('/', auth, produtoValidation, produtoController.create);

/**
 * @swagger
 * /api/produtos/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Produto'
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Produto'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Produto não encontrado
 *       401:
 *         description: Não autorizado
 */
router.put('/:id', auth, produtoValidation, produtoController.update);

/**
 * @swagger
 * /api/produtos/{id}:
 *   delete:
 *     summary: Remove um produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto removido com sucesso
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
 *                   example: "Produto removido com sucesso"
 *       404:
 *         description: Produto não encontrado
 *       401:
 *         description: Não autorizado
 */
router.delete('/:id', auth, produtoController.delete);

module.exports = router;
