<template>
	<view class="content user-home">
		<view class="topbar fixed">
			<view class="topbar-left flex-c-c" @click="goback"><image src="../../static/common/back.png" mode="aspectFit" class="back"></image></view>
			<view class="topbar-right flex-c-c"><image src="../../static/common/more.png" class="close" mode="aspectFit"></image></view>
		</view>
		<view class="main-content" @touchmove="move">
			<view class="bg">
				<view class="bg-mask" :class="{ yellow: add_visiable }"></view>
				<image class="bg-image" :src="friend_user_res.avatar" mode="aspectFill"></image>
			</view>
			<view class="user-info">
				<view class="user-avatar">
					<image class="avatar" :class="{ circle: add_visiable }" :src="friend_user_res.avatar" mode="aspectFill"></image>
					<view v-show="!add_visiable && friend_user_res.sex !== 'asexual'" class="sex-content flex-c-c" :class="friend_user_res.sex">
						<image class="icon" v-if="friend_user_res.sex === 'male'" src="../../static/userHome/male.png"></image>
						<image class="icon" v-else src="../../static/userHome/female.png"></image>
					</view>
				</view>
				<view class="user-name">{{ friend_user_res.name }}</view>
				<view class="user-nickname">邮箱：{{ friend_user_res.email }}</view>
				<view class="user-introduce">{{ friend_user_res.introduce }}</view>
				<view class="add-btn cl" @click="showVisisable">加为好友</view>
				<view class="add-modal" :class="{ show: add_visiable }">
					<view class="modal-form">
						<view class="modal-user-name">{{ friend_user_res.name }}</view>
						<textarea :focus="add_visiable" maxlength="120" :value="value" class="message" @blur="bindTextAreaBlur" />
						<view class="btn-content cl">
							<view class="btn cancel-btn" @click="add_visiable = false">取消</view>
							<view class="btn send-btn" @click="addFriend">发送</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
export default {
	data() {
		return {
			friend_user_id: '',
			friend_user_res: {},
			add_visiable: false,
			value: ''
		};
	},
	computed: {
		...mapState(['user_res'])
	},
	onLoad(options) {
		this.friend_user_id = options.user_id;
		this.queryUserDetail();
		this.value = `我是${this.user_res.name},想加你为好友~`;
	},
	methods: {
		...mapMutations(['goback']),
		showVisisable() {
			this.add_visiable = !this.add_visiable;
		},
		bindTextAreaBlur(e) {
			this.value = e.detail.value;
		},
		move() {
			return false;
		},
		async queryUserDetail() {
			let res = await this.$requset({
				url: this.$config.queryUserDetail,
				data: {
					user_id: this.friend_user_id
				}
			});
			this.friend_user_res = res.result.user_res;
		},
		async addFriend() {
			let res = await this.$requset({
				url: this.$config.applyAddFriend,
				data: {
					user_id: this.user_res._id,
					friend_id: this.friend_user_id,
					message: this.value
				}
			});
			if (res.success) {
				uni.showModal({
					title: '温馨提示',
					content: '好友请求发送成功~',
					showCancel: false,
					success: res => {
						this.goback();
					}
				});
			} else {
				uni.showToast({
					icon: 'none',
					title: res.msg
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.user-home {
	padding-top: var(--status-bar-height);
	.bg {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		.bg-mask {
			width: 100%;
			height: 100%;
			&.yellow {
				background-color: rgba(255, 228, 49, 0.6);
			}
		}
		.bg-image {
			position: absolute;
			top: 0;
			left: 0;
			opacity: 0.4;
			width: 100%;
			height: 100%;
			transform: scale(1.1);
			filter: blur(22rpx);
			z-index: -1;
		}
	}
	.user-info {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		z-index: 9;
		padding-top: 148rpx;
		color: $uni-text-color;
		.user-avatar {
			position: relative;
			z-index: 2;
			.avatar {
				border: 6rpx solid #ffffff;
				width: 400rpx;
				height: 400rpx;
				border-radius: $uni-border-radius-lg;
				display: block;
				transition: ease all 300ms;
				&.circle {
					width: 240rpx;
					height: 240rpx;
					border-radius: $uni-border-radius-circle;
					box-shadow: 0rpx 36rpx 40rpx 0rpx rgba(39, 40, 50, 0.1);
				}
			}
			.sex-content {
				position: absolute;
				width: 64rpx;
				height: 64rpx;
				background: $uni-color-error;
				border-radius: $uni-border-radius-circle;
				right: 16rpx;
				bottom: 16rpx;
				&.male {
					background: #5799ff;
				}
				.icon {
					width: 32rpx;
					height: 32rpx;
				}
			}
		}
		.user-name {
			font-size: 52rpx;
			margin-top: 48rpx;
		}
		.user-nickname {
			font-size: 28rpx;
		}
		.user-introduce {
			font-size: 28rpx;
			padding: 20rpx 100rpx 0;
			text-align: justify;
			font-weight: 300;
			line-height: 48rpx;
		}
		.add-btn {
			width: 684rpx;
			height: 80rpx;
			line-height: 80rpx;
			background: $uni-color-primary;
			border-radius: $uni-border-radius-sm;
			text-align: center;
			font-size: 32rpx;
			position: fixed;
			bottom: 50rpx;
		}
	}
	.add-modal {
		width: 100%;
		height: calc(82vh - var(--status-bar-height));
		background-color: $uni-bg-color;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 1;
		border-radius: 40rpx 40rpx 0rpx 0rpx;
		transform: translateY(100%);
		transition: ease all 300ms;
		padding: 160rpx 56rpx 76rpx;
		&.show {
			transform: translateY(0);
		}
		.modal-form {
			position: relative;
			height: 100%;
			.modal-user-name {
				font-size: 52rpx;
				font-weight: 400;
				color: $uni-text-color;
				line-height: 74rpx;
				letter-spacing: -2rpx;
			}
			.message {
				width: 100%;
				height: 320rpx;
				background-color: $uni-bg-color-grey;
				border-radius: $uni-border-radius-base;
				margin-top: 40rpx;
				padding: 18rpx 22rpx;
				font-size: 32rpx;
				font-weight: 400;
				color: $uni-text-color;
			}
			.btn-content {
				margin-top: 60rpx;
				display: flex;
				width: 100%;
				bottom: 0;
				.btn {
					width: 172rpx;
					text-align: center;
					background: rgba(39, 40, 50, 0.1);
					height: 80rpx;
					line-height: 80rpx;
					font-size: 32rpx;
					color: $uni-text-color;
					border-radius: $uni-border-radius-sm;
					font-weight: 400;
					&.send-btn {
						background-color: $uni-color-primary;
						flex: 1;
						margin-left: 32rpx;
					}
				}
			}
		}
	}
}
</style>
