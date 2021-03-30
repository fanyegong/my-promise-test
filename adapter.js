const Promise = require('./myPromise.js');
const adapter = {
  deferred: deferred,
  resolved: (value) => new Promise((resolve, reject) => resolve(value)),
  rejected: (reason) => new Promise((resolve, reject) => reject(reason)),
}

function deferred() {
  const pending = {};
  pending.promise = new Promise((resolve, reject) => {
    pending.resolve = resolve;
    pending.reject = reject;
  })
  return pending;
}

module.exports = adapter;