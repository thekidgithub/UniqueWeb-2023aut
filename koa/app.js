const Koa = require('koa');
const Router = require('koa-router');
const fs = require('fs');
const bodyParser = require('koa-bodyparser');
const bcrypt = require('bcrypt');
const { Sequelize, DataTypes } = require('sequelize');
const cookie = require('koa-cookie').default;
const app = new Koa();
const router = new Router();
// 连接到 MySQL 数据库
const sequelize = new Sequelize('test', 'thekid', '114514aA', {
  host: 'localhost',
  dialect: 'mysql'
});

// 定义用户模型
const Users = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      // 在设置密码时进行哈希
      const hashedPassword = bcrypt.hashSync(value, 10);
      this.setDataValue('password', hashedPassword);
    }
  },
}, {
  timestamps: true // 添加 createdAt 和 updatedAt 字段
});

// 使用body解析中间件
app.use(bodyParser());
app.use(cookie());

router.get('/login', async (ctx, next) => {
  ctx.response.type = 'html';
  ctx.response.body = fs.createReadStream('./views/login.html');
  await next();
});

router.get('/signin', async (ctx, next) => {
  ctx.response.type = 'html';
  ctx.response.body = fs.createReadStream('./views/signin.html');
  await next();
});

router.get('/', async (ctx, next) => {
  ctx.response.type = 'html';
  if(ctx.cookies.get('loggedIn') === 'true') {
    ctx.response.body = fs.createReadStream('./views/home.html');
  }
  else {
    ctx.redirect('/login');
  }
  await next();
})

router.get('/logout', async (ctx, next) => {
  ctx.cookies.set('loggedIn', 'false');
  ctx.cookies.set('username','');
  ctx.redirect('/login');
  await next();
});

router.get('/change-password', async (ctx, next) => {
  ctx.response.type = 'html';
  if(ctx.cookies.get('loggedIn') === 'true') {
    ctx.response.body = fs.createReadStream('./views/change-password.html');
  }
  else {
    ctx.redirect('/login');
  }
  await next();
});

router.post('/signin', async (ctx, next) => {
  const { email, username, password, confirmedPassword } = ctx.request.body;
  const existingEmail = await Users.findOne({ where: { email: email } });
  const existingUser = await Users.findOne({ where: { username: username } });
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // 创建新的用户实例
  try {
    const responseArray = [];
    if (!existingEmail && !existingUser && passwordRegex.test(password) && emailRegex.test(email) && password === confirmedPassword) {
      await Users.create({ email, username, password });
      responseArray.push({sta: 'success', code: 0});
    }
    else {
      if (existingEmail) {
        responseArray.push({sta: 'error', code: 1});
      }
      if (existingUser) {
        responseArray.push({sta: 'error', code: 2});
      }
      if (!passwordRegex.test(password)) {
        responseArray.push({sta: 'error', code: 3});
      }
      if (!emailRegex.test(email)) {
        responseArray.push({sta: 'error', code: 4});
      }
      if (password && confirmedPassword !== password) {
        responseArray.push({sta: 'error', code: 5});
      }
    }
    ctx.body = responseArray;
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = 'Error registering user';
  }
  await next();
})

router.post('/login', async (ctx, next) => {
  const { username, password } = ctx.request.body;
  try {
    const responseArray = [];
    const existingUser = await Users.findOne({ where: { username: username } });
    if (existingUser) {
      const passwordMatch = await bcrypt.compare(password, existingUser.password);
      if (passwordMatch) {
        responseArray.push({sta:'success', code: 0});
        ctx.cookies.set('loggedIn', 'true');
        ctx.cookies.set('username',JSON.stringify(username));
      } else {
        responseArray.push({sta:'error', code: 1});
      }
    } else {
      responseArray.push({sta:'error', code: 2});
    }
    ctx.body = responseArray;
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = 'Error registering user';
  }
  await next();
})

router.post('/change-password',async (ctx, next) => {
  const {email, oldPassword, newPassword, confirmedPassword} = ctx.request.body;
  try {
    const responseArray = [];
    const username = JSON.parse(ctx.cookies.get('username'));
    const existingUser = await Users.findOne({ where: { username: username } });
    const emailMatch = email === existingUser.email;
    const passwordMatch = await bcrypt.compare(oldPassword, existingUser.password);
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if(emailMatch && passwordMatch && passwordRegex.test(newPassword) && newPassword === confirmedPassword) {
      responseArray.push({sta:'success', code: 0});
      existingUser.password = newPassword;
      existingUser.save();
      ctx.cookies.set('loggedIn', 'false');
      ctx.cookies.set('username','');
    }
    else {
      if(!emailMatch) {
        responseArray.push({sta:'error', code: 1});
      }
      if(!passwordMatch) {
        responseArray.push({sta:'error', code: 2});
      }
      if(!passwordRegex.test(newPassword)) {
        responseArray.push({sta:'error', code: 3});
      }
      if(newPassword !== confirmedPassword) {
        responseArray.push({sta:'error', code: 4});
      }
    }
    ctx.body = responseArray;
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = 'Error registering user';
  }
  await next();
})

app.use(async (ctx, next) => {
  console.log(`${ctx.request.method} ${ctx.request.url}`); // 打印URL
  await next();
});

app.use(router.routes());
// 启动服务器
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
