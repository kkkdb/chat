let dbserver = require("../dao/dbserver");
let out = require("../common/out");
//注册
exports.signUp = function (req, res) {
  let { name, pwd, email } = req.body;
  out(dbserver.registerUser(name, pwd, email), res);
};

//用户或邮箱是否占用判断
exports.judgeExist = function (req, res) {
  let { data, type } = req.body;
  out(dbserver.countUserNum(data, type), res);
};

//登录
exports.signIn = function (req, res) {
  let { email, pwd } = req.body;
  out(dbserver.login(email, pwd), res);
};

//校验原密码
exports.checkPwd = function (req, res) {
  let { pwd, hash_pwd } = req.body;
  out(dbserver.checkPwd(pwd, hash_pwd), res);
};

//获取个人信息
exports.queryUserDetail = function (req, res) {
  let { user_id } = req.body;
  out(dbserver.queryUserDetail(user_id), res);
};

//更新个人信息
exports.updateUserDetail = function (req, res) {
  let { user_res } = req.body;
  out(dbserver.updateUserDetail(user_res), res);
};

//搜索好友
exports.searchUser = function (req, res) {
  let { user_id, data } = req.body;
  out(dbserver.searchUser(user_id, data), res);
};

//判断是否是好友
exports.isFriend = function (req, res) {
  let { user_id, friend_id } = req.body;
  out(dbserver.isFriend(user_id, friend_id), res);
};

//搜索群
exports.searchGroup = function (req, res) {
  let { user_id, data } = req.body;
  out(dbserver.searchGroup(user_id, data), res);
};

//判断是否在群
exports.isInGroup = function (req, res) {
  let { user_id, group_id } = req.body;
  out(dbserver.isInGroup(user_id, group_id), res);
};

//申请添加好友
exports.applyAddFriend = function (req, res) {
  let { friend_id, user_id, message } = req.body;
  out(dbserver.applyAddFriend(user_id, friend_id, message), res);
};

//同意添加好友
exports.agreeAddFriend = function (req, res) {
  let { friend_id, user_id } = req.body;
  out(dbserver.agreeAddFriend(user_id, friend_id), res);
};

//拒绝/删除添加好友
exports.deleteFriend = function (req, res) {
  let { friend_id, user_id } = req.body;
  out(dbserver.deleteFriend(user_id, friend_id), res);
};
