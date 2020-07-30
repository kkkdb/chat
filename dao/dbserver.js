let dbmodel = require("../model/dbmodel");
let User = dbmodel.model("User");
let Friend = dbmodel.model("Friend");
let Group = dbmodel.model("Group");
let GroupUser = dbmodel.model("GroupUser");
let UserMessage = dbmodel.model("UserMessage");
let bcrypt = require("../common/bcryptjs");
let jwt = require("../common/jwt");
const { where } = require("../model/dbmodel");
require("../common/dateFormat");

//公用方法
function updateUpdatedAt(dbmodel, wherestr) {
  return new Promise((resolve, reject) => {
    dbmodel.updateMany(wherestr, { updated_at: new Date().Format("yyyy-MM-dd HH:mm:ss") }, (err, val) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(val);
    });
  });
}

//注册用户
exports.registerUser = (name, pwd, email) => {
  return new Promise((resolve, reject) => {
    let password = bcrypt.encryption(pwd);
    let data = {
      name: name, //用户名
      pwd: password, //密码
      email: email, //邮箱
      created_at: new Date().Format("yyyy-MM-dd HH:mm:ss") //创建时间
    };
    new User(data).save((err, val) => {
      //保存数据
      if (err) {
        reject(err);
      } else {
        resolve({ user_res: val });
      }
    });
  });
};

//匹配用户表项目元素个数
exports.countUserNum = (data, type) => {
  return new Promise((resolve, reject) => {
    let wherestr = {};
    wherestr[type] = data;
    User.countDocuments(wherestr, (err, val) => {
      if (err) {
        reject(err);
      } else {
        resolve({ num: val });
      }
    });
  });
};

//登录
exports.login = (email, pwd) => {
  return new Promise((resolve, reject) => {
    if (!email) {
      reject("请传入邮箱");
      return;
    }
    let wherestr = {
      $or: [{ email }, { name: email }]
    };
    User.findOne(wherestr, (err, val) => {
      if (err) {
      } else if (val === null) {
        reject("用户不存在");
      } else if (!comparePwd(pwd, val.pwd)) {
        reject("输入邮箱或密码错误");
      } else {
        val = val.toObject();
        delete val.pwd;
        jwt.setToken(val._id).then(token => {
          resolve({ user_res: val, token });
        });
      }
    });
  });
};

//校验密码是否正确
exports.checkPwd = (pwd, _pwd) => {
  return new Promise((resolve, reject) => {
    if (comparePwd(pwd, _pwd)) {
      resolve({ right: true });
    } else {
      reject("密码不正确");
    }
  });
};

function comparePwd(pwd, _pwd) {
  return bcrypt.decryption(pwd, _pwd);
}

//获取个人信息
exports.queryUserDetail = user_id => {
  return new Promise((resolve, reject) => {
    let wherestr = { _id: user_id };
    User.findOne(wherestr, (err, val) => {
      if (err) {
        reject(err);
      } else if (val === null) {
        reject("用户不存在");
      } else {
        delete val.pwd;
        resolve({ user_res: val });
      }
    });
  });
};

//更新个人信息
exports.updateUserDetail = user_res => {
  return new Promise((resolve, reject) => {
    User.countDocuments({ name: user_res.name, _id: { $ne: user_res._id } }, (err, val) => {
      if (err) {
        reject(err);
      } else {
        if (val > 0) {
          reject("用户名已存在");
          return;
        }
        // 更新数据的条件查询
        let wherestr = { _id: user_res._id };
        // 执行更新数据
        if (user_res.pwd) {
          user_res.pwd = bcrypt.encryption(user_res.pwd);
        }
        let updatestr = user_res;
        User.updateOne(wherestr, updatestr, (err, val) => {
          if (err) {
            reject(err);
          } else {
            resolve({ user_res: val });
          }
        });
      }
    });
  });
};

//搜索用户
exports.searchUser = (user_id, data) => {
  return new Promise((resolve, reject) => {
    let wherestr = {};
    if (data === "chat") {
      wherestr = { _id: { $ne: user_id } };
    } else {
      wherestr = {
        $or: [{ email: { $regex: data } }, { name: { $regex: data } }],
        _id: { $ne: user_id }
      };
    }
    let out = {
      name: 1,
      email: 1,
      avatar: 1
    };
    User.find(wherestr, out, (err, users) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ user_list: users });
    });
  });
};

exports.searchFriend = uid => {
  return new Promise((resolve, reject) => {
    let wherestr = {
      user_id: uid,
      status: 0
    };
    Friend.find(wherestr, (err, val) => {
      if (err) {
        reject(err);
      } else {
        resolve({ friends_list: val });
      }
    });
  });
};

//判断是否是好友
exports.isFriend = (uid, fid) => {
  return new Promise((resolve, reject) => {
    let wherestr = {
      user_id: uid,
      friend_id: fid,
      status: 0
    };
    console.log(wherestr);
    Friend.countDocuments(wherestr, (err, val) => {
      if (err) {
        reject(err);
      } else {
        console.log(val);
        resolve({ is_friend: val > 0 });
      }
    });
  });
};

