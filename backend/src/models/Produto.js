const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schema for Produto (Product)
 */
const produtoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome do produto é obrigatório'],
    trim: true,
    minlength: [2, 'Nome deve ter pelo menos 2 caracteres'],
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  valor_custo: {
    type: Number,
    required: [true, 'Valor de custo é obrigatório'],
    min: [0, 'Valor de custo não pode ser negativo']
  },
  categoria: {
    type: String,
    required: [true, 'Categoria é obrigatória'],
    trim: true
  },
  valor_venda: {
    type: Number,
    required: [true, 'Valor de venda é obrigatório'],
    min: [0, 'Valor de venda não pode ser negativo'],
    validate: {
      validator: function(v) {
        // Valor de venda deve ser maior que o valor de custo
        return v > this.valor_custo;
      },
      message: 'Valor de venda deve ser maior que o valor de custo'
    }
  },
  fabr: {
    type: Schema.Types.ObjectId,
    ref: 'Fabricante',
    required: [true, 'Fabricante é obrigatório']
  }
}, {
  timestamps: true
});

// Índices para melhorar a performance de consultas
produtoSchema.index({ nome: 1 });
produtoSchema.index({ categoria: 1 });
produtoSchema.index({ fabr: 1 });

// Métodos de instância
produtoSchema.methods.getNome = function() {
  return this.nome;
};

produtoSchema.methods.setNome = function(nome) {
  this.nome = nome;
  return this;
};

produtoSchema.methods.getVC = function() {
  return this.valor_custo;
};

produtoSchema.methods.setVC = function(valor_custo) {
  this.valor_custo = valor_custo;
  return this;
};

produtoSchema.methods.getCat = function() {
  return this.categoria;
};

produtoSchema.methods.setCat = function(categoria) {
  this.categoria = categoria;
  return this;
};

produtoSchema.methods.getVV = function() {
  return this.valor_venda;
};

produtoSchema.methods.setVV = function(valor_venda) {
  this.valor_venda = valor_venda;
  return this;
};

produtoSchema.methods.getFabricanteProd = function() {
  return this.fabr;
};

produtoSchema.methods.setFabricanteProd = function(fabr) {
  this.fabr = fabr;
  return this;
};

produtoSchema.methods.toString = function() {
  return `Produto: ${this.nome}, Categoria: ${this.categoria}, Valor de Venda: ${this.valor_venda}`;
};

// Middleware para popular o fabricante ao consultar um produto
produtoSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'fabr',
    select: 'nome razao_social cnpj'
  });
  next();
});

// Método estático para buscar produtos por categoria
produtoSchema.statics.findByCategoria = function(categoria) {
  return this.find({ categoria: categoria });
};

// Método estático para buscar produtos por fabricante
produtoSchema.statics.findByFabricante = function(fabricanteId) {
  return this.find({ fabr: fabricanteId });
};

// Criação do modelo Produto
const Produto = mongoose.model('Produto', produtoSchema);

module.exports = Produto;
