const User = require('../models/user.model');
const getHashedPassword = require('../../lib/helpers/getHashedPassword');
const UserDto = require('../dtos/user.dto');
const tokenService = require('./token.service');

class UserService {
  async registration(nickname, firstname, lastname, password) {
    const hashedPassword = getHashedPassword(password);
    const candidate = await User.findOne({ nickname });
    if (candidate) {
      throw new Error('User already exist');
    }
    const user = new User({
      nickname,
      firstname,
      lastname,
      password: hashedPassword,
    });

    await user.save();

    return user;
  }

  async getUsers(page, limit) {
    const users = await User.find();
    if (!users) {
      return 'The list of users is empty';
    }
    if (!page || !limit) {
      return users;
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const result = users.slice(startIndex, endIndex);

    return {
      totalUsers: users.length,
      currentPage: page,
      totalPages: Math.ceil(users.length / limit),
      users: result,
    };
  }

  async login(nickname, password) {
    const user = await User.findOne({ nickname });

    if (!user) {
      return { error: 'User not exist', user };
    }

    const userDto = new UserDto(user);
    const hashedPassword = getHashedPassword(password);

    if (hashedPassword !== userDto.password) {
      return { error: 'Password incorrect', user };
    }

    const token = tokenService.generateToken({ ...userDto });
    return { token, userDto };
  }

  async update(userId, newData) {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return { error: 'User not exist', user };
    }

    const userData = new UserDto(user);

    if (newData.nickname) {
      const candidate = await User.findOne({ nickname: newData.nickname });
      if (candidate) {
        return { error: `User with nickname ${newData.nickname} already exist`, userData };
      }
    }

    const newUserData = {
      nickname: !newData.nickname ? userData.nickname : newData.nickname,
      password: !newData.password ? userData.password : getHashedPassword(newData.password),
      firstname: !newData.firstname ? userData.firstname : newData.firstname,
      lastname: !newData.lastname ? userData.lastname : newData.lastname,
    };

    await User.updateOne({ _id: userId }, newUserData);
    return { error: null, userData: newUserData };
  }
}

module.exports = new UserService();
