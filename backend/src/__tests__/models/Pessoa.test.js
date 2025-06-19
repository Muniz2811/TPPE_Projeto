const mongoose = require('mongoose');
const Pessoa = require('../../models/Pessoa');

describe('Pessoa Model', () => {
  // Test data
  const pessoaData = {
    nome: 'João Silva',
    telefone: '(61) 99999-9999',
    endereco: 'Rua Teste, 123, Brasília-DF',
    email: 'joao.silva@email.com'
  };

  // Test suite for validation
  describe('Validation', () => {
    it('should validate a valid pessoa', async () => {
      const pessoa = new Pessoa(pessoaData);
      const validationError = pessoa.validateSync();
      expect(validationError).toBeUndefined();
    });

    it('should require nome', async () => {
      const pessoa = new Pessoa({ ...pessoaData, nome: undefined });
      const validationError = pessoa.validateSync();
      expect(validationError.errors.nome).toBeDefined();
      expect(validationError.errors.nome.message).toContain('obrigatório');
    });

    it('should require telefone', async () => {
      const pessoa = new Pessoa({ ...pessoaData, telefone: undefined });
      const validationError = pessoa.validateSync();
      expect(validationError.errors.telefone).toBeDefined();
      expect(validationError.errors.telefone.message).toContain('obrigatório');
    });

    it('should require endereco', async () => {
      const pessoa = new Pessoa({ ...pessoaData, endereco: undefined });
      const validationError = pessoa.validateSync();
      expect(validationError.errors.endereco).toBeDefined();
      expect(validationError.errors.endereco.message).toContain('obrigatório');
    });

    it('should require email', async () => {
      const pessoa = new Pessoa({ ...pessoaData, email: undefined });
      const validationError = pessoa.validateSync();
      expect(validationError.errors.email).toBeDefined();
      expect(validationError.errors.email.message).toContain('obrigatório');
    });

    it('should validate email format', async () => {
      const pessoa = new Pessoa({ ...pessoaData, email: 'email-invalido' });
      const validationError = pessoa.validateSync();
      expect(validationError.errors.email).toBeDefined();
      expect(validationError.errors.email.message).toContain('não é um email válido');
    });

    it('should validate telefone format', async () => {
      const pessoa = new Pessoa({ ...pessoaData, telefone: '123' });
      const validationError = pessoa.validateSync();
      expect(validationError.errors.telefone).toBeDefined();
      expect(validationError.errors.telefone.message).toContain('não é um telefone válido');
    });
  });

  // Test suite for instance methods
  describe('Instance Methods', () => {
    let pessoa;

    beforeEach(() => {
      pessoa = new Pessoa(pessoaData);
    });

    it('should get nome correctly', () => {
      expect(pessoa.getNome()).toBe(pessoaData.nome);
    });

    it('should set nome correctly', () => {
      pessoa.setNome('Maria Silva');
      expect(pessoa.nome).toBe('Maria Silva');
      expect(pessoa.getNome()).toBe('Maria Silva');
    });

    it('should get telefone correctly', () => {
      expect(pessoa.getTelefone()).toBe(pessoaData.telefone);
    });

    it('should set telefone correctly', () => {
      pessoa.setTelefone('(61) 88888-8888');
      expect(pessoa.telefone).toBe('(61) 88888-8888');
      expect(pessoa.getTelefone()).toBe('(61) 88888-8888');
    });

    it('should get endereco correctly', () => {
      expect(pessoa.getEndereco()).toBe(pessoaData.endereco);
    });

    it('should set endereco correctly', () => {
      pessoa.setEndereco('Av. Principal, 456, Brasília-DF');
      expect(pessoa.endereco).toBe('Av. Principal, 456, Brasília-DF');
      expect(pessoa.getEndereco()).toBe('Av. Principal, 456, Brasília-DF');
    });

    it('should get email correctly', () => {
      expect(pessoa.getEmail()).toBe(pessoaData.email);
    });

    it('should set email correctly', () => {
      pessoa.setEmail('maria.silva@email.com');
      expect(pessoa.email).toBe('maria.silva@email.com');
      expect(pessoa.getEmail()).toBe('maria.silva@email.com');
    });
  });

  // Test suite for saving to database
  describe('Save to Database', () => {
    it('should save a valid pessoa to database', async () => {
      const pessoa = new Pessoa(pessoaData);
      const savedPessoa = await pessoa.save();
      
      expect(savedPessoa._id).toBeDefined();
      expect(savedPessoa.nome).toBe(pessoaData.nome);
      expect(savedPessoa.telefone).toBe(pessoaData.telefone);
      expect(savedPessoa.endereco).toBe(pessoaData.endereco);
      expect(savedPessoa.email).toBe(pessoaData.email);
    });
  });
});
