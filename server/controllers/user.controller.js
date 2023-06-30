const { validationResult } = require('express-validator');
const userService = require('../service/user.service');
const logger = require('../../logger');
const UserDto = require('../dtos/user.dto');

class UserController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({ message: 'Registration error', errors });
      }
      const { nickname, firstname, lastname, password } = req.body;
      const userData = await userService.registration(nickname, firstname, lastname, password);
      return res.json({ user: userData, message: 'User successfully added' });
    } catch (error) {
      logger.error(`Registration error: ${error}`);
      return res.status(400).json({ message: 'Registration error' });
    }
  }

  async getUsers(req, res) {
    try {
      const page = parseInt(req.query.page, 10);
      const limit = parseInt(req.query.limit, 10);
      const users = await userService.getUsers(page, limit);
      return res.json(users);
    } catch (error) {
      logger.error(`Getting users error: ${error}`);
      return res.status(400).json({ message: 'Getting users error' });
    }
  }

  // eslint-disable-next-line consistent-return
  async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({ message: 'Validation error', errors });
      }

      if (req.params.id !== req.user.id) {
        return res.status(401).json({ message: 'Permission denied', errors });
      }

      const newUserData = new UserDto(req.body);
      const { error, userData } = await userService.update(req.user.id, newUserData);

      if (error) {
        return res.json({ message: error });
      }

      return res.json({ userData, message: 'User successfully updated' });
    } catch (error) {
      logger.error(`Updating user error: ${error}`);
      return res.status(400).json({ message: 'Updating user error' });
    }
  }
}

module.exports = new UserController();