//搜索群
exports.searchGroup = (user_id, data) => {
  return new Promise((resolve, reject) => {
    let wherestr = {};
    if (data === "chat") {
      wherestr = {};
    } else {
      wherestr = {
        $or: [{ name: { $regex: data } }]
      };
    }
    let out = {
      name: 1,
      avatar: 1
    };
    Group.find(wherestr, out, (err, val) => {
      if (err) {
        reject(err);
      } else {
        resolve({ group_list: val });
      }
    });
  });
};

//判断是否在群内
exports.isInGroup = (uid, gid) => {
  return new Promise((resolve, reject) => {
    let wherestr = {
      user_id: uid,
      group_id: gid
    };
    GroupUser.findOne(wherestr, (err, val) => {
      if (err) {
        reject(err);
      } else {
        resolve({ is_in_group: val });
      }
    });
  });
};

//申请添加好友
exports.applyAddFriend = (uid, fid, message) => {
  return new Promise((resolve, reject) => {
    if (!uid) {
      reject("缺少user_id");
      return;
    }
    if (!fid) {
      reject("缺少friend_id");
      return;
    }
    let wherestr = {
      user_id: uid,
      friend_id: fid
    };
    Friend.countDocuments(wherestr, (err, val) => {
      if (err) {
        reject(err);
      } else {
        if (val) {
          updateUpdatedAt(Friend, {
            $or: [
              { user_id: uid, friend_id: fid },
              { user_id: fid, friend_id: uid }
            ]
          })
            .then(() => {
              resolve("success");
            })
            .catch(err => {
              reject(err);
            });
          return;
        }
        let data = {
          user_id: uid,
          friend_id: fid,
          status: 1,
          created_at: new Date().Format("yyyy-MM-dd HH:mm:ss"),
          updated_at: new Date().Format("yyyy-MM-dd HH:mm:ss")
        };
        new Friend(data).save((err, val) => {
          if (err) {
            reject(err);
          } else {
            let data2 = {
              user_id: fid,
              friend_id: uid,
              message,
              status: 2,
              created_at: new Date().Format("yyyy-MM-dd HH:mm:ss"),
              updated_at: new Date().Format("yyyy-MM-dd HH:mm:ss")
            };
            new Friend(data2).save((err, val2) => {
              //往一对一消息表中插入申请语
              let data3 = {
                send_id: uid,
                receive_id: fid,
                message: message,
                message_type: 0,
                status: 0,
                created_at: new Date().Format("yyyy-MM-dd HH:mm:ss")
              };
              this.insertMsg(data3)
                .then(res => {
                  resolve("success");
                })
                .catch(err => {
                  reject(err);
                });
            });
          }
        });
      }
    });
  });
};

//同意添加好友
exports.agreeAddFriend = (uid, fid) => {
  return new Promise((resolve, reject) => {
    if (!uid) {
      reject("缺少user_id");
      return;
    }
    if (!fid) {
      reject("缺少friend_id");
      return;
    }
    let wherestr = {
      $or: [
        { user_id: uid, friend_id: fid },
        { user_id: fid, friend_id: uid }
      ]
    };
    let updatestr = {
      status: 0,
      updated_at: new Date().Format("yyyy-MM-dd HH:mm:ss")
    };
    Friend.updateMany(wherestr, updatestr, (err, val) => {
      if (err) {
        reject(err);
      } else {
        resolve(val);
      }
    });
  });
};

exports.deleteFriend = (uid, fid) => {
  return new Promise((resolve, reject) => {
    if (!uid) {
      reject("缺少user_id");
      return;
    }
    if (!fid) {
      reject("缺少friend_id");
      return;
    }
    let wherestr = {
      $or: [
        { user_id: uid, friend_id: fid },
        { user_id: fid, friend_id: uid }
      ]
    };
    Friend.deleteMany(wherestr, (err, val) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

//获取好友列表
exports.queryFriendList = (uid, status) => {
  return new Promise((resolve, reject) => {
    let wherestr = {
      user_id: uid,
      status
    };
    Friend.find(wherestr)
      .populate({ path: "friend_id", select: "name avatar" })
      .sort({ updated_at: -1 })
      .then(val => {
        resolve({ friend_list: val });
      });
  });
};

//一对一信息表插入一条信息
exports.insertMsg = ({ send_id, receive_id, message, message_type, status, created_at } = {}) => {
  return new Promise((resolve, reject) => {
    if (!send_id) {
      reject("缺少send_id");
      return;
    }
    if (!receive_id) {
      reject("缺少receive_id");
      return;
    }
    let data = {
      send_id,
      receive_id,
      message,
      message_type,
      status,
      created_at
    };
    new UserMessage(data).save((err, val3) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(val3);
    });
  });
};

//一对一信息表查找最近一条数据
exports.queryNewestUserMessage = (uid, fid) => {
  return new Promise((resolve, reject) => {
    let wherestr = {
      send_id: uid,
      receive_id: fid
    };
    UserMessage.findOne(wherestr, (err, val) => {
      if (err) {
        reject;
      } else {
        resolve(val);
      }
    });
  });
};

//demo
exports.demo = data => {
  return new Promise((resolve, reject) => {
    let wherestr = {};
    //...
    if (err) {
      reject;
    } else {
      resolve(val);
    }
  });
};
