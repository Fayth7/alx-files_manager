import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  /**
   * Returns the status of Redis and DB.
   * { "redis": true, "db": true } with a status code 200 if both are alive,
   * otherwise, { "redis": false, "db": false } with a status code 500.
   */
  static getStatus(request, response) {
    const isRedisAlive = redisClient.isAlive();
    const isDbAlive = dbClient.isAlive();

    const status = {
      redis: isRedisAlive,
      db: isDbAlive,
    };

    const statusCode = isRedisAlive && isDbAlive ? 200 : 500;
    response.status(statusCode).json(status);
  }

  /**
   * Returns the number of users and files in DB:
   * { "users": 12, "files": 1231 }
   * with a status code 200.
   */
  static async getStats(request, response) {
    try {
      const users = await dbClient.nbUsers();
      const files = await dbClient.nbFiles();

      const stats = {
        users,
        files,
      };

      response.status(200).json(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      response.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default AppController;
