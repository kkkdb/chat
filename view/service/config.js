export default {
	signup: "user/signup", //注册
	signin: "user/signin", //登录
	judge: "user/judge", //判断用户名、邮箱是否存在
	checkPwd: "user/checkPwd", //验证原密码是否正确
	queryUserDetail: "user/queryUserDetail", //获取用户信息
	updateUserDetail: "user/updateUserDetail", //更新用户信息
	querySearchResult: "search/querySearchResult", //搜索接口
	applyAddFriend: "friend/applyAddFriend", //发送好友请求
	agreeAddFriend: "friend/agreeAddFriend", //同意好友请求
	deleteFriend: "friend/deleteFriend", //拒绝/删除好友
	isFriend: "friend/isFriend", //是否是好友
	queryFriendList: "friend/queryFriendList" //获取好友列表
}
