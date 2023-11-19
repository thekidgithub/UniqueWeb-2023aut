const fs = require('fs');
const Users = require('../model');

const getSignin = async (ctx, next) => {
  ctx.response.type = 'html';
  ctx.response.body = fs.createReadStream('./views/signin.html');
  await next();
}

const postSignin = async (ctx, next) => {
  const { email, username, password, confirmedPassword } = ctx.request.body;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const existingEmail = await Users.findOne({ where: { email: email } });
  const existingUser = await Users.findOne({ where: { username: username } });
  const isVaildPassword = passwordRegex.test(password);
  const isVaildEmail = emailRegex.test(email);
  const isConstantPassword = password === confirmedPassword;
  // 创建新的用户实例
  try {
    const responseArray = [];
    if (existingEmail) {
      responseArray.push({ content: 'existing-email', code: 1 });
    }
    if (existingUser) {
      responseArray.push({ content: 'existing-user', code: 2 });
    }
    if (!isVaildPassword) {
      responseArray.push({ content: 'invaild-password', code: 3 });
    }
    if (!isVaildEmail) {
      responseArray.push({ content: 'invaild-email', code: 4 });
    }
    if (!isConstantPassword) {
      responseArray.push({ content: 'inconstant-password', code: 5 });
    }
    if (responseArray.length) {
      ctx.status = 422;
    }
    else {
      await Users.create({ email, username, password });
      ctx.status = 200;
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
  'GET /signin': getSignin,
  'POST /signin': postSignin
};