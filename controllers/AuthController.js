import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';

export default class AuthController {
  /**
   * Signs in the user by generating a new authentication token.
   * @param {Request} req The Express request object.
   * @param {Response} res The Express response object.
   */
  static async getConnect(req, res) {
    const { user } = req;
    const token = uuidv4();

    try {
      await redisClient.set(`auth_${token}`, user._id.toString(), 24 * 60 * 60);
      res.status(200).json({ token });
    } catch (error) {
      console.error('Error storing token in Redis:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * Signs out the user based on the token.
   * @param {Request} req The Express request object.
   * @param {Response} res The Express response object.
   */
  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];

    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const deletedKeys = await redisClient.del(`auth_${token}`);

      if (deletedKeys === 0) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting token from Redis:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
