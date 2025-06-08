const BaseRepository = require('./BaseRepository');
const Venda = require('../models/Venda');

/**
 * Venda Repository
 * Extends BaseRepository with Venda-specific operations
 */
class VendaRepository extends BaseRepository {
  constructor() {
    super(Venda);
  }

  /**
   * Find vendas by periodo (date range)
   * @param {Date} dataInicio - Start date
   * @param {Date} dataFim - End date
   * @returns {Promise<Document[]>} Array of vendas
   */
  async findByPeriodo(dataInicio, dataFim) {
    return await this.model.findByPeriodo(dataInicio, dataFim);
  }

  /**
   * Find vendas by cliente
   * @param {String} clienteId - Cliente ID
   * @returns {Promise<Document[]>} Array of vendas
   */
  async findByCliente(clienteId) {
    return await this.model.findByCliente(clienteId);
  }

  /**
   * Find venda by identificador
   * @param {String} identificador - Venda identificador
   * @returns {Promise<Document>} Venda document
   */
  async findByIdentificador(identificador) {
    return await this.model.findOne({ identificador });
  }

  /**
   * Get vendas summary by month
   * @param {Number} year - Year
   * @returns {Promise<Object[]>} Summary by month
   */
  async getSummaryByMonth(year) {
    return await this.model.aggregate([
      {
        $match: { ano: year }
      },
      {
        $group: {
          _id: "$mes",
          total: { $sum: "$valor_total" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
  }

  /**
   * Get vendas summary by cliente
   * @returns {Promise<Object[]>} Summary by cliente
   */
  async getSummaryByCliente() {
    return await this.model.aggregate([
      {
        $lookup: {
          from: 'pessoas',
          localField: 'clnt',
          foreignField: '_id',
          as: 'cliente'
        }
      },
      {
        $unwind: '$cliente'
      },
      {
        $group: {
          _id: "$clnt",
          nome: { $first: "$cliente.nome" },
          total: { $sum: "$valor_total" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);
  }
}

module.exports = new VendaRepository();
