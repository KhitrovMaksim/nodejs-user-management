const { validationResult } = require('express-validator');
const userService = require('../service/user.service');
const logger = require('../../logger');

class AuthController {
  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({ message: 'Registration error', errors });
      }
      const { nickname, password } = req.body;

      const userData = await userService.login(nickname, password);

      return res.json({ userData, message: 'Token successfully generated' });
    } catch (error) {
      logger.error(`Authentication error: ${error}`);
      return res.status(400).json({ message: 'Registration error' });
    }
  }
}

module.exports = new AuthController();
