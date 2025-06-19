const mongoose = require('mongoose');
const Cliente = require('../../models/Cliente');

describe('Cliente Model', () => {
  // Test data
  const clienteData = {
    nome: 'Maria Silva',
    telefone: '(61) 99999-9999',
    endereco: 'Rua Teste, 123, Brasília-DF',
    email: 'maria.silva@email.com',
    cpf: '123.456.789-00',
    forma_pagamento: 'Cartão de Crédito',
    rg: '1234567'
  };

  // Test suite for validation
  describe('Validation', () => {
    it('should validate a valid cliente', async () => {
      const cliente = new Cliente(clienteData);
      const validationError = cliente.validateSync();
      expect(validationError).toBeUndefined();
    });

    it('should require cpf', async () => {
      const cliente = new Cliente({ ...clienteData, cpf: undefined });
      const validationError = cliente.validateSync();
      expect(validationError.errors.cpf).toBeDefined();
      expect(validationError.errors.cpf.message).toContain('obrigatório');
    });

    it('should require forma_pagamento', async () => {
      const cliente = new Cliente({ ...clienteData, forma_pagamento: undefined });
      const validationError = cliente.validateSync();
      expect(validationError.errors.forma_pagamento).toBeDefined();
      expect(validationError.errors.forma_pagamento.message).toContain('obrigatório');
    });

    it('should require rg', async () => {
      const cliente = new Cliente({ ...clienteData, rg: undefined });
      const validationError = cliente.validateSync();
      expect(validationError.errors.rg).toBeDefined();
      expect(validationError.errors.rg.message).toContain('obrigatório');
    });

    it('should validate forma_pagamento enum values', async () => {
      const cliente = new Cliente({ ...clienteData, forma_pagamento: 'Método Inválido' });
      const validationError = cliente.validateSync();
      expect(validationError.errors.forma_pagamento).toBeDefined();
      expect(validationError.errors.forma_pagamento.message).toContain('is not a valid enum value');
    });

    it('should set tipo as Cliente', () => {
      const cliente = new Cliente(clienteData);
      expect(cliente.tipo).toBe('Cliente');
    });
  });

  // Test suite for instance methods
  describe('Instance Methods', () => {
    let cliente;

    beforeEach(() => {
      cliente = new Cliente(clienteData);
    });

    it('should get cpf correctly', () => {
      expect(cliente.getCpf()).toBe(clienteData.cpf);
    });

    it('should set cpf correctly', () => {
      cliente.setCpf('987.654.321-00');
      expect(cliente.cpf).toBe('987.654.321-00');
      expect(cliente.getCpf()).toBe('987.654.321-00');
    });

    it('should get forma_pagamento correctly', () => {
      expect(cliente.getFormaPagamento()).toBe(clienteData.forma_pagamento);
    });

    it('should set forma_pagamento correctly', () => {
      cliente.setFormaPagamento('Pix');
      expect(cliente.forma_pagamento).toBe('Pix');
      expect(cliente.getFormaPagamento()).toBe('Pix');
    });

    it('should get rg correctly', () => {
      expect(cliente.getRg()).toBe(clienteData.rg);
    });

    it('should set rg correctly', () => {
      cliente.setRg('7654321');
      expect(cliente.rg).toBe('7654321');
      expect(cliente.getRg()).toBe('7654321');
    });

    // Inherited methods from Pessoa
    it('should get nome correctly (inherited)', () => {
      expect(cliente.getNome()).toBe(clienteData.nome);
    });

    it('should set nome correctly (inherited)', () => {
      cliente.setNome('João Silva');
      expect(cliente.nome).toBe('João Silva');
      expect(cliente.getNome()).toBe('João Silva');
    });
  });

  // Test suite for saving to database
  describe('Save to Database', () => {
    it('should save a valid cliente to database', async () => {
      const cliente = new Cliente(clienteData);
      const savedCliente = await cliente.save();
      
      expect(savedCliente._id).toBeDefined();
      expect(savedCliente.nome).toBe(clienteData.nome);
      expect(savedCliente.cpf).toBe(clienteData.cpf);
      expect(savedCliente.forma_pagamento).toBe(clienteData.forma_pagamento);
      expect(savedCliente.rg).toBe(clienteData.rg);
      expect(savedCliente.tipo).toBe('Cliente');
    });

    it('should find cliente by CPF', async () => {
      // First save a cliente
      const cliente = new Cliente(clienteData);
      await cliente.save();
      
      // Then find by CPF
      const foundCliente = await Cliente.findOne({ cpf: clienteData.cpf });
      expect(foundCliente).toBeDefined();
      expect(foundCliente.nome).toBe(clienteData.nome);
    });
  });
});
