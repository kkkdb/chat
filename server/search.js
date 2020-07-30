let dbserver = require("../dao/dbserver");
let out = require("../common/out");

exports.querySearchResult = async function (req, res) {
  let { user_id, data } = req.body;
  let user_list = [],
    group_list = [];
  //搜索用户
  let promise1 = new Promise(resolve => {
    dbserver.searchUser(user_id, data).then(uList => {
      dbserver.searchFriend(user_id).then(fList => {
        user_list = uList.user_list.map(function (item) {
          item = item.toObject();
          let is_friend = false;
          fList.friends_list.forEach(elem => {
            if (elem.friend_id._id.equals(item._id)) {
              is_friend = true;
            }
          });
          item.is_friend = is_friend;
          return item;
        });
        resolve(user_list);
      });
    });
  });
  //搜索群
  let promise2 = new Promise(resolve => {
    dbserver.searchGroup(user_id, data).then(gList => {
      //TODO 判断当前用户是否在群里
      resolve(group_list);
    });
  });
  Promise.all([promise1, promise2]).then(result => {
    out({ user_list: result[0], group_list: result[1] }, res);
  });
};
