let express = require("express");
let router = express.Router();
let { findUser } = require("../dao/dbserver.js");
let { emailSignUp } = require("../dao/emailcontroller");

router.get("/test", (req, res) => findUser(res));
router.post("/sendEmail", (req, res) => {
  let email = req.body.email;
  return emailSignUp(email, res);
});

module.exports = router;
