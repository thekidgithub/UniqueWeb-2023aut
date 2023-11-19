const fs = require('fs');

function addMapping(router, mapping) {
  for (const url in mapping) {
    if (url.startsWith('GET ')) {
      const path = url.substring(4);
      router.get(path, mapping[url]);
    } else if (url.startsWith('POST ')) {
      const path = url.substring(5);
      router.post(path, mapping[url]);
    } else {
      console.log(`invalid URL: ${url}`);
    }
  }
}

function addControllers(router, dir) {
  fs.readdirSync(`./${dir}`).filter((f) => {
    return f.endsWith('.js');
  }).forEach((f) => {
    let mapping = require(`./${dir}/${f}`);
    addMapping(router, mapping);
  });
}

module.exports = function () {
  let
    controllers_dir = 'controllers',
    router = require('koa-router')();
  addControllers(router, controllers_dir);
  return router.routes();
};