<template>
	<view class="content friend-apply">
		<view class="topbar border fixed">
			<view class="topbar-left flex-c-c" @click="goback"><image src="../../static/common/back.png" mode="aspectFit" class="back"></image></view>
			<view class="topbar-center">好友请求</view>
		</view>
		<view class="main-content">
			<view class="apply-list">
				<block v-for="item in apply_list" :key="item._id">
					<view class="apply-item">
						<image class="avatar cl" :src="item.friend_id.avatar" mode="aspectFill"></image>
						<view class="item-topper">
							<view class="btn cancel" @click="btnHandle(item, 0)">拒绝</view>
							<view class="btn" @click="btnHandle(item, 1)">同意</view>
						</view>
						<view class="user-info">
							<view class="user-name">{{ item.friend_id.name }}</view>
							<view class="time">{{ item.updated_at }}</view>
						</view>
						<view class="message">留言：你好，想请求加为好友。谢谢你的通过。 和好的。</view>
					</view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			apply_list: []
		};
	},
	computed: {
		...mapState(['user_res'])
	},
	mounted() {
		this.getApplyList();
	},
	methods: {
		...mapMutations(['goback']),
		async getApplyList() {
			let res = await this.$requset({
				url: this.$config.queryFriendList,
				data: {
					user_id: this.user_res._id,
					status: 2
				}
			});
			this.apply_list = res.result.friend_list;
		},
		async btnHandle(item, is_agree) {
			let res = await this.$requset({
				url: is_agree ? this.$config.agreeAddFriend : this.$config.deleteFriend,
				data: {
					user_id: this.user_res._id,
					friend_id: item.friend_id._id
				}
			});
			if (res.success) {
				uni.showToast({
					title: '操作成功~'
				});
				setTimeout(this.getApplyList, 1500);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.friend-apply {
	padding-top: var(--status-bar-height);
	padding-bottom: $uni-spacing-col-base;
	.main-content {
		padding-top: 88rpx;
		.apply-list {
			padding: 0 $uni-spacing-row-base;
			padding-top: 20rpx;
			.apply-item {
				width: 100%;
				background: $uni-bg-color;
				border-radius: $uni-border-radius-base;
				box-shadow: 0rpx 24rpx 64rpx -8rpx rgba(0, 0, 0, 0.1);
				margin-top: 112rpx;
				padding: 30rpx $uni-spacing-row-base;
				.avatar {
					width: 144rpx;
					height: 144rpx;
					display: block;
					border-radius: $uni-border-radius-circle;
					transform: translateX(-50%) translateY(-50%);
					background-color: $uni-bg-color-grey;
				}
				.item-topper {
					display: flex;
					justify-content: space-between;
					.btn {
						width: 160rpx;
						height: 64rpx;
						line-height: 64rpx;
						background: $uni-color-primary;
						border-radius: 40rpx;
						color: $uni-text-color;
						text-align: center;
						font-size: 32rpx;
						&.cancel {
							background: rgba(255, 93, 91, 0.1);
							color: #ff5d5b;
						}
					}
				}
				.user-info {
					text-align: center;
					padding-top: 18rpx;
					.user-name {
						color: $uni-text-color;
						font-size: $uni-font-size-lg;
						font-weight: 500;
						line-height: 50rpx;
						letter-spacing: -1rpx;
					}
					.time {
						font-size: $uni-font-size-sm;
						color: rgba(39, 40, 50, 0.4);
					}
				}
				.message {
					margin-top: 40rpx;
					width: 100%;
					height: 120rpx;
					background: $uni-bg-color-grey;
					border-radius: $uni-border-radius-base;
					padding: 20rpx 32rpx 20rpx 22rpx;
					text-align: justify;
					font-size: $uni-font-size-base;
					color: $uni-text-color;
					letter-spacing: -1rpx;
				}
			}
		}
	}
}
</style>
