import redis from 'redis';
import { promisify } from 'util';

/**
 * Class for performing operations with Redis service
 */
class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.getAsync = promisify(this.client.get).bind(this.client);

    this.client.on('error', (error) => {
      console.error(`Redis client not connected to the server: ${error.message}`);
    });

    this.client.on('connect', () => {
      // console.log('Redis client connected to the server');
    });
  }

  /**
   * Checks if connection to Redis is alive
   * @return {boolean} true if connection is alive, false if not
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Gets the value corresponding to the key in Redis
   * @param {string} key - The key to search for in Redis
   * @return {Promise<string|null>} The value of the key or null if not found
   */
  async get(key) {
    return this.getAsync(key);
  }

  /**
   * Creates a new key in Redis with a specific TTL
   * @param {string} key - The key to be saved in Redis
   * @param {string} value - The value to be assigned to the key
   * @param {number} duration - The TTL of the key in seconds
   * @return {Promise<void>} No return
   */
  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Deletes a key in the Redis service
   * @param {string} key - The key to be deleted
   * @return {Promise<void>} No return
   */
  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}

const redisClient = new RedisClient();

export default redisClient;
