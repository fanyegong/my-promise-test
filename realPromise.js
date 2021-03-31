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

// -------------------finally的onFinished回调取不到value或reason,也会返回新的promise, 透传之前的值，但是如果在onFinished里报错或者返回rejected promise, 新的promise会跟随新的reason -----------------------------------------
// const Promise = require('./myPromise');
// // undefined 44 55 3 22
// let a = 2;
// const p = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     a = 3;
//     resolve(1);
//   }, 3000);
// })

// Promise.resolve(22).finally((value) => {
//   console.log(value); // undefined ps:回调取不到value或reason
//   return p
// }).then((value) => {
//   console.log(a); // 3   ps: wait for p
//   console.log(value); // 22  ps: 透传value
// })

// Promise.resolve(22).finally(() => {
//   throw new Error(44)
// }).then((value) => {
//   console.log(value);
// },(err) => {
//   console.log(err.message); // 44 ps: 新的reason
// })

// Promise.reject(55).finally(() => {
//   return 66
// }).then((value) => {
//   console.log(value);
// },(err) => {
//   console.log(err); // 55 ps: 透传 reason
// })

// -------------------Promise.resolve(p1)等价new Promise(resolve => resolve(p1)) 都应该等待p1完成，通过此问题检查出myPromise的实现漏洞 -----------------------------------------
const Promise = require('./myPromise');
let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 3000);
}); new Promise(resolve => resolve(p1)).then(()=>console.log(111))

let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 3000);
}); Promise.resolve(p2).then(()=>console.log(222))




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
