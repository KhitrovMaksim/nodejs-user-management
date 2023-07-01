const { Schema, model } = require('mongoose');

const UserModel = new Schema({
  nickname: { type: String, unique: true, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = model('User', UserModel);
