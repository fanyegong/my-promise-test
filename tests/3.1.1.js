"use strict";

var assert = require("assert");
// var testFulfilled = require("./helpers/testThreeCases").testFulfilled;

var adapter = global.adapter;
var deferred = adapter.deferred;

var dummy = { dummy: "dummy" }; // we fulfill or reject with this when we don't intend to test against it
var sentinel = { sentinel: "sentinel" }; // a sentinel fulfillment value to test for with strict equality


describe("3.1.1.1: Catch test.", function () {

  specify("if then has defined onRejected, catch will not be called when rejected", function (done) {
    var d = deferred();

    d.promise.then(function onFulfilled() {
    }, function onRejected() {
    }).catch(function onRejected() {
        assert.strictEqual(true, false);
        done();
    });
    d.reject(dummy);
    setTimeout(done, 100);
  });

  specify("if then dit not define onRejected, catch will be called when rejected", function (done) {
    var d = deferred();
    d.promise.catch(function onRejected(value) {
        assert.strictEqual(value, sentinel);
        done();
    });
    d.reject(sentinel);
  });

});