let mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/chat", { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });
let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("数据库连接成功");
});

module.exports = db;
