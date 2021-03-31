// --------------------不重复变更状态----------------------------------------
// const p = new Promise((resolve, reject) => {
//   resolve(1);
//   reject(2);
// });
// p.then((res) => {
//   console.log('resolved', res);
// }, (res) => {
//   console.log('rejected', res);
// })
// resolved 1

// --------------------如果已经在onRejected中捕获错误，catch就不会调用了----------------------------------------
// Promise.reject(1).then((res) => {
//   console.log('resolved', res);
// }, (res) => {
//   console.log('rejected', res);
// }).catch((e) => {
//   console.log('catch', e)
// })
// rejected 1

// --------------------如果没有定义onRejected，则会进入到catch里----------------------------------------
// Promise.reject(1).then((res) => {
//   console.log('resolved', res);
// }).catch((e) => {
//   console.log('catch', e)
// })
// catch 1

// --------------------即使状态变更了，函数还是会执行完毕----------------------------------------
// const p = new Promise((resolve, reject) => {
//   resolve(1);
//   console.log('still exe');
// });
// p.then((res) => {
//   console.log('resolved', res);
// }, (res) => {
//   console.log('rejected', res);
// })
// still exe
// resolved 1

// ---------------------状态变更后抛出的错误会被忽略，不会执行onRejected，也不会抛出错误---------------------------------------
// const p = new Promise((resolve, reject) => {
//   resolve(1);
//   throw new Error('oh, error');
// });
// p.then((res) => {
//   console.log('resolved', res);
// }, (res) => {
//   console.log('rejected', res);
// })
// resolved 1 不抛出错误

// -------------------reject后没有定义onRejected，会抛出错误-----------------------------------------
// const p = new Promise((resolve, reject) => {
//   reject(1);
// });
// // 抛出错误

// -------------------返回的值与promise相等，抛出TypeError:Chaining cycle detected for promise-----------------------------------------
// const p = new Promise((resolve, reject) => {
//   resolve(1);
// }).then(function () {
//   return p;
// });




// -------------------测试myPromise-----------------------------------------
// const PromiseNew = require('./myPromise');
// const p = new PromiseNew((resolve, reject) => {
//   resolve(1);
//   throw new Error('oh, error');
// });
// p.then((res) => {
//   console.log('resolved', res);
// }, (res) => {
//   console.log('rejected', res);
// })
