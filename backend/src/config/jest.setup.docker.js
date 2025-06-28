// Jest setup file for Docker environment
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Mock JWT para testes de autenticação
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('test-token'),
  verify: jest.fn().mockImplementation(() => ({ id: 'test-user-id' }))
}));

// Connect to the MongoDB container before all tests
beforeAll(async () => {
  const mongoUri = 'mongodb://mongodb:27017/sistema-vendas-test';
  
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clear all test data after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
  
  // Limpar todos os mocks após cada teste
  jest.clearAllMocks();
});

// Disconnect after all tests
afterAll(async () => {
  await mongoose.disconnect();
});

// Definir variáveis de ambiente para testes
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '1h';

// Global test timeout
jest.setTimeout(30000);
