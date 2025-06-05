const mongoose = require('mongoose');
const Pessoa = require('./Pessoa');
const validator = require('validator');

/**
 * Schema for Cliente (Customer)
 * Extends Pessoa base schema
 */
const clienteSchema = new mongoose.Schema({
  cpf: {
    type: String,
    required: [true, 'CPF é obrigatório'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        // Para ambiente de desenvolvimento, aceitar qualquer CPF com formato correto
        if (process.env.NODE_ENV === 'development') {
          // Verifica apenas o formato do CPF (XXX.XXX.XXX-XX)
          return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(v);
        }
        
        // Em produção, faz a validação completa
        // Remove caracteres não numéricos
        const cpf = v.replace(/[^\d]/g, '');
        
        // Verifica se tem 11 dígitos
        if (cpf.length !== 11) return false;
        
        // Verifica se todos os dígitos são iguais (caso inválido)
        if (/^(\d)\1{10}$/.test(cpf)) return false;
        
        // Validação do primeiro dígito verificador
        let soma = 0;
        for (let i = 0; i < 9; i++) {
          soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = 11 - (soma % 11);
        let dv1 = resto > 9 ? 0 : resto;
        
        // Validação do segundo dígito verificador
        soma = 0;
        for (let i = 0; i < 10; i++) {
          soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = 11 - (soma % 11);
        let dv2 = resto > 9 ? 0 : resto;
        
        return dv1 === parseInt(cpf.charAt(9)) && dv2 === parseInt(cpf.charAt(10));
      },
      message: props => `${props.value} não é um CPF válido!`
    }
  },
  forma_pagamento: {
    type: String,
    required: [true, 'Forma de pagamento é obrigatória'],
    enum: {
      values: ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Pix', 'Boleto'],
      message: '{VALUE} não é uma forma de pagamento válida!'
    }
  },
  rg: {
    type: String,
    required: [true, 'RG é obrigatório'],
    trim: true
  }
});

// Métodos de instância específicos para Cliente
clienteSchema.methods.getCpf = function() {
  return this.cpf;
};

clienteSchema.methods.setCpf = function(cpf) {
  this.cpf = cpf;
  return this;
};

clienteSchema.methods.getFormaPag = function() {
  return this.forma_pagamento;
};

clienteSchema.methods.setFormaPag = function(forma_pagamento) {
  this.forma_pagamento = forma_pagamento;
  return this;
};

clienteSchema.methods.getRG = function() {
  return this.rg;
};

clienteSchema.methods.setRG = function(rg) {
  this.rg = rg;
  return this;
};

clienteSchema.methods.toString = function() {
  return `Cliente: ${this.nome}, CPF: ${this.cpf}, Telefone: ${this.telefone}`;
};

// Criação do modelo Cliente como discriminador de Pessoa
const Cliente = Pessoa.discriminator('Cliente', clienteSchema);

module.exports = Cliente;
