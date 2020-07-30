<template>
	<view class="content register-page">
		<view class="topbar">
			<view class="topbar-left flex-c-c" @click="goback"><image src="../../static/common/back.png" mode="aspectFit" class="back"></image></view>
			<view class="topbar-right flex-c-c" @click="goback"><image src="../../static/common/close.png" class="close" mode="aspectFit"></image></view>
		</view>
		<view class="form-content">
			<view class="logo-content" v-cloak><image mode="widthFix" src="../../static/common/fire.png" class="logo"></image></view>
			<view class="title">注册</view>
			<view class="form-item user-name">
				<input :placeholder-style="placeholderStyle" class="input" @blur="checkName" placeholder="请取个名字" auto-focus="true" type="text" />
				<image v-if="user_name && !is_repeated_user" src="../../static/register/check.png" mode="widthFix" class="icon right"></image>
				<text class="red" v-if="user_name && is_repeated_user">已占用</text>
			</view>
			<view class="form-item email">
				<input :placeholder-style="placeholderStyle" class="input" @input="checkEmail" placeholder="请输入登录邮箱" type="text" />
				<text class="red" v-if="is_repeated_email">已占用</text>
				<block v-if="email && !is_repeated_email">
					<image v-if="is_email" src="../../static/register/check.png" mode="widthFix" class="icon right"></image>
					<text v-else class="red">邮箱不正确</text>
				</block>
			</view>
			<view class="form-item password">
				<input :type="type" :placeholder-style="placeholderStyle" class="input" placeholder="请输入登录密码,不少于六位" @input="getPassword" />
				<image @click="change" :src="img_src" mode="widthFix" class="icon eye"></image>
			</view>
			<view class="register-btn" :class="{ ready: is_ok }" @click="registerHandle">注册</view>
		</view>
	</view>
</template>

<script>
import config from '../../config/config.js';
import { debounce } from '../../common/js/common.js';
import { mapMutations } from 'vuex';
export default {
	computed: {
		is_ok() {
			let user_ok = this.user_name && !this.is_repeated_user,
				email_ok = this.email && this.is_email && !this.is_repeated_email,
				pwd_ok = this.password && this.password.length >= 6;
			return user_ok && email_ok && pwd_ok;
		}
	},
	data() {
		return {
			user_name: '',
			email: '',
			password: '',
			is_password: true,
			is_email: false,
			is_repeated_user: false,
			is_repeated_email: false,
			placeholderStyle: 'color: rgba(39,40,50,0.4);font-size: 28rpx',
			type: 'password',
			img_src: '../../static/register/eye-close.png'
		};
	},
	methods: {
		...mapMutations(['goback']),
		change() {
			if (this.is_password) {
				this.type = 'text';
				this.is_password = false;
				this.img_src = '../../static/register/eye-open.png';
			} else {
				this.type = 'password';
				this.is_password = true;
				this.img_src = '../../static/register/eye-close.png';
			}
		},
		checkEmail: debounce(async function(e) {
			let email = e.detail.value;
			let reg = /^([0-9]|[a-z]|\w|-)+@([0-9]|[a-z])+\.([a-z]{2,4})$/i;
			if (email) {
				this.email = email;
				this.is_email = reg.test(email);
				if (this.is_email) {
					let is_repeat = await this.judge({ data: email, type: 'email' });
					this.is_repeated_email = is_repeat;
				}
			}
		}, 500),
		async checkName(e) {
			let user_name = e.detail.value;
			this.user_name = user_name;
			if (user_name) {
				let is_repeat = await this.judge({ data: user_name, type: 'name' });
				this.is_repeated_user = is_repeat;
			}
		},
		getPassword(e) {
			this.password = e.detail.value;
		},
		async judge(params) {
			let res = await this.$requset({
				url: this.$config.judge,
				data: params
			});
			if (res.success) {
				return !!+res.result.num;
			} else {
				uni.showToast({
					icon: 'none',
					title: res.msg
				});
			}
		},
		registerHandle() {
			if (!this.is_ok) return;
			this.$requset({
				url: this.$config.signup,
				data: {
					name: this.user_name, //用户名
					pwd: this.password, //密码
					email: this.email //邮箱
				},
				success: res => {
					if (res.success) {
						uni.showToast({
							title: '注册成功！'
						});
						setTimeout(() => {
							uni.redirectTo({
								url: '../login/index'
							});
						}, 1500);
					}
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.register-page {
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
		.form-item {
			margin-top: 50rpx;
			width: 100%;
			height: 86rpx;
			border-bottom: 2rpx solid rgba(39, 40, 50, 0.08);
			display: flex;
			align-items: center;
			.input {
				height: 50rpx;
				width: 100%;
			}
			.right {
				width: 44rpx;
				height: 34rpx;
			}
			.eye {
				height: 40rpx;
				width: 40rpx;
			}
			.red {
				white-space: nowrap;
				font-size: 28rpx;
				color: $uni-color-error;
			}
		}
		.register-btn {
			width: 520rpx;
			height: 96rpx;
			line-height: 96rpx;
			background: rgba(39, 40, 50, 0.2);
			border-radius: $uni-border-radius-lg;
			text-align: center;
			margin: 118rpx auto 0;
			font-size: 32rpx;
			color: $uni-text-color-inverse;
			&.ready {
				background: $uni-color-primary;
				color: $uni-text-color;
			}
		}
	}
}
</style>
