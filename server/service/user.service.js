const User = require('../models/user.model');
const getHashedPassword = require('../../lib/helpers/getHashedPassword');

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

  async getUsers() {
    const users = await User.find();
    if (!users) {
      return 'The list of users is empty';
    }
    return users;
  }

  async update(
    nickname,
    password,
    newNickname = null,
    newFirstname = null,
    newLastname = null,
    newPassword = null,
  ) {
    const userData = await User.findOne({ nickname });

    if (!userData) {
      return { error: 'User not exist', userData };
    }

    if (newNickname) {
      const candidate = await User.findOne({ nickname: newNickname });
      if (candidate) {
        return { error: `User with nickname: ${newNickname} already exist`, userData };
      }
    }

    const hashedPassword = getHashedPassword(password);

    if (hashedPassword !== userData.password) {
      return { error: 'Password incorrect', userData };
    }

    const newUserData = {
      nickname: !newNickname ? userData.nickname : newNickname,
      password: !newPassword ? userData.password : getHashedPassword(newPassword),
      firstname: !newFirstname ? userData.firstname : newFirstname,
      lastname: !newLastname ? userData.lastname : newLastname,
    };

    await User.updateOne({ nickname }, newUserData);
    return { error: null, userData: newUserData };
  }
}

module.exports = new UserService();
