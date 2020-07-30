let express = require("express");
let router = express.Router();
let user = require("../server/user");

router.post("/signup", (req, res) => user.signUp(req, res));
router.post("/judge", (req, res) => user.judgeExist(req, res));
router.post("/signin", (req, res) => user.signIn(req, res));
router.post("/checkPwd", (req, res) => user.checkPwd(req, res));
router.post("/queryUserDetail", (req, res) => user.queryUserDetail(req, res));
router.post("/updateUserDetail", (req, res) => user.updateUserDetail(req, res));
router.post("/searchUser", (req, res) => user.searchUser(req, res));
router.post("/isFriend", (req, res) => user.isFriend(req, res));
router.post("/searchGroup", (req, res) => user.searchGroup(req, res));
router.post("/isInGroup", (req, res) => user.isInGroup(req, res));
router.post("/applyAddFriend", (req, res) => user.applyAddFriend(req, res));
router.post("/agreeAddFriend", (req, res) => user.agreeAddFriend(req, res));
router.post("/deleteFriend", (req, res) => user.deleteFriend(req, res));

module.exports = router;
