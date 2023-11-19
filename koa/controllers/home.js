const fs = require('fs');

const getHome =  async (ctx, next) => {
  ctx.response.type = 'html';
  if(ctx.cookies.get('loggedIn') === 'true') {
    ctx.response.body = fs.createReadStream('./views/home.html');
  }
  else {
    ctx.redirect('/login');
  }
  await next();
}

module.exports = {
  'GET /': getHome
}