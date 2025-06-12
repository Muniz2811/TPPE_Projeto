const ProdutoRepository = require('../repositories/ProdutoRepository');
const FabricanteRepository = require('../repositories/FabricanteRepository');

/**
 * Produto Controller
 * Handles CRUD operations for Produto model
 */
class ProdutoController {
  /**
   * Get all produtos
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async getAll(req, res) {
    try {
      const { sort, limit, skip, search, categoria, fabricante } = req.query;
      
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
        const produtos = await ProdutoRepository.search(search);
        return res.status(200).json({
          success: true,
          count: produtos.length,
          data: produtos
        });
      }
      
      // Filter by categoria
      if (categoria) {
        const produtos = await ProdutoRepository.findByCategoria(categoria);
        return res.status(200).json({
          success: true,
          count: produtos.length,
          data: produtos
        });
      }
      
      // Filter by fabricante
      if (fabricante) {
        const produtos = await ProdutoRepository.findByFabricante(fabricante);
        return res.status(200).json({
          success: true,
          count: produtos.length,
          data: produtos
        });
      }
      
      // Get all produtos
      const produtos = await ProdutoRepository.findAll(filter, options);
      const count = await ProdutoRepository.count(filter);
      
      res.status(200).json({
        success: true,
        count,
        data: produtos
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar produtos',
        error: error.message
      });
    }
  }

  /**
   * Get produto by ID
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async getById(req, res) {
    try {
      const produto = await ProdutoRepository.findById(req.params.id);
      
      if (!produto) {
        return res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
      }
      
      res.status(200).json({
        success: true,
        data: produto
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar produto',
        error: error.message
      });
    }
  }

  /**
   * Create new produto
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async create(req, res) {
    try {
      // Check if fabricante exists
      const fabricante = await FabricanteRepository.findById(req.body.fabr);
      
      if (!fabricante) {
        return res.status(400).json({
          success: false,
          message: 'Fabricante não encontrado'
        });
      }
      
      // Create produto
      const produto = await ProdutoRepository.create(req.body);
      
      res.status(201).json({
        success: true,
        data: produto
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erro ao criar produto',
        error: error.message
      });
    }
  }

  /**
   * Update produto
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async update(req, res) {
    try {
      // Check if produto exists
      const produto = await ProdutoRepository.findById(req.params.id);
      
      if (!produto) {
        return res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
      }
      
      // Check if fabricante exists if provided
      if (req.body.fabr) {
        const fabricante = await FabricanteRepository.findById(req.body.fabr);
        
        if (!fabricante) {
          return res.status(400).json({
            success: false,
            message: 'Fabricante não encontrado'
          });
        }
      }
      
      // Update produto
      const updatedProduto = await ProdutoRepository.updateById(req.params.id, req.body);
      
      res.status(200).json({
        success: true,
        data: updatedProduto
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erro ao atualizar produto',
        error: error.message
      });
    }
  }

  /**
   * Delete produto
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async delete(req, res) {
    try {
      // Check if produto has vendas
      const hasVendas = await ProdutoRepository.hasVendas(req.params.id);
      
      if (hasVendas) {
        return res.status(400).json({
          success: false,
          message: 'Não é possível excluir produto com vendas associadas'
        });
      }
      
      // Delete produto
      const produto = await ProdutoRepository.deleteById(req.params.id);
      
      if (!produto) {
        return res.status(404).json({
          success: false,
          message: 'Produto não encontrado'
        });
      }
      
      res.status(200).json({
        success: true,
        data: {}
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao excluir produto',
        error: error.message
      });
    }
  }
}

module.exports = new ProdutoController();
