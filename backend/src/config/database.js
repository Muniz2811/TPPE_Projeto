const mongoose = require('mongoose');

/**
 * Database connection manager
 * Handles MongoDB connection with error handling and connection events
 */
class DatabaseConnection {
  /**
   * Connect to MongoDB
   * @param {string} uri - MongoDB connection string
   * @returns {Promise} Mongoose connection promise
   */
  static connect(uri) {
    return new Promise((resolve, reject) => {
      mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((connection) => {
        console.log('MongoDB connected successfully');
        resolve(connection);
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err);
        reject(err);
      });

      // Connection event handlers
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected');
      });

      // Handle application termination
      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('MongoDB connection closed due to app termination');
        process.exit(0);
      });
    });
  }

  /**
   * Close the MongoDB connection
   * @returns {Promise} Mongoose disconnection promise
   */
  static async disconnect() {
    return mongoose.connection.close();
  }
}

module.exports = DatabaseConnection;
