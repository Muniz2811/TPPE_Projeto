const BaseRepository = require('./BaseRepository');
const Cliente = require('../models/Cliente');

/**
 * Cliente Repository
 * Extends BaseRepository with Cliente-specific operations
 */
class ClienteRepository extends BaseRepository {
  constructor() {
    super(Cliente);
  }

  /**
   * Find cliente by CPF
   * @param {String} cpf - Cliente CPF
   * @returns {Promise<Document>} Cliente document
   */
  async findByCpf(cpf) {
    return await this.model.findOne({ cpf });
  }

  /**
   * Search clientes by name or CPF
   * @param {String} searchTerm - Search term
   * @returns {Promise<Document[]>} Array of clientes
   */
  async search(searchTerm) {
    const regex = new RegExp(searchTerm, 'i');
    return await this.model.find({
      $or: [
        { nome: regex },
        { cpf: regex }
      ]
    });
  }

  /**
   * Check if cliente has associated sales
   * @param {String} clienteId - Cliente ID
   * @returns {Promise<Boolean>} True if has sales
   */
  async hasVendas(clienteId) {
    const Venda = require('../models/Venda');
    const count = await Venda.countDocuments({ clnt: clienteId });
    return count > 0;
  }
}

module.exports = new ClienteRepository();
