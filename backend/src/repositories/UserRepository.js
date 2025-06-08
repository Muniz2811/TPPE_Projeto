const BaseRepository = require('./BaseRepository');
const User = require('../models/User');

/**
 * User Repository
 * Extends BaseRepository with User-specific operations
 */
class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  /**
   * Find user by username
   * @param {String} username - Username
   * @returns {Promise<Document>} User document
   */
  async findByUsername(username) {
    return await this.model.findOne({ username });
  }

  /**
   * Find user by email
   * @param {String} email - Email
   * @returns {Promise<Document>} User document
   */
  async findByEmail(email) {
    return await this.model.findOne({ email });
  }

  /**
   * Authenticate user with email and password
   * @param {String} email - User email
   * @param {String} password - User password
   * @returns {Promise<Document>} User document
   */
  async authenticate(email, password) {
    try {
      return await this.model.findByCredentials(email, password);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserRepository();
