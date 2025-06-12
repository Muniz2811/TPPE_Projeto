const VendaRepository = require('../repositories/VendaRepository');
const ClienteRepository = require('../repositories/ClienteRepository');
const ProdutoRepository = require('../repositories/ProdutoRepository');

/**
 * Venda Controller
 * Handles CRUD operations for Venda model
 */
class VendaController {
  /**
   * Get all vendas
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async getAll(req, res) {
    try {
      const { sort, limit, skip, cliente, dataInicio, dataFim } = req.query;
      
      let filter = {};
      let options = {};
      
      // Apply sorting
      if (sort) {
        options.sort = sort;
      }
      
      // Apply pagination
      if (limit) {
        options.limit = parseInt(limit);
      }
      
      if (skip) {
        options.skip = parseInt(skip);
      }
      
      // Filter by cliente
      if (cliente) {
        const vendas = await VendaRepository.findByCliente(cliente);
        return res.status(200).json({
          success: true,
          count: vendas.length,
          data: vendas
        });
      }
      
      // Filter by período
      if (dataInicio && dataFim) {
        const inicio = new Date(dataInicio);
        const fim = new Date(dataFim);
        
        if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
          return res.status(400).json({
            success: false,
            message: 'Formato de data inválido'
          });
        }
        
        const vendas = await VendaRepository.findByPeriodo(inicio, fim);
        return res.status(200).json({
          success: true,
          count: vendas.length,
          data: vendas
        });
      }
      
      // Get all vendas
      const vendas = await VendaRepository.findAll(filter, options);
      const count = await VendaRepository.count(filter);
      
      res.status(200).json({
        success: true,
        count,
        data: vendas
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar vendas',
        error: error.message
      });
    }
  }

  /**
   * Get venda by ID
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async getById(req, res) {
    try {
      const venda = await VendaRepository.findById(req.params.id);
      
      if (!venda) {
        return res.status(404).json({
          success: false,
          message: 'Venda não encontrada'
        });
      }
      
      res.status(200).json({
        success: true,
        data: venda
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar venda',
        error: error.message
      });
    }
  }

  /**
   * Create new venda
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async create(req, res) {
    try {
      // Check if identificador already exists
      const existingVenda = await VendaRepository.findByIdentificador(req.body.identificador);
      
      if (existingVenda) {
        return res.status(400).json({
          success: false,
          message: 'Venda com este identificador já existe'
        });
      }
      
      // Check if cliente exists
      const cliente = await ClienteRepository.findById(req.body.clnt);
      
      if (!cliente) {
        return res.status(400).json({
          success: false,
          message: 'Cliente não encontrado'
        });
      }
      
      // Check if produto exists
      const produto = await ProdutoRepository.findById(req.body.prod);
      
      if (!produto) {
        return res.status(400).json({
          success: false,
          message: 'Produto não encontrado'
        });
      }
      
      // Create venda
      const venda = await VendaRepository.create(req.body);
      
      res.status(201).json({
        success: true,
        data: venda
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erro ao criar venda',
        error: error.message
      });
    }
  }

  /**
   * Update venda
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async update(req, res) {
    try {
      // Check if venda exists
      const venda = await VendaRepository.findById(req.params.id);
      
      if (!venda) {
        return res.status(404).json({
          success: false,
          message: 'Venda não encontrada'
        });
      }
      
      // Check if identificador is being changed and already exists
      if (req.body.identificador && req.body.identificador !== venda.identificador) {
        const existingVenda = await VendaRepository.findByIdentificador(req.body.identificador);
        
        if (existingVenda) {
          return res.status(400).json({
            success: false,
            message: 'Venda com este identificador já existe'
          });
        }
      }
      
      // Check if cliente exists if provided
      if (req.body.clnt) {
        const cliente = await ClienteRepository.findById(req.body.clnt);
        
        if (!cliente) {
          return res.status(400).json({
            success: false,
            message: 'Cliente não encontrado'
          });
        }
      }
      
      // Check if produto exists if provided
      if (req.body.prod) {
        const produto = await ProdutoRepository.findById(req.body.prod);
        
        if (!produto) {
          return res.status(400).json({
            success: false,
            message: 'Produto não encontrado'
          });
        }
      }
      
      // Update venda
      const updatedVenda = await VendaRepository.updateById(req.params.id, req.body);
      
      res.status(200).json({
        success: true,
        data: updatedVenda
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erro ao atualizar venda',
        error: error.message
      });
    }
  }

  /**
   * Delete venda
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async delete(req, res) {
    try {
      // Delete venda
      const venda = await VendaRepository.deleteById(req.params.id);
      
      if (!venda) {
        return res.status(404).json({
          success: false,
          message: 'Venda não encontrada'
        });
      }
      
      res.status(200).json({
        success: true,
        data: {}
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao excluir venda',
        error: error.message
      });
    }
  }

  /**
   * Get summary by month
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async getSummaryByMonth(req, res) {
    try {
      const { year } = req.params;
      
      if (!year || isNaN(parseInt(year))) {
        return res.status(400).json({
          success: false,
          message: 'Ano inválido'
        });
      }
      
      const summary = await VendaRepository.getSummaryByMonth(parseInt(year));
      
      res.status(200).json({
        success: true,
        data: summary
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar resumo por mês',
        error: error.message
      });
    }
  }

  /**
   * Get summary by cliente
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async getSummaryByCliente(req, res) {
    try {
      const summary = await VendaRepository.getSummaryByCliente();
      
      res.status(200).json({
        success: true,
        data: summary
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar resumo por cliente',
        error: error.message
      });
    }
  }
}

module.exports = new VendaController();
