import Vue from "vue"
import config from "../config/config.js"

/**
 * @param {Object} params
 * {
	 url: String
	 method: String
	 data: Object
	 showLoading: Boolean
	 showLoadingTitle: String
	 success: Function
 }
 */
Vue.prototype.$requset = function(params) {
	params.showLoading = params.showLoading == undefined ? true : params.showLoading;
	params.method = params.method == undefined ? "POST" : params.method;
	if (params.showLoading) {
		uni.showLoading({
			title: params.showLoadingTitle ? params.showLoadingTitle : "加载中..."
		});
	}
	return new Promise((resolve, reject) => {
		uni.request({
			url: config.baseUrl + params.url,
			data: params.data || {},
			method: params.method,
			header: {
				'Authorization': "Bearer " + uni.getStorageSync("token")
			},
			success: res => {
				let code = res.data.code
				//token过期
				if (code === 4000001) {
					uni.showModal({
						title: "登录异常",
						content: res.data.msg,
						showCancel: false,
						success: () => {
							uni.redirectTo({
								url: "/pages/login/index"
							});
						}
					});
					return false;
				}
				params.success && params.success(res.data)
				resolve(res.data)
			},
			complete: res => {
				params.showLoading && uni.hideLoading()
			}
		})
	})
}
