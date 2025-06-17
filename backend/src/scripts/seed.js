const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Importar modelos
const Cliente = require('../models/Cliente');
const Fabricante = require('../models/Fabricante');
const Produto = require('../models/Produto');
const Venda = require('../models/Venda');
const User = require('../models/User');

// Configurar variáveis de ambiente
dotenv.config();

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sistema-vendas')
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => {
    console.error('Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  });

// Função para criar dados de exemplo
const seedDatabase = async () => {
  try {
    // Limpar coleções existentes
    await Cliente.deleteMany({});
    await Fabricante.deleteMany({});
    await Produto.deleteMany({});
    await Venda.deleteMany({});
    await User.deleteMany({});

    console.log('Coleções limpas com sucesso');

    // Criar usuários
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',  // Senha sem criptografia, o middleware do modelo vai criptografar
      role: 'admin'
    });

    const user = await User.create({
      username: 'user',
      email: 'user@example.com',
      password: 'user123',  // Senha sem criptografia, o middleware do modelo vai criptografar
      role: 'user'
    });

    console.log('Usuários criados com sucesso');

    // Criar clientes
    const cliente1 = await Cliente.create({
      nome: 'João Silva',
      telefone: '(61) 99999-9999',
      endereco: 'Rua das Flores, 123, Brasília-DF',
      email: 'joao.silva@email.com',
      cpf: '191.944.447-89',  // CPF válido
      forma_pagamento: 'Cartão de Crédito',
      rg: '1234567',
      tipo: 'Cliente'
    });

    const cliente2 = await Cliente.create({
      nome: 'Maria Oliveira',
      telefone: '(61) 88888-8888',
      endereco: 'Av. Central, 456, Brasília-DF',
      email: 'maria.oliveira@email.com',
      cpf: '071.488.018-05',  // CPF válido
      forma_pagamento: 'Pix',
      rg: '7654321',
      tipo: 'Cliente'
    });

    console.log('Clientes criados com sucesso');

    // Criar fabricantes
    const fabricante1 = await Fabricante.create({
      nome: 'Tech Solutions',
      telefone: '(11) 3333-3333',
      endereco: 'Av. Paulista, 1000, São Paulo-SP',
      email: 'contato@techsolutions.com',
      cnpj: '45.997.418/0001-53',  // CNPJ válido
      razao_social: 'Tech Solutions Ltda',
      contato: 'Carlos Mendes',
      tipo: 'Fabricante'
    });

    const fabricante2 = await Fabricante.create({
      nome: 'Eletrônicos Brasil',
      telefone: '(11) 4444-4444',
      endereco: 'Rua Augusta, 500, São Paulo-SP',
      email: 'contato@eletronicosbrasl.com',
      cnpj: '75.980.885/0001-31',  // CNPJ válido
      razao_social: 'Eletrônicos Brasil S.A.',
      contato: 'Ana Souza',
      tipo: 'Fabricante'
    });

    console.log('Fabricantes criados com sucesso');

    // Criar produtos
    const produto1 = await Produto.create({
      nome: 'Smartphone X',
      valor_custo: 1200,
      categoria: 'Eletrônicos',
      valor_venda: 2000,
      fabr: fabricante1._id
    });

    const produto2 = await Produto.create({
      nome: 'Notebook Pro',
      valor_custo: 3000,
      categoria: 'Informática',
      valor_venda: 4500,
      fabr: fabricante1._id
    });

    const produto3 = await Produto.create({
      nome: 'Smart TV 50"',
      valor_custo: 2000,
      categoria: 'Eletrônicos',
      valor_venda: 3200,
      fabr: fabricante2._id
    });

    console.log('Produtos criados com sucesso');

    // Criar vendas
    const venda1 = await Venda.create({
      identificador: 'V001',
      dia: 15,
      mes: 6,
      ano: 2025,
      valor_total: 2000,
      clnt: cliente1._id,
      prod: produto1._id
    });

    const venda2 = await Venda.create({
      identificador: 'V002',
      dia: 20,
      mes: 6,
      ano: 2025,
      valor_total: 4500,
      clnt: cliente2._id,
      prod: produto2._id
    });

    const venda3 = await Venda.create({
      identificador: 'V003',
      dia: 25,
      mes: 6,
      ano: 2025,
      valor_total: 3200,
      clnt: cliente1._id,
      prod: produto3._id
    });

    console.log('Vendas criadas com sucesso');
    console.log('Dados de exemplo criados com sucesso!');

    // Exibir credenciais de acesso
    console.log('\nCredenciais de acesso:');
    console.log('Admin - Email: admin@example.com, Senha: admin123');
    console.log('User - Email: user@example.com, Senha: user123');

    // Desconectar do MongoDB
    await mongoose.disconnect();
    console.log('Desconectado do MongoDB');
  } catch (error) {
    console.error('Erro ao criar dados de exemplo:', error);
    process.exit(1);
  }
};

// Executar função de seed
seedDatabase();
