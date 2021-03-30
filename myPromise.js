
const STATE = {
  'PENDING': 'pending',
  'FULFILLED': 'fullfilled',
  'REJECTED': 'rejected',
}

const utils = {
  isFunction: (input) => typeof input === 'function',
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
      this.resolveQueue.forEach((fn) => fn(value));
    }
    const reject = (reason) => {
      // When fulfilled or rejected must not transition to any other state.
      if (this.state !== STATE.PENDING) return;
      this.state = STATE.REJECTED;
      // must have a reason, which must not change.
      this.reason = reason;
      this.rejectQueue.forEach((fn) => fn(reason));
    }
    try {
      fn(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  then(onFulfilled, onRejected) {
    // If onFulfilled or onRejected is not a function, it must be ignored.
    onFulfilled = utils.isFunction(onFulfilled) ? onFulfilled : function (value) { return value }
    onRejected = utils.isFunction(onRejected) ? onRejected : function (reason) { throw reason }
    if (this.state === STATE.PENDING) {
      return new PromiseNew((resolve, reject) => {
        const cb = (fn) => {
          let called = false;
          return (value) => {
            try {
              const result = fn(value);
              called = true;
              resolve(result);
            } catch (e) {
              if (called) return;
              called = true;
              reject(e);
            }
          }
        }
        this.resolveQueue.push(cb(onFulfilled));
        this.rejectQueue.push(cb(onRejected));
      });
    } else {
      return new PromiseNew((resolve, reject) => {
        const cb = (fn) => {
          let called = false
          return (value) => {
            try {
              const result = fn(value);
              called = true;
              resolve(result);
            } catch (e) {
              if (called) return;
              called = true
              reject(e);
            }
          }
        }
        this.state === STATE.FULFILLED ? cb(onFulfilled)(this.value) : cb(onRejected)(this.reason);
      });
    }
  }
}

module.exports = PromiseNew;