const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schema for Venda (Sale)
 */
const vendaSchema = new mongoose.Schema({
  identificador: {
    type: String,
    required: [true, 'Identificador é obrigatório'],
    unique: true,
    trim: true
  },
  dia: {
    type: Number,
    required: [true, 'Dia é obrigatório'],
    min: [1, 'Dia deve ser entre 1 e 31'],
    max: [31, 'Dia deve ser entre 1 e 31']
  },
  mes: {
    type: Number,
    required: [true, 'Mês é obrigatório'],
    min: [1, 'Mês deve ser entre 1 e 12'],
    max: [12, 'Mês deve ser entre 1 e 12']
  },
  ano: {
    type: Number,
    required: [true, 'Ano é obrigatório'],
    min: [2000, 'Ano deve ser maior ou igual a 2000']
  },
  valor_total: {
    type: Number,
    required: [true, 'Valor total é obrigatório'],
    min: [0, 'Valor total não pode ser negativo']
  },
  clnt: {
    type: Schema.Types.ObjectId,
    ref: 'Cliente',
    required: [true, 'Cliente é obrigatório']
  },
  prod: {
    type: Schema.Types.ObjectId,
    ref: 'Produto',
    required: [true, 'Produto é obrigatório']
  }
}, {
  timestamps: true
});

// Índices para melhorar a performance de consultas
vendaSchema.index({ identificador: 1 });
vendaSchema.index({ ano: 1, mes: 1, dia: 1 });
vendaSchema.index({ clnt: 1 });
vendaSchema.index({ prod: 1 });

// Validação personalizada para verificar a data
vendaSchema.path('dia').validate(function(value) {
  const dia = value;
  const mes = this.mes;
  const ano = this.ano;
  
  // Verifica se a data é válida
  const data = new Date(ano, mes - 1, dia);
  return data.getDate() === dia && 
         data.getMonth() === mes - 1 && 
         data.getFullYear() === ano;
}, 'Data inválida');

// Métodos de instância
vendaSchema.methods.getIdentif = function() {
  return this.identificador;
};

vendaSchema.methods.setIdentif = function(identificador) {
  this.identificador = identificador;
  return this;
};

vendaSchema.methods.getDia = function() {
  return this.dia;
};

vendaSchema.methods.setDia = function(dia) {
  this.dia = dia;
  return this;
};

vendaSchema.methods.getMes = function() {
  return this.mes;
};

vendaSchema.methods.setMes = function(mes) {
  this.mes = mes;
  return this;
};

vendaSchema.methods.getAno = function() {
  return this.ano;
};

vendaSchema.methods.setAno = function(ano) {
  this.ano = ano;
  return this;
};

vendaSchema.methods.getVT = function() {
  return this.valor_total;
};

vendaSchema.methods.setVT = function(valor_total) {
  this.valor_total = valor_total;
  return this;
};

vendaSchema.methods.getClienteVenda = function() {
  return this.clnt;
};

vendaSchema.methods.setClienteVenda = function(clnt) {
  this.clnt = clnt;
  return this;
};

vendaSchema.methods.getProdVenda = function() {
  return this.prod;
};

vendaSchema.methods.setProdVenda = function(prod) {
  this.prod = prod;
  return this;
};

vendaSchema.methods.toString = function() {
  return `Venda: ${this.identificador}, Data: ${this.dia}/${this.mes}/${this.ano}, Valor Total: ${this.valor_total}`;
};

// Middleware para popular o cliente e produto ao consultar uma venda
vendaSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'clnt',
    select: 'nome cpf telefone'
  }).populate({
    path: 'prod',
    select: 'nome valor_venda categoria'
  });
  next();
});

// Método estático para buscar vendas por período
vendaSchema.statics.findByPeriodo = function(dataInicio, dataFim) {
  return this.find({
    $or: [
      // Vendas no mesmo ano
      {
        ano: dataInicio.getFullYear(),
        $and: [
          { mes: { $gte: dataInicio.getMonth() + 1 } },
          { mes: { $lte: dataFim.getMonth() + 1 } }
        ]
      },
      // Vendas em anos diferentes
      {
        $and: [
          { ano: { $gt: dataInicio.getFullYear() } },
          { ano: { $lt: dataFim.getFullYear() } }
        ]
      },
      // Vendas no ano inicial mas mês posterior
      {
        ano: dataInicio.getFullYear(),
        mes: { $gt: dataInicio.getMonth() + 1 }
      },
      // Vendas no ano final mas mês anterior
      {
        ano: dataFim.getFullYear(),
        mes: { $lt: dataFim.getMonth() + 1 }
      }
    ]
  });
};

// Método estático para buscar vendas por cliente
vendaSchema.statics.findByCliente = function(clienteId) {
  return this.find({ clnt: clienteId });
};

// Criação do modelo Venda
const Venda = mongoose.model('Venda', vendaSchema);

module.exports = Venda;
