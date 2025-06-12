const UserRepository = require('../repositories/UserRepository');

/**
 * Authentication Controller
 * Handles user registration, login, and authentication
 */
class AuthController {
  /**
   * Register a new user
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      // Check if user already exists
      const existingUser = await UserRepository.findByEmail(email) || 
                          await UserRepository.findByUsername(username);
      
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'Usuário já existe com este email ou nome de usuário' 
        });
      }

      // Create new user
      const user = await UserRepository.create({
        username,
        email,
        password
      });

      // Generate token
      const token = user.generateAuthToken();

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Erro ao registrar usuário', 
        error: error.message 
      });
    }
  }

  /**
   * Login user
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Authenticate user
      const user = await UserRepository.authenticate(email, password);
      
      // Generate token
      const token = user.generateAuthToken();

      res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(401).json({ 
        success: false, 
        message: 'Credenciais inválidas' 
      });
    }
  }

  /**
   * Get current user profile
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async getProfile(req, res) {
    try {
      const user = await UserRepository.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'Usuário não encontrado' 
        });
      }

      res.status(200).json({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Erro ao buscar perfil', 
        error: error.message 
      });
    }
  }
}

module.exports = new AuthController();
