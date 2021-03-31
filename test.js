const adapter = require('./adapter');
global.adapter = adapter;
var promisesAplusTests = require("promises-aplus-tests");
promisesAplusTests(adapter, function (err) {
    // All done; output is in the console. Or check `err` for number of failures.
});