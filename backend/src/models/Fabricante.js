const mongoose = require('mongoose');
const Pessoa = require('./Pessoa');
const validator = require('validator');

/**
 * Schema for Fabricante (Manufacturer)
 * Extends Pessoa base schema
 */
const fabricanteSchema = new mongoose.Schema({
  razao_social: {
    type: String,
    required: [true, 'Razão social é obrigatória'],
    trim: true,
    minlength: [3, 'Razão social deve ter pelo menos 3 caracteres'],
    maxlength: [150, 'Razão social deve ter no máximo 150 caracteres']
  },
  cnpj: {
    type: String,
    required: [true, 'CNPJ é obrigatório'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        // Remove caracteres não numéricos
        const cnpj = v.replace(/[^\d]/g, '');
        
        // Verifica se tem 14 dígitos
        if (cnpj.length !== 14) return false;
        
        // Verifica se todos os dígitos são iguais (caso inválido)
        if (/^(\d)\1{13}$/.test(cnpj)) return false;
        
        // Validação do primeiro dígito verificador
        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        const digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        
        for (let i = tamanho; i >= 1; i--) {
          soma += numeros.charAt(tamanho - i) * pos--;
          if (pos < 2) pos = 9;
        }
        
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado !== parseInt(digitos.charAt(0))) return false;
        
        // Validação do segundo dígito verificador
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        
        for (let i = tamanho; i >= 1; i--) {
          soma += numeros.charAt(tamanho - i) * pos--;
          if (pos < 2) pos = 9;
        }
        
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        return resultado === parseInt(digitos.charAt(1));
      },
      message: props => `${props.value} não é um CNPJ válido!`
    }
  },
  contato: {
    type: String,
    required: [true, 'Nome do contato é obrigatório'],
    trim: true
  }
});

// Métodos de instância específicos para Fabricante
fabricanteSchema.methods.getRZ = function() {
  return this.razao_social;
};

fabricanteSchema.methods.setRZ = function(razao_social) {
  this.razao_social = razao_social;
  return this;
};

fabricanteSchema.methods.getCN = function() {
  return this.cnpj;
};

fabricanteSchema.methods.setCN = function(cnpj) {
  this.cnpj = cnpj;
  return this;
};

fabricanteSchema.methods.getCONT = function() {
  return this.contato;
};

fabricanteSchema.methods.setCONT = function(contato) {
  this.contato = contato;
  return this;
};

fabricanteSchema.methods.toString = function() {
  return `Fabricante: ${this.nome}, CNPJ: ${this.cnpj}, Razão Social: ${this.razao_social}`;
};

// Criação do modelo Fabricante como discriminador de Pessoa
const Fabricante = Pessoa.discriminator('Fabricante', fabricanteSchema);

module.exports = Fabricante;
