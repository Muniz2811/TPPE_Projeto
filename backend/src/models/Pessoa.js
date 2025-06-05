const mongoose = require('mongoose');
const validator = require('validator');

/**
 * Base schema for Pessoa (Person)
 * Abstract base class for Cliente and Fabricante
 */
const pessoaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    minlength: [2, 'Nome deve ter pelo menos 2 caracteres'],
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  telefone: {
    type: String,
    required: [true, 'Telefone é obrigatório'],
    trim: true,
    validate: {
      validator: function(v) {
        // Aceita formatos: (XX) XXXXX-XXXX ou XXXXXXXXXXX
        return /^(\(\d{2}\)\s?)?\d{4,5}-?\d{4}$/.test(v);
      },
      message: props => `${props.value} não é um telefone válido!`
    }
  },
  endereco: {
    type: String,
    required: [true, 'Endereço é obrigatório'],
    trim: true,
    minlength: [5, 'Endereço deve ter pelo menos 5 caracteres'],
    maxlength: [200, 'Endereço deve ter no máximo 200 caracteres']
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    trim: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: props => `${props.value} não é um email válido!`
    }
  }
}, {
  discriminatorKey: 'tipo', // Campo usado para diferenciar os tipos de pessoa
  timestamps: true, // Adiciona campos createdAt e updatedAt
  collection: 'pessoas' // Nome da coleção no MongoDB
});

// Métodos virtuais para obter e definir propriedades
pessoaSchema.virtual('nomeCompleto').get(function() {
  return this.nome;
});

// Métodos de instância
pessoaSchema.methods.getNome = function() {
  return this.nome;
};

pessoaSchema.methods.setNome = function(nome) {
  this.nome = nome;
  return this;
};

pessoaSchema.methods.getTelefone = function() {
  return this.telefone;
};

pessoaSchema.methods.setTelefone = function(telefone) {
  this.telefone = telefone;
  return this;
};

pessoaSchema.methods.getEndereco = function() {
  return this.endereco;
};

pessoaSchema.methods.setEndereco = function(endereco) {
  this.endereco = endereco;
  return this;
};

pessoaSchema.methods.getEmail = function() {
  return this.email;
};

pessoaSchema.methods.setEmail = function(email) {
  this.email = email;
  return this;
};

// Criação do modelo Pessoa
const Pessoa = mongoose.model('Pessoa', pessoaSchema);

module.exports = Pessoa;
