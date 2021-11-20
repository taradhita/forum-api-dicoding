/* istanbul ignore file */

const Jwt = require('@hapi/jwt');
const UsersTableTestHelper = require('./UsersTableTestHelper');

const ServerTestHelper = {
  async getAccessToken(userId = 123) {
    const payloadUser = {
      id: `user-${userId}`,
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };
    await UsersTableTestHelper.addUser(payloadUser);
    // await UsersTableTestHelper.findUsersById(payloadUser.id);
    return Jwt.token.generate(payloadUser, process.env.ACCESS_TOKEN_KEY);
  },
};

module.exports = ServerTestHelper;
