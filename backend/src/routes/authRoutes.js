const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { body } = require('express-validator');

// Validation middleware
const registerValidation = [
  body('username')
    .isLength({ min: 3, max: 50 })
    .withMessage('Nome de usuário deve ter entre 3 e 50 caracteres'),
  body('email')
    .isEmail()
    .withMessage('Email inválido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email inválido'),
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória')
];

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nome de usuário
 *                 example: usuario123
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *                 example: usuario@exemplo.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Senha do usuário (mínimo 6 caracteres)
 *                 example: senha123
 *               role:
 *                 type: string
 *                 description: Papel do usuário (opcional)
 *                 enum: [user, admin]
 *                 default: user
 *                 example: user
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: Token JWT
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         username:
 *                           type: string
 *                         email:
 *                           type: string
 *                         role:
 *                           type: string
 *       400:
 *         description: Dados inválidos
 */
router.post('/register', registerValidation, authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autentica um usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *                 example: usuario@exemplo.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Senha do usuário
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: Token JWT
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         username:
 *                           type: string
 *                         email:
 *                           type: string
 *                         role:
 *                           type: string
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', loginValidation, authController.login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Obtém o perfil do usuário autenticado
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Não autorizado - Token inválido ou não fornecido
 */
router.get('/profile', auth, authController.getProfile);

module.exports = router;
