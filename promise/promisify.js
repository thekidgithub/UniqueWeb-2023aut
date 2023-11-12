function doValue(value, callback) {
  setTimeout(() => {
    if (typeof value === 'number') {
      callback(null, value * 2);
    } else {
      callback(new TypeError('typeError'));
    }
  }, 1000);
}

function promisify(f) {
  return function (...args) { // 返回一个包装函数
    return new Promise((resolve, reject) => {
      function callback(err, result) { // 我们对 f 的自定义的回调
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
      args.push(callback); // 将我们的自定义的回调附加到 f 参数的末尾
      f.call(this, ...args); // 调用原始的函数
    });
  };
}

const doValueAsync = promisify(doValue);

doValueAsync(1)
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.error(err);
  });
const obj = {c:1}
const a = () => {console.log(this);}
new a;