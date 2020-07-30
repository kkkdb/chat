let Result = require("./result");

module.exports = function (promise, res) {
  let result = new Result();
  if (isPromise(promise)) {
    promise
      .then(val => {
        result.result = val;
        result.success(res);
      })
      .catch(err => {
        result.msg = err;
        result.fail(res);
      });
  } else {
    //是对象直接输出
    result.result = promise;
    result.success(res);
  }
};

function isPromise(obj) {
  return !!obj && (typeof obj === "object" || typeof obj === "function") && typeof obj.then === "function";
}
