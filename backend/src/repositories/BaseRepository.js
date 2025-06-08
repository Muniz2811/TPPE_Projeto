/**
 * Base Repository Class
 * Provides generic CRUD operations for MongoDB models
 */
class BaseRepository {
  /**
   * Create a new repository instance
   * @param {Model} model - Mongoose model
   */
  constructor(model) {
    this.model = model;
  }

  /**
   * Create a new document
   * @param {Object} data - Document data
   * @returns {Promise<Document>} Created document
   */
  async create(data) {
    return await this.model.create(data);
  }

  /**
   * Find document by ID
   * @param {String} id - Document ID
   * @returns {Promise<Document>} Found document
   */
  async findById(id) {
    return await this.model.findById(id);
  }

  /**
   * Find all documents with optional filtering
   * @param {Object} filter - Filter criteria
   * @param {Object} options - Query options (sort, limit, skip)
   * @returns {Promise<Document[]>} Array of documents
   */
  async findAll(filter = {}, options = {}) {
    const { sort, limit, skip, select } = options;
    
    let query = this.model.find(filter);
    
    if (sort) query = query.sort(sort);
    if (skip) query = query.skip(skip);
    if (limit) query = query.limit(limit);
    if (select) query = query.select(select);
    
    return await query;
  }

  /**
   * Update document by ID
   * @param {String} id - Document ID
   * @param {Object} data - Update data
   * @param {Object} options - Update options
   * @returns {Promise<Document>} Updated document
   */
  async updateById(id, data, options = { new: true, runValidators: true }) {
    return await this.model.findByIdAndUpdate(id, data, options);
  }

  /**
   * Delete document by ID
   * @param {String} id - Document ID
   * @returns {Promise<Document>} Deleted document
   */
  async deleteById(id) {
    return await this.model.findByIdAndDelete(id);
  }

  /**
   * Count documents with filter
   * @param {Object} filter - Filter criteria
   * @returns {Promise<Number>} Count of documents
   */
  async count(filter = {}) {
    return await this.model.countDocuments(filter);
  }

  /**
   * Check if document exists
   * @param {Object} filter - Filter criteria
   * @returns {Promise<Boolean>} True if exists
   */
  async exists(filter) {
    return !!(await this.model.exists(filter));
  }
}

module.exports = BaseRepository;
