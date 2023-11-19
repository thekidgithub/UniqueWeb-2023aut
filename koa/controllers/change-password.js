const fs = require('fs');
const Users = require('../model');
const bcrypt = require('bcrypt');
const getChange = async (ctx, next) => {
  ctx.response.type = 'html';
  if (ctx.cookies.get('loggedIn') === 'true') {
    ctx.response.body = fs.createReadStream('./views/change-password.html');
  }
  else {
    ctx.redirect('/login');
  }
  await next();
}

const postChange = async (ctx, next) => {
  const { email, oldPassword, newPassword, confirmedPassword } = ctx.request.body;
  try {
    const responseArray = [];
    const username = JSON.parse(ctx.cookies.get('username'));
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const existingUser = await Users.findOne({ where: { username: username } });
    const emailMatch = email === existingUser.email;
    const passwordMatch = await bcrypt.compare(oldPassword, existingUser.password);
    const isVaildPassword = passwordRegex.test(newPassword);
    const isConstantPassword = newPassword === confirmedPassword;
    if (!emailMatch) {
      responseArray.push({ content: 'unmatch-email', code: 1 });
    }
    if (!passwordMatch) {
      responseArray.push({ content: 'unmatch-password', code: 2 });
    }
    if (!isVaildPassword) {
      responseArray.push({ content: 'invaild-password', code: 3 });
    }
    if (!isConstantPassword) {
      responseArray.push({ content: 'inconstant-password', code: 4 });
    }
    if (responseArray.length) {
      ctx.status = 422;
    }
    else {
      ctx.status = 200;
      existingUser.password = newPassword;
      existingUser.save();
      ctx.cookies.set('loggedIn', 'false');
      ctx.cookies.set('username', '');
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
  'GET /change-password': getChange,
  'POST /change-password': postChange
}