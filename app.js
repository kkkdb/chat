const express = require("express");
const app = express();
const port = 3000;
const expressJwt = require("express-jwt");
const { secret } = require("./config/secret"); //秘钥
const { verToken } = require("./common/jwt");
const { EXPIRED_CODE } = require("./config/constant");

const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const friendRouter = require("./routes/friend");
const searchRouter = require("./routes/search");

app.use(require("cors")());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 解析token获取用户信息
app.use(function (req, res, next) {
  var token = req.headers["authorization"];
  if (token === undefined) {
    return next();
  } else {
    verToken(token)
      .then(data => {
        req.data = data;
        return next();
      })
      .catch(error => {
        console.log(error);
        return next();
      });
  }
});
app.use(
  expressJwt({
    secret, // 签名的密钥 或 PublicKey
    algorithms: ["HS256"]
  }).unless({
    path: ["/user/signin", "/user/signup"] // 指定路径不经过 Token 解析
  })
);

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/friend", friendRouter);
app.use("/search", searchRouter);

//404页面
app.use(function (req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

//出现错误
app.use(function (err, req, res, next) {
  console.log(err);
  if (err.name === "UnauthorizedError") {
    console.error(req.path + ",无效token");
    res.json({
      msg: "token过期，请重新登录",
      code: EXPIRED_CODE,
      success: false
    });
    return;
  }
  res.status(err.status || 500);
  res.send(err.message);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
