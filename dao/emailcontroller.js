//引用发送邮箱插件
let nodemailer = require("nodemailer");

//引入证书文件
let credentials = require("../config/credentials");

//创建传输方式
let transporter = nodemailer.createTransport({
  service: "qq",
  auth: {
    user: credentials.qq.user,
    pass: credentials.qq.pass
  }
});

exports.emailSignUp = function (email, res) {
  let options = {
    from: credentials.qq.user, // 发送邮箱
    to: email, // 接受邮箱
    subject: "【chat】邮箱注册验证", // 标题
    html: "<span>欢迎加入chat聊天工具~<a href='http://localhost:8081'>点击确认注册</a></span>" // html body
  };
  transporter.sendMail(options, function (err, msg) {
    if (err) {
      console.log("邮件发送错误" + err);
    } else {
      console.log("邮件发送成功！");
      res.send(res);
    }
  });
};
