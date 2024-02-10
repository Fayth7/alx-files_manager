import { MongoClient } from 'mongodb';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${DB_HOST}:${DB_PORT}`;

/**
 * Class for performing operations with MongoDB service
 */
class DBClient {
  /**
   * Constructor for creating a MongoDB client.
   * Initializes the MongoDB client and sets up collections.
   */
  constructor() {
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
      if (err) {
        console.error(`Error connecting to MongoDB: ${err.message}`);
        this.db = null;
      } else {
        // console.log('Connected successfully to MongoDB server');
        this.db = client.db(DB_DATABASE);
        this.usersCollection = this.db.collection('users');
        this.filesCollection = this.db.collection('files');
      }
    });
  }

  /**
   * Checks if the connection to MongoDB is alive.
   * @return {boolean} True if the connection is alive, false otherwise.
   */
  isAlive() {
    return !!this.db;
  }

  /**
   * Returns the number of documents in the 'users' collection.
   * @return {Promise<number>} The number of users.
   */
  async nbUsers() {
    if (!this.isAlive()) {
      throw new Error('Not connected to MongoDB');
    }

    return this.usersCollection.countDocuments();
  }

  /**
   * Returns the number of documents in the 'files' collection.
   * @return {Promise<number>} The number of files.
   */
  async nbFiles() {
    if (!this.isAlive()) {
      throw new Error('Not connected to MongoDB');
    }

    return this.filesCollection.countDocuments();
  }
}

const dbClient = new DBClient();

export default dbClient;
