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

// Promise.reject(1).then((res) => {
//   console.log('resolved', res);
// }, (res) => {
//   console.log('rejected', res);
// }).catch((e) => {
//   console.log('catch', e)
// })
// rejected 1


// Promise.reject(1).then((res) => {
//   console.log('resolved', res);
// }).catch((e) => {
//   console.log('catch', e)
// })
// catch 1

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

// const p = new Promise((resolve, reject) => {
//   resolve(1);
//   throw new Error('oh, error');
// });
// p.then((res) => {
//   console.log('resolved', res);
// }, (res) => {
//   console.log('rejected', res);
// })

const PromiseNew = require('./myPromise');
const p = new PromiseNew((resolve, reject) => {
  resolve(1);
  throw new Error('oh, error');
});
setTimeout(()=>{
  p.then((res) => {
    console.log('resolved', res);
  }, (res) => {
    console.log('rejected', res);
  })
}, 1000)
