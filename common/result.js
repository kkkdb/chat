const { ERR_CODE, SUCC_CODE, ERR_MSG, SUCC_MSG } = require("../config/constant");
class Result {
  constructor(result = null, options) {
    this.result = result;
    if (options) {
      this.options = options;
    }
  }
  json(res) {
    return res.json(this.createResult());
  }
  createResult() {
    let result_mapping = {
      success: {
        code: SUCC_CODE,
        msg: SUCC_MSG,
        success: true
      },
      fail: {
        code: this.code || ERR_CODE,
        msg: this.msg || ERR_MSG,
        success: false
      }
    };
    let base = {
      result: this.result,
      ...result_mapping[this.type]
    };
    if (this.options) {
      base = { ...base, ...this.options };
    }
    return base;
  }
  success(res) {
    this.type = "success";
    return this.json(res);
  }
  fail(res) {
    this.type = "fail";
    return this.json(res);
  }
}

module.exports = Result;
