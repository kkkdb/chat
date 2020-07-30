let dbserver = require("../dao/dbserver");
let out = require("../common/out");
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

//获取好友列表
exports.queryFriendList = function (req, res) {
  let { user_id, status } = req.body;
  out(dbserver.queryFriendList(user_id, status), res);
};
