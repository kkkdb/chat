let express = require("express");
let router = express.Router();
let friend = require("../server/friend");

router.post("/isFriend", (req, res) => friend.isFriend(req, res));
router.post("/applyAddFriend", (req, res) => friend.applyAddFriend(req, res));
router.post("/agreeAddFriend", (req, res) => friend.agreeAddFriend(req, res));
router.post("/deleteFriend", (req, res) => friend.deleteFriend(req, res));
router.post("/queryFriendList", (req, res) => friend.queryFriendList(req, res));

module.exports = router;
