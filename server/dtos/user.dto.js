class UserDto {
  id;

  nickname;

  firstname;

  lastname;

  password;

  constructor(model) {
    // eslint-disable-next-line no-underscore-dangle
    this.id = model._id;
    this.nickname = model.nickname;
    this.firstname = model.firstname;
    this.lastname = model.lastname;
    this.password = model.password;
  }
}

module.exports = UserDto;
