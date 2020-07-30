let mongoose = require("mongoose");
let db = require("../config/db");
let Schema = mongoose.Schema;

//用户表
let UserSchema = new Schema({
  name: String, //用户名
  pwd: String, //密码
  email: String, //邮箱
  avatar: { type: String, default: "http://img0.imgtn.bdimg.com/it/u=2839452742,499634096&fm=15&gp=0.jpg" }, //头像
  introduce: String, //自我介绍
  sex: { type: String, default: "asexual" }, //性别默认中性 male男性 female女性
  birthday: String, //生日
  mobile: String, //电话
  created_at: String //创建时间
});

//好友表
let FriendSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User" }, //用户id
  friend_id: { type: Schema.Types.ObjectId, ref: "User" }, //好友id
  markname: String, //好友昵称
  status: Number, //好友状态(0表示已是好友，1表示收到好友申请，2表示已发送申请给好友)
  created_at: String, //创建时间
  updated_at: String //最后一次聊天时间
});

//一对一消息表
let UserMessageSchema = new Schema({
  send_id: { type: Schema.Types.ObjectId, ref: "User" }, //发送者id
  receive_id: { type: Schema.Types.ObjectId, ref: "User" }, //接收者id
  message: String, //内容
  message_type: Number, //内容类型(0表示文字，1表示图片路径，2表示语音……)
  status: Number, //消息状态（0未读，1已读）
  created_at: String //发送时间
});

//群表
let GroupSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User" }, //群主id
  name: String, //群名
  avatar: { type: String, defaule: "group.png" }, //头像
  notice: String, //群公告
  created_at: String //创建时间
});

//群成员表
let GroupUserSchema = new Schema({
  group_id: { type: Schema.Types.ObjectId, ref: "Group" }, //群id
  user_id: { type: Schema.Types.ObjectId, ref: "User" }, //用户id
  user_in_group_name: String, //群内名
  unread_num: { type: Number, default: 0 }, //未读消息数量
  is_shield: Number, //是否屏蔽群(0未屏蔽，1已屏蔽)
  created_at: String, //加入时间
  updated_at: String //最后一次聊天时间
});

//群消息表
let GroupMessageSchema = new Schema({
  group_id: { type: Schema.Types.ObjectId, ref: "Group" }, //群id
  user_id: { type: Schema.Types.ObjectId, ref: "User" }, //发送者id
  message: String, //内容
  message_type: Number, //内容类型(0表示文字，1表示图片路径，2表示语音……)
  created_at: String //加入时间
});

module.exports = db.model("User", UserSchema);
module.exports = db.model("Friend", FriendSchema);
module.exports = db.model("UserMessage", UserMessageSchema);
module.exports = db.model("Group", GroupSchema);
module.exports = db.model("GroupUser", GroupUserSchema);
module.exports = db.model("GroupMessage", GroupMessageSchema);
