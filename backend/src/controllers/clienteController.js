const ClienteRepository = require('../repositories/ClienteRepository');

/**
 * Cliente Controller
 * Handles CRUD operations for Cliente model
 */
class ClienteController {
  /**
   * Get all clientes
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async getAll(req, res) {
    try {
      const { sort, limit, skip, search } = req.query;
      
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
      
      // Apply search if provided
      if (search) {
        const clientes = await ClienteRepository.search(search);
        return res.status(200).json({
          success: true,
          count: clientes.length,
          data: clientes
        });
      }
      
      // Get all clientes
      const clientes = await ClienteRepository.findAll(filter, options);
      const count = await ClienteRepository.count(filter);
      
      res.status(200).json({
        success: true,
        count,
        data: clientes
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar clientes',
        error: error.message
      });
    }
  }

  /**
   * Get cliente by ID
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async getById(req, res) {
    try {
      const cliente = await ClienteRepository.findById(req.params.id);
      
      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: 'Cliente não encontrado'
        });
      }
      
      res.status(200).json({
        success: true,
        data: cliente
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar cliente',
        error: error.message
      });
    }
  }

  /**
   * Create new cliente
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async create(req, res) {
    try {
      // Check if CPF already exists
      const existingCliente = await ClienteRepository.findByCpf(req.body.cpf);
      
      if (existingCliente) {
        return res.status(400).json({
          success: false,
          message: 'Cliente com este CPF já existe'
        });
      }
      
      // Create cliente
      const cliente = await ClienteRepository.create({
        ...req.body,
        tipo: 'Cliente' // Set discriminator key
      });
      
      res.status(201).json({
        success: true,
        data: cliente
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erro ao criar cliente',
        error: error.message
      });
    }
  }

  /**
   * Update cliente
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async update(req, res) {
    try {
      // Check if cliente exists
      const cliente = await ClienteRepository.findById(req.params.id);
      
      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: 'Cliente não encontrado'
        });
      }
      
      // Check if CPF is being changed and already exists
      if (req.body.cpf && req.body.cpf !== cliente.cpf) {
        const existingCliente = await ClienteRepository.findByCpf(req.body.cpf);
        
        if (existingCliente) {
          return res.status(400).json({
            success: false,
            message: 'Cliente com este CPF já existe'
          });
        }
      }
      
      // Update cliente
      const updatedCliente = await ClienteRepository.updateById(req.params.id, req.body);
      
      res.status(200).json({
        success: true,
        data: updatedCliente
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erro ao atualizar cliente',
        error: error.message
      });
    }
  }

  /**
   * Delete cliente
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async delete(req, res) {
    try {
      // Check if cliente has vendas
      const hasVendas = await ClienteRepository.hasVendas(req.params.id);
      
      if (hasVendas) {
        return res.status(400).json({
          success: false,
          message: 'Não é possível excluir cliente com vendas associadas'
        });
      }
      
      // Delete cliente
      const cliente = await ClienteRepository.deleteById(req.params.id);
      
      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: 'Cliente não encontrado'
        });
      }
      
      res.status(200).json({
        success: true,
        data: {}
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao excluir cliente',
        error: error.message
      });
    }
  }
}

module.exports = new ClienteController();
