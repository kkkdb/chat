const jwt = require("jsonwebtoken");
let { secret, expiresIn } = require("../config/secret"); //秘钥
//生成token
const setToken = function (id) {
  return new Promise((resolve, reject) => {
    const token = jwt.sign({ id }, secret, { expiresIn });
    resolve(token);
  });
};
//验证token
const verToken = function (token) {
  return new Promise((resolve, reject) => {
    let info = jwt.verify(token.split(" ")[1], secret);
    resolve(info);
  });
};

module.exports = { setToken, verToken };
