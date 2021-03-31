// https://github.com/promises-aplus/promises-spec
/**
 * tips: 1. 执行then的方法要异步并且注意try catch
 *       2. 状态只能变更一次
 *       3. then传参数不合法时需要透传
 */
const STATE = {
  'PENDING': 'pending',
  'FULFILLED': 'fullfilled',
  'REJECTED': 'rejected',
}

const utils = {
  isFunction: (input) => typeof input === 'function',
  isObject: (input) => Object.prototype.toString.call(input).slice(8, -1) === 'Object',
};

// [[Resolve]](promise, x) 
const resolveByResult = (promise, x, resolve, reject) => {
  let called = false;
  try {
    // If promise and x refer to the same object, reject promise with a TypeError as the reason.
    if (x === promise) {
      reject(new TypeError('Chaining cycle detected for promise!'));
    }
    if (x instanceof PromiseNew) {
      x.then(function (val) {
        resolveByResult(promise, val, resolve, reject);
      }, reject);
      return;
    }
    if (utils.isObject(x) || utils.isFunction(x)) {
      let then = x.then;
      if (utils.isFunction(then)) {
        then.call(x, function (y) {
          if (called) return;
          called = true;
          resolveByResult(promise, y, resolve, reject);
        }, function (r) {
          if (called) return;
          called = true;
          reject(r);
        });
        return;
      }
    }
    resolve(x);
  } catch (error) {
    if (called) return;
    called = true;
    reject(error);
  }
}

const getRealCb = (fn, promise, resolve, reject) => {
  return (value) => {
    try {
      const result = fn(value);
      resolveByResult(promise, result, resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
}

class PromiseNew {
  constructor(fn) {
    this.state = STATE.PENDING;
    this.value = null;
    this.reason = null;
    this.resolveQueue = [];
    this.rejectQueue = [];
    const resolve = (value) => {
      // When fulfilled or rejected must not transition to any other state.
      if (this.state !== STATE.PENDING) return;
      this.state = STATE.FULFILLED;
      // must have a value, which must not change.
      this.value = value;
      // execute asynchronously
      setTimeout(() => {
        // onFulfilled and onRejected must be called as functions (i.e. with no this value).
        this.resolveQueue.forEach((fn) => fn(value));
      }, 0);
    }
    const reject = (reason) => {
      // When fulfilled or rejected must not transition to any other state.
      if (this.state !== STATE.PENDING) return;
      this.state = STATE.REJECTED;
      // must have a reason, which must not change.
      this.reason = reason;
      // execute asynchronously
      setTimeout(() => {
        // onFulfilled and onRejected must be called as functions (i.e. with no this value).
        this.rejectQueue.forEach((fn) => fn(reason));
      }, 0);
    }
    try {
      // onFulfilled and onRejected must be called as functions (i.e. with no this value).
      fn(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  then(onFulfilled, onRejected) {
    // If onFulfilled or onRejected is not a function, it must be ignored
    // and pass the value or reason
    onFulfilled = utils.isFunction(onFulfilled) ? onFulfilled : function (value) { return value }
    onRejected = utils.isFunction(onRejected) ? onRejected : function (reason) { throw reason }

    let newPromise;
    if (this.state === STATE.PENDING) {
      return newPromise = new PromiseNew((resolve, reject) => {
        setTimeout(() => {
          this.resolveQueue.push(getRealCb(onFulfilled, newPromise, resolve, reject));
          this.rejectQueue.push(getRealCb(onRejected, newPromise, resolve, reject));
        }, 0); // without setTimeout, newPromise is undefined
      });
    } else {
      return newPromise = new PromiseNew((resolve, reject) => {
        // execute asynchronously
        setTimeout(() => {
          this.state === STATE.FULFILLED ? 
            getRealCb(onFulfilled, newPromise, resolve, reject)(this.value) : getRealCb(onRejected, newPromise, resolve, reject)(this.reason);
        }, 0);
      });
    }
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(onFinished) {
    const P = this.constructor;
    return this.then(
      (value) => P.resolve(onFinished()).then(() => value),
      (reason) => P.resolve(onFinished()).then(() => { throw reason }), 
    );
  }

  static resolve(value) {
    // 如果参数是 Promise 实例，那么Promise.resolve将不做任何修改、原封不动地返回这个实例。
    if (value instanceof PromiseNew) {
      return value; 
    }
    return new this((resolve, reject) => resolve(value));
  }

  static reject(value) {
    if (value instanceof PromiseNew) {
      return value; 
    }
    return new this((resolve, reject) => reject(value));
  }
}

module.exports = PromiseNew;