const mongoose = require('mongoose');
const BaseRepository = require('../../repositories/BaseRepository');

// Create a mock model for testing
const mockSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: Number, default: 0 }
});

const MockModel = mongoose.model('MockModel', mockSchema);

describe('BaseRepository', () => {
  let repository;
  
  beforeEach(() => {
    // Create a new repository instance for each test
    repository = new BaseRepository(MockModel);
  });
  
  afterEach(async () => {
    // Clean up the database after each test
    await MockModel.deleteMany({});
  });
  
  describe('create', () => {
    it('should create a new document', async () => {
      const data = { name: 'Test Item', value: 10 };
      const result = await repository.create(data);
      
      expect(result).toBeDefined();
      expect(result._id).toBeDefined();
      expect(result.name).toBe(data.name);
      expect(result.value).toBe(data.value);
      
      // Verify it was saved to the database
      const found = await MockModel.findById(result._id);
      expect(found).toBeDefined();
      expect(found.name).toBe(data.name);
    });
    
    it('should throw an error if validation fails', async () => {
      const data = { value: 10 }; // Missing required name field
      
      await expect(repository.create(data)).rejects.toThrow();
    });
  });
  
  describe('findById', () => {
    it('should find a document by id', async () => {
      // Create a document first
      const created = await repository.create({ name: 'Test Item', value: 10 });
      
      // Find it by id
      const found = await repository.findById(created._id);
      
      expect(found).toBeDefined();
      expect(found._id.toString()).toBe(created._id.toString());
      expect(found.name).toBe(created.name);
    });
    
    it('should return null if document not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const found = await repository.findById(nonExistentId);
      
      expect(found).toBeNull();
    });
    
    it('should throw an error if id is invalid', async () => {
      await expect(repository.findById('invalid-id')).rejects.toThrow();
    });
  });
  
  describe('findAll', () => {
    it('should find all documents', async () => {
      // Create multiple documents
      await repository.create({ name: 'Item 1', value: 10 });
      await repository.create({ name: 'Item 2', value: 20 });
      await repository.create({ name: 'Item 3', value: 30 });
      
      // Find all
      const found = await repository.findAll();
      
      expect(found).toBeDefined();
      expect(found.length).toBe(3);
      expect(found[0].name).toBeDefined();
    });
    
    it('should find documents with filter', async () => {
      // Create multiple documents
      await repository.create({ name: 'Item 1', value: 10 });
      await repository.create({ name: 'Item 2', value: 20 });
      await repository.create({ name: 'Item 3', value: 30 });
      
      // Find with filter
      const found = await repository.findAll({ value: { $gt: 15 } });
      
      expect(found).toBeDefined();
      expect(found.length).toBe(2);
      expect(found[0].value).toBeGreaterThan(15);
      expect(found[1].value).toBeGreaterThan(15);
    });
    
    it('should apply options (sort, limit, skip)', async () => {
      // Create multiple documents
      await repository.create({ name: 'Item 1', value: 10 });
      await repository.create({ name: 'Item 2', value: 20 });
      await repository.create({ name: 'Item 3', value: 30 });
      
      // Find with options
      const found = await repository.findAll({}, { 
        sort: { value: -1 }, 
        limit: 2,
        skip: 1
      });
      
      expect(found).toBeDefined();
      expect(found.length).toBe(2);
      expect(found[0].value).toBe(20); // Second highest value after skipping the highest
      expect(found[1].value).toBe(10); // Third highest value
    });
  });
  
  describe('updateById', () => {
    it('should update a document by id', async () => {
      // Create a document first
      const created = await repository.create({ name: 'Test Item', value: 10 });
      
      // Update it
      const updated = await repository.updateById(created._id, { name: 'Updated Item', value: 20 });
      
      expect(updated).toBeDefined();
      expect(updated._id.toString()).toBe(created._id.toString());
      expect(updated.name).toBe('Updated Item');
      expect(updated.value).toBe(20);
      
      // Verify it was updated in the database
      const found = await MockModel.findById(created._id);
      expect(found.name).toBe('Updated Item');
      expect(found.value).toBe(20);
    });
    
    it('should return null if document not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const updated = await repository.updateById(nonExistentId, { name: 'Updated Item' });
      
      expect(updated).toBeNull();
    });
    
    it('should throw an error if id is invalid', async () => {
      await expect(repository.updateById('invalid-id', { name: 'Updated Item' })).rejects.toThrow();
    });
  });
  
  describe('deleteById', () => {
    it('should delete a document by id', async () => {
      // Create a document first
      const created = await repository.create({ name: 'Test Item', value: 10 });
      
      // Delete it
      const deleted = await repository.deleteById(created._id);
      
      expect(deleted).toBeDefined();
      expect(deleted._id.toString()).toBe(created._id.toString());
      
      // Verify it was deleted from the database
      const found = await MockModel.findById(created._id);
      expect(found).toBeNull();
    });
    
    it('should return null if document not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const deleted = await repository.deleteById(nonExistentId);
      
      expect(deleted).toBeNull();
    });
    
    it('should throw an error if id is invalid', async () => {
      await expect(repository.deleteById('invalid-id')).rejects.toThrow();
    });
  });
  
  describe('count', () => {
    it('should count all documents', async () => {
      // Create multiple documents
      await repository.create({ name: 'Item 1', value: 10 });
      await repository.create({ name: 'Item 2', value: 20 });
      await repository.create({ name: 'Item 3', value: 30 });
      
      // Count all
      const count = await repository.count();
      
      expect(count).toBe(3);
    });
    
    it('should count documents with filter', async () => {
      // Create multiple documents
      await repository.create({ name: 'Item 1', value: 10 });
      await repository.create({ name: 'Item 2', value: 20 });
      await repository.create({ name: 'Item 3', value: 30 });
      
      // Count with filter
      const count = await repository.count({ value: { $gt: 15 } });
      
      expect(count).toBe(2);
    });
  });
});
