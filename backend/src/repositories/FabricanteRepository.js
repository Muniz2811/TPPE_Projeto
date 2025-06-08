const BaseRepository = require('./BaseRepository');
const Fabricante = require('../models/Fabricante');

/**
 * Fabricante Repository
 * Extends BaseRepository with Fabricante-specific operations
 */
class FabricanteRepository extends BaseRepository {
  constructor() {
    super(Fabricante);
  }

  /**
   * Find fabricante by CNPJ
   * @param {String} cnpj - Fabricante CNPJ
   * @returns {Promise<Document>} Fabricante document
   */
  async findByCnpj(cnpj) {
    return await this.model.findOne({ cnpj });
  }

  /**
   * Search fabricantes by name or CNPJ
   * @param {String} searchTerm - Search term
   * @returns {Promise<Document[]>} Array of fabricantes
   */
  async search(searchTerm) {
    const regex = new RegExp(searchTerm, 'i');
    return await this.model.find({
      $or: [
        { nome: regex },
        { razao_social: regex },
        { cnpj: regex }
      ]
    });
  }

  /**
   * Check if fabricante has associated products
   * @param {String} fabricanteId - Fabricante ID
   * @returns {Promise<Boolean>} True if has products
   */
  async hasProdutos(fabricanteId) {
    const Produto = require('../models/Produto');
    const count = await Produto.countDocuments({ fabr: fabricanteId });
    return count > 0;
  }
}

module.exports = new FabricanteRepository();
