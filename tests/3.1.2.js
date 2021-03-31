"use strict";

var assert = require("assert");
const Promise = require('../myPromise');

var dummy = { dummy: "dummy" }; // we fulfill or reject with this when we don't intend to test against it
var sentinel = { sentinel: "sentinel" }; // a sentinel fulfillment value to test for with strict equality


describe("3.1.2: `finally` test.", function () {

  specify("`finally` `onFinished` callback will be call with no param", function (done) {
    Promise.resolve(22).finally((value) => {
      assert.strictEqual(value, undefined);
      done();
    })
  });

  specify("if `onFinished` callback return a Promise, it will returen a new Promise depending on this Promise", function (done) {
    let a = 2;
    const p = new Promise((resolve, reject) => {
      setTimeout(() => {
        a = 3;
        resolve(1);
      }, 100);
    });

    Promise.resolve(22).finally((value) => {
      return p
    }).then((value) => {
      assert.strictEqual(a, 3);
      assert.strictEqual(value, 22);
      done();
    });
  });

  specify("if `onFinished` throws a error, the returned promise will rejected with this error", function (done) {
    Promise.resolve(22).finally(() => {
      throw new Error(44)
    }).then((value) => {
      // console.log(value);
    },(err) => {
      assert.strictEqual(err.message, '44');
      done()
    })
  });

  specify("`finally` will remain the reject info of previous promise", function (done) {
    Promise.reject(55).finally(() => {
      return 66;
    }).then((value) => {
      console.log(value);
    },(err) => {
      assert.strictEqual(err, 55);
      done();
    })
  });


});