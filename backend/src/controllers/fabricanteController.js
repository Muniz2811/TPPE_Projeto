const FabricanteRepository = require('../repositories/FabricanteRepository');

/**
 * Fabricante Controller
 * Handles CRUD operations for Fabricante model
 */
class FabricanteController {
  /**
   * Get all fabricantes
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
        const fabricantes = await FabricanteRepository.search(search);
        return res.status(200).json({
          success: true,
          count: fabricantes.length,
          data: fabricantes
        });
      }
      
      // Get all fabricantes
      const fabricantes = await FabricanteRepository.findAll(filter, options);
      const count = await FabricanteRepository.count(filter);
      
      res.status(200).json({
        success: true,
        count,
        data: fabricantes
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar fabricantes',
        error: error.message
      });
    }
  }

  /**
   * Get fabricante by ID
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async getById(req, res) {
    try {
      const fabricante = await FabricanteRepository.findById(req.params.id);
      
      if (!fabricante) {
        return res.status(404).json({
          success: false,
          message: 'Fabricante não encontrado'
        });
      }
      
      res.status(200).json({
        success: true,
        data: fabricante
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar fabricante',
        error: error.message
      });
    }
  }

  /**
   * Create new fabricante
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async create(req, res) {
    try {
      // Check if CNPJ already exists
      const existingFabricante = await FabricanteRepository.findByCnpj(req.body.cnpj);
      
      if (existingFabricante) {
        return res.status(400).json({
          success: false,
          message: 'Fabricante com este CNPJ já existe'
        });
      }
      
      // Create fabricante
      const fabricante = await FabricanteRepository.create({
        ...req.body,
        tipo: 'Fabricante' // Set discriminator key
      });
      
      res.status(201).json({
        success: true,
        data: fabricante
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erro ao criar fabricante',
        error: error.message
      });
    }
  }

  /**
   * Update fabricante
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async update(req, res) {
    try {
      // Check if fabricante exists
      const fabricante = await FabricanteRepository.findById(req.params.id);
      
      if (!fabricante) {
        return res.status(404).json({
          success: false,
          message: 'Fabricante não encontrado'
        });
      }
      
      // Check if CNPJ is being changed and already exists
      if (req.body.cnpj && req.body.cnpj !== fabricante.cnpj) {
        const existingFabricante = await FabricanteRepository.findByCnpj(req.body.cnpj);
        
        if (existingFabricante) {
          return res.status(400).json({
            success: false,
            message: 'Fabricante com este CNPJ já existe'
          });
        }
      }
      
      // Update fabricante
      const updatedFabricante = await FabricanteRepository.updateById(req.params.id, req.body);
      
      res.status(200).json({
        success: true,
        data: updatedFabricante
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erro ao atualizar fabricante',
        error: error.message
      });
    }
  }

  /**
   * Delete fabricante
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async delete(req, res) {
    try {
      // Check if fabricante has produtos
      const hasProdutos = await FabricanteRepository.hasProdutos(req.params.id);
      
      if (hasProdutos) {
        return res.status(400).json({
          success: false,
          message: 'Não é possível excluir fabricante com produtos associados'
        });
      }
      
      // Delete fabricante
      const fabricante = await FabricanteRepository.deleteById(req.params.id);
      
      if (!fabricante) {
        return res.status(404).json({
          success: false,
          message: 'Fabricante não encontrado'
        });
      }
      
      res.status(200).json({
        success: true,
        data: {}
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao excluir fabricante',
        error: error.message
      });
    }
  }
}

module.exports = new FabricanteController();
