const BaseRepository = require('./BaseRepository');
const Produto = require('../models/Produto');

/**
 * Produto Repository
 * Extends BaseRepository with Produto-specific operations
 */
class ProdutoRepository extends BaseRepository {
  constructor() {
    super(Produto);
  }

  /**
   * Find produtos by categoria
   * @param {String} categoria - Produto categoria
   * @returns {Promise<Document[]>} Array of produtos
   */
  async findByCategoria(categoria) {
    return await this.model.findByCategoria(categoria);
  }

  /**
   * Find produtos by fabricante
   * @param {String} fabricanteId - Fabricante ID
   * @returns {Promise<Document[]>} Array of produtos
   */
  async findByFabricante(fabricanteId) {
    return await this.model.findByFabricante(fabricanteId);
  }

  /**
   * Search produtos by name or categoria
   * @param {String} searchTerm - Search term
   * @returns {Promise<Document[]>} Array of produtos
   */
  async search(searchTerm) {
    const regex = new RegExp(searchTerm, 'i');
    return await this.model.find({
      $or: [
        { nome: regex },
        { categoria: regex }
      ]
    });
  }

  /**
   * Check if produto has associated sales
   * @param {String} produtoId - Produto ID
   * @returns {Promise<Boolean>} True if has sales
   */
  async hasVendas(produtoId) {
    const Venda = require('../models/Venda');
    const count = await Venda.countDocuments({ prod: produtoId });
    return count > 0;
  }
}

module.exports = new ProdutoRepository();
