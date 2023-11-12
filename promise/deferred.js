function promiseResolve(promise, value, resolve, reject) {
  let called = false;
  try {
    // 判断循环引用
    if (promise === value) {
      reject(new TypeError('Chaining cycle detected for promise'));
      return;
    }
    // 如果 value 是 promise 对象
    if (value instanceof Deferred) {
      value.then(
        function (value) {
          promiseResolve(promise, value, resolve, reject);
        },
        function (reason) {
          reject(reason);
        }
      )
      return;
    }
    //对象或者函数（注意排除null，不用typeof）
    if ({}.toString.call(value) === '[object Object]' || {}.toString.call(value) === '[object Function]') {
      // if ((typeof value === 'object' || typeof value === 'function') && value !== null) {
      let then = value.then;
      //如果then是函数
      if (typeof then === 'function') {
        then.call(value, function (val) {//在value的作用域下执行函数
          if (called) return; //只能被调用一次
          called = true;
          promiseResolve(promise, val, resolve, reject);
        }, function (reason) {
          if (called) return;
          called = true;
          reject(reason);
        })
        return;
      }
    }
    // 其他值则直接返回
    resolve(value);
  } catch (error) {
    if (called) return;
    called = true;
    reject(error);
  }
}

class Deferred {
  constructor(callback) {
    this.value = undefined;
    this.status = 'PENDING';
    this.rejectQueue = [];
    this.resolveQueue = [];
    let called; // 用于判断状态是否被修改
    const resolve = value => {
      if (called) return;
      called = true;
      // 异步调用
      queueMicrotask(() => {
        this.value = value;
        this.status = 'FULFILLED';
        //依次执行队列中的函数
        for (const fn of this.resolveQueue) {
          fn(this.value);
        }
      });
    }
    const reject = reason => {
      if (called) return;
      called = true;
      // 异步调用
      queueMicrotask(() => {
        this.value = reason;
        this.status = 'REJECTED';
        for (const fn of this.rejectQueue) {
          fn(this.value);
        }
      });
    }
    try {
      callback(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onResolve, onReject) {
    let newPromise;
    // 解决值穿透
    onResolve = typeof onResolve === 'function' ? onResolve : value => value;
    onReject = typeof onReject === 'function' ? onReject : reason => { throw reason; }
    // 等待状态，将回调放入队列中 
    if (this.status === 'PENDING') {
      return newPromise = new Deferred((resolve, reject) => {
        // 暂存到成功回调等待调用
        this.resolveQueue.push(function (innerValue) {
          try {
            const value = onResolve(innerValue);
            promiseResolve(newPromise, value, resolve, reject);
          } catch (error) {
            reject(error);
          }
        })
        // 暂存到失败回调等待调用
        this.rejectQueue.push(function (innerValue) {
          try {
            const value = onReject(innerValue);
            promiseResolve(newPromise, value, resolve, reject);
          } catch (error) {
            reject(error);
          }
        })
      })
    } else {//非等待状态，可以直接处理
      const innerValue = this.value;
      const isFulfilled = this.status === 'FULFILLED';
      return newPromise = new Deferred((resolve, reject) => {
        //注意异步
        queueMicrotask(() => {
          try {
            const value = isFulfilled ? onResolve(innerValue) : onReject(innerValue);
            promiseResolve(newPromise, value, resolve, reject);
          } catch (error) {
            reject(error);
          }
        })
      })
    }
  }

  catch(onReject) {
    return this.then(null, onReject);
  }

  finally(callback) {
    return this.then(
      value => Deferred.resolve(callback()).then(() => { return value }),
      error => Deferred.resolve(callback()).then(() => { throw error })
    );
  }

  static resolve(value) {
    let newPromise;
    newPromise = new Deferred((resolve, reject) => {
      promiseResolve(newPromise, value, resolve, reject);
    })
    return newPromise;
  }

  static reject(reason) {
    return new Deferred((resolve, reject) => {
      reject(reason)
    })
  }

  static all(promises) {
    // 非数组参数，抛出异常
    if (!Array.isArray(promises)) {
      return Deferred.reject(new TypeError('args must be an array'));
    }
    const result = []; // 用于存储每个 promise 对象的结果
    const length = promises.length;
    let remaining = length;
    const promise = new Deferred(function (resolve, reject) {
      // 如果数组为空，则返回空结果
      if (promises.length === 0) return resolve(result);
      function done(index, value) {
        promiseResolve(promise, value, (val) => {
          // resolve 的结果放入 result 中
          result[index] = val;
          if (--remaining === 0) {
            // 如果所有的 promise 都已经返回结果
            resolve(result);
          }
        }, reject);
      }
      // 放入异步队列
      queueMicrotask(() => {
        for (let i = 0; i < length; i++) {
          done(i, promises[i]);
        }
      });
    });
    return promise;
  }

  static race(promises) {
    if (!Array.isArray(promises)) {
      return Deferred.reject(new TypeError('args must be an array'));
    }
    return new Deferred(function (resolve, reject) {
      promises.forEach(function(value){
        Deferred.resolve(value).then(resolve, reject);
      });
    });
  }

  static allSettled(promises) {
    const resolveHandler = value => ({ status: 'fulfilled', value });
    const rejectHandler = reason => ({ status: 'rejected', reason });
    const convertedPromises = promises.map(p => Promise.resolve(p).then(resolveHandler, rejectHandler));
    return Promise.all(convertedPromises);
  }
}

const delayDouble = (num, time) => new Deferred((resolve) => {
  setTimeout(() => {
    resolve(2 * num);
  }, time);
});

let mode = 4;
if (mode === 1) {
  new Deferred(resolve => {
    setTimeout(() => {
      resolve(1);
    }, 1000);
  })
    .then(val => {
      console.log(val);
      return delayDouble(val, 1000);
    })
    .then(val => {
      console.log(val);
    });
}

if (mode === 2) {
  Deferred.all([
    delayDouble(1, 1000),
    delayDouble(2, 2000),
    delayDouble(3, 3000),
    // new Promise((resolve, reject) => setTimeout(() => reject(new Error("Whoops!")), 2000))
  ]).then((results) => {
    console.log(results);
  });
}
if (mode === 3) {
  Deferred.race([
    delayDouble(1, 1000),
    delayDouble(2, 2000),
    delayDouble(3, 3000),
    // new Deferred((resolve, reject) => setTimeout(() => reject(new Error("Whoops!")), 2000))
  ]).then((results) => {
    console.log(results);
  });
}

if (mode === 4) {
  Deferred.allSettled([
    delayDouble(1, 1000),
    delayDouble(2, 2000),
    delayDouble(3, 3000),
    // new Promise((resolve, reject) => setTimeout(() => reject(new Error("Whoops!")), 2000))
  ]).then((results) => {
    console.log(results);
  });
}

Deferred.deferred = function () {
  let result = {};
  result.promise = new Deferred(function (resolve, reject) {
    result.resolve = resolve;
    result.reject = reject;
  });

  return result;
}
module.exports = Deferred;