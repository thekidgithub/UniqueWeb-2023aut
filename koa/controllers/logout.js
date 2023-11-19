const getLogout = async (ctx, next) => {
  ctx.cookies.set('loggedIn', 'false');
  ctx.cookies.set('username','');
  ctx.redirect('/login');
  await next();
}

module.exports = {
  'GET /logout': getLogout
}