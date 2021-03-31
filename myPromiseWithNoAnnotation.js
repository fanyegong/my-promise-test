
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
      if (this.state !== STATE.PENDING) return;
      this.state = STATE.FULFILLED;
      this.value = value;
      setTimeout(() => {
        this.resolveQueue.forEach((fn) => fn(value));
      }, 0);
    }
    const reject = (reason) => {
      if (this.state !== STATE.PENDING) return;
      this.state = STATE.REJECTED;
      this.reason = reason;
      setTimeout(() => {
        this.rejectQueue.forEach((fn) => fn(reason));
      }, 0);
    }
    try {
      fn(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = utils.isFunction(onFulfilled) ? onFulfilled : function (value) { return value }
    onRejected = utils.isFunction(onRejected) ? onRejected : function (reason) { throw reason }

    let newPromise;
    if (this.state === STATE.PENDING) {
      return newPromise = new PromiseNew((resolve, reject) => {
        setTimeout(() => {
          this.resolveQueue.push(getRealCb(onFulfilled, newPromise, resolve, reject));
          this.rejectQueue.push(getRealCb(onRejected, newPromise, resolve, reject));
        }, 0); // 这里不加setTimeout时, newPromise是undefined
      });
    } else {
      return newPromise = new PromiseNew((resolve, reject) => {
        setTimeout(() => {
          this.state === STATE.FULFILLED ? 
            getRealCb(onFulfilled, newPromise, resolve, reject)(this.value) : getRealCb(onRejected, newPromise, resolve, reject)(this.reason);
        }, 0);
      });
    }
  }
}

module.exports = PromiseNew;