const mongoose = require('mongoose');
const request = require('supertest');
const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');
const authController = require('../../controllers/authController');
const { auth } = require('../../middleware/auth');

// Mock express app for testing
const app = express();
app.use(express.json());

// Mock validation middleware
const registerValidation = [
  body('username').isLength({ min: 3 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
];

const loginValidation = [
  body('email').isEmail(),
  body('password').notEmpty()
];

// Setup routes for testing
app.post('/api/auth/register', registerValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, authController.register);

app.post('/api/auth/login', loginValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, authController.login);

app.get('/api/auth/profile', auth, authController.getProfile);

describe('Auth Controller', () => {
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    role: 'user'
  };
  
  const adminUser = {
    username: 'adminuser',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  };
  
  beforeEach(async () => {
    // Clear users collection before each test
    await User.deleteMany({});
  });
  
  describe('Register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('username', testUser.username);
      expect(res.body.data.user).toHaveProperty('email', testUser.email);
      expect(res.body.data.user).not.toHaveProperty('password');
      
      // Verify user was saved to database
      const user = await User.findOne({ email: testUser.email });
      expect(user).toBeDefined();
      expect(user.username).toBe(testUser.username);
    });
    
    it('should not register a user with invalid data', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'te',  // Too short
          email: 'invalid-email',
          password: '123'  // Too short
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });
    
    it('should not register a user with duplicate email', async () => {
      // First create a user
      await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      // Try to create another user with same email
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'anotheruser',
          email: testUser.email,
          password: 'password456'
        });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('já está em uso');
    });
  });
  
  describe('Login', () => {
    beforeEach(async () => {
      // Create a test user for login tests
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(testUser.password, salt);
      
      await User.create({
        ...testUser,
        password: hashedPassword
      });
    });
    
    it('should login a user with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user).toHaveProperty('username', testUser.username);
      expect(res.body.data.user).toHaveProperty('email', testUser.email);
      expect(res.body.data.user).not.toHaveProperty('password');
    });
    
    it('should not login with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: testUser.password
        });
      
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Credenciais inválidas');
    });
    
    it('should not login with invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });
      
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Credenciais inválidas');
    });
  });
  
  describe('Get Profile', () => {
    let token;
    
    beforeEach(async () => {
      // Create a test user and get token
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(testUser.password, salt);
      
      const user = await User.create({
        ...testUser,
        password: hashedPassword
      });
      
      token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'jwt_secret',
        { expiresIn: '1h' }
      );
    });
    
    it('should get user profile with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('username', testUser.username);
      expect(res.body.data).toHaveProperty('email', testUser.email);
      expect(res.body.data).not.toHaveProperty('password');
    });
    
    it('should not get profile without token', async () => {
      const res = await request(app)
        .get('/api/auth/profile');
      
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Token não fornecido');
    });
    
    it('should not get profile with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token');
      
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Token inválido');
    });
  });
});
