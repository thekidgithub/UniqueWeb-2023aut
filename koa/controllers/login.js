const fs = require('fs');
const Users = require('../model');
const bcrypt = require('bcrypt');
const getLogin = async (ctx, next) => {
  ctx.type = 'html';
  ctx.body = fs.createReadStream('./views/login.html');
  await next();
}

const postLogin = async (ctx, next) => {
  const { username, password } = ctx.request.body;
  try {
    const responseArray = [];
    const existingUser = await Users.findOne({ where: { username: username } });
    if (existingUser) {
      const passwordMatch = await bcrypt.compare(password, existingUser.password);
      if (passwordMatch) {
        ctx.status = 200;
        ctx.cookies.set('loggedIn', 'true');
        ctx.cookies.set('username',JSON.stringify(username));
      } else {
        ctx.status = 401;
        responseArray.push({content:'wrong-password', code: 1});
      }
    } else {
      ctx.status = 404;
      responseArray.push({content:'existing-user', code: 2});
    }
    ctx.body = responseArray;
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = 'Error registering user';
  }
  await next();
}

module.exports = {
  'GET /login': getLogin,
  'POST /login': postLogin
};