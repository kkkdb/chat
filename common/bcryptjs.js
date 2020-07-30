let bcrypt = require("bcryptjs");

exports.encryption = function (e) {
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(e, salt);
  return hash;
};

exports.decryption = function (e, hash) {
  return bcrypt.compareSync(e, hash);
};
