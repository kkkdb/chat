export default {
	token: uni.getStorageSync("token") || "",
	user_res: uni.getStorageSync("user_res") || {},
	sex_mapping: {
		male: "男",
		female: "女",
		asexual: "未知"
	}
}
