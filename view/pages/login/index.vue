<template>
	<view class="content login-pages">
		<view class="topbar">
			<view class="topbar-left"></view>
			<view class="topbar-right" @click="goToRegister">注册</view>
		</view>
		<view class="form-content">
			<view class="logo-content" v-cloak><image mode="widthFix" src="../../static/common/fire.png" class="logo"></image></view>
			<view class="title">登录</view>
			<view class="sub-title">您好，欢迎来到chat！</view>
			<view class="user-name"><input @blur="getUser" :placeholder-style="placeholderStyle" placeholder="用户名/邮箱" auto-focus="true" type="text" /></view>
			<view class="password"><input @blur="getPassword" :placeholder-style="placeholderStyle" placeholder="密码长度不小于6位" type="password" /></view>
			<text class="tips" v-if="err_msg">{{ err_msg }}</text>
			<view class="login-btn" @click="login">登录</view>
		</view>
	</view>
</template>

<script>
import { mapMutations } from 'vuex';
import config from '../../config/config.js';
export default {
	data() {
		return {
			email: '',
			password: '',
			placeholderStyle: 'color: rgba(39,40,50,0.4);font-size: 28rpx',
			err_msg: ''
		};
	},
	methods: {
		...mapMutations(['setState']),
		getUser(e) {
			this.email = e.detail.value;
		},
		getPassword(e) {
			this.password = e.detail.value;
		},
		async login() {
			this.err_msg = '';
			if (!this.email) {
				return uni.showToast({
					icon: 'none',
					title: '请输入邮箱'
				});
			}
			if (!this.password) {
				return uni.showToast({
					icon: 'none',
					title: '请输入密码'
				});
			}
			let res = await this.$requset({
				url: this.$config.signin,
				data: {
					email: this.email,
					pwd: this.password
				}
			});
			if (!res.success) {
				this.err_msg = res.msg;
				return;
			}
			this.setState({ key: 'user_res', value: res.result.user_res });
			this.setState({ key: 'token', value: res.result.token });
			uni.redirectTo({
				url: '../index/index'
			});
		},
		goToRegister() {
			uni.navigateTo({
				url: '../register/index'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.login-pages {
	.form-content {
		padding: 0 56rpx;
		color: $uni-text-color;
		.logo-content {
			margin-top: 80rpx;
			text-align: center;
			.logo {
				width: 194rpx;
				height: 88rpx;
			}
		}
		.title {
			font-size: 56rpx;
			margin: 54rpx 0 14rpx 0;
		}
		.sub-title {
			font-size: 40rpx;
			color: rgba(39, 40, 50, 0.5);
		}
		.user-name,
		.password {
			margin-top: 50rpx;
			width: 100%;
			height: 86rpx;
			border-bottom: 2rpx solid rgba(39, 40, 50, 0.08);
			display: flex;
			align-items: center;
			input {
				height: 50rpx;
				width: 100%;
				color: $uni-text-color;
			}
		}
		.tips {
			font-size: $uni-font-size-base;
			color: $uni-color-error;
			float: left;
			line-height: 56rpx;
		}
		.login-btn {
			width: 520rpx;
			height: 96rpx;
			line-height: 96rpx;
			background: $uni-color-primary;
			border-radius: $uni-border-radius-lg;
			box-shadow: 0rpx 50rpx 32rpx -36rpx rgba(255, 228, 49, 0.4);
			text-align: center;
			margin: 118rpx auto 0;
			font-size: 32rpx;
		}
	}
}
</style>
