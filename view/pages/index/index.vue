<template>
	<view class="content home-pages">
		<view class="main-content">
			<view class="topbar fixed border">
				<view class="topbar-left" @click="goToUserDetail"><image class="avatar" :src="user_res.avatar" mode="aspectFill"></image></view>
				<view class="topbar-center"><image class="logo" src="../../static/common/fire.png" mode="widthFix"></image></view>
				<view class="topbar-right">
					<image @click="goToSearch" src="../../static/index/search.png" class="icon" mode="aspectFill"></image>
					<image src="../../static/index/add.png" class="icon" mode="aspectFill"></image>
				</view>
			</view>
			<view class="user-list">
				<navigator url="../friendApply/index" class="user-item apply">
					<div class="user-avatar">
						<image class="avatar" src="../../static/index/apply.png" mode="aspectFill"></image>
						<text v-if="apply_list.length" class="message-num badge">{{ apply_list.length }}</text>
					</div>
					<div class="user-item-content">
						<div class="line1">
							<span class="user-name">好友请求</span>
							<span class="time">{{ apply_item.time }}</span>
						</div>
						<div class="line2">
							<span class="user-message">{{ apply_item.name }}</span>
						</div>
					</div>
				</navigator>
				<view class="user-item" v-for="item in user_list" :key="item._id" @click="goToChat(item)">
					<div class="user-avatar">
						<text v-if="item.message_num" class="message-num badge">{{ item.message_num }}</text>
						<image class="avatar" :src="item.friend_id.avatar" mode="aspectFill"></image>
					</div>
					<div class="user-item-content">
						<div class="line1">
							<span class="user-name">{{ item.friend_id.name }}</span>
							<span class="time">{{ item.time }}</span>
						</div>
						<div class="line2">
							<span class="user-message">{{ item.message }}</span>
						</div>
					</div>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import datas from '../../common/js/datas.js';
import dateTime from '../../common/js/dateTime.js';
import { mapState } from 'vuex';
export default {
	data() {
		return {
			user_list: [],
			apply_list: [],
			apply_item: {} //最近一个申请信息
		};
	},
	mounted() {
		this.getFriendsList();
		this.getApplyList();
	},
	computed: {
		...mapState(['user_res'])
	},
	methods: {
		async getApplyList() {
			let res = await this.$requset({
				url: this.$config.queryFriendList,
				data: {
					user_id: this.user_res._id,
					status: 2
				}
			});
			let apply_list = res.result.friend_list;

			let apply_item = {
				time: dateTime(apply_list[0].updated_at),
				name: apply_list[0].friend_id.name + '发来了好友申请'
			};

			this.apply_list = apply_list;
			this.apply_item = apply_item;
		},
		async getFriendsList() {
			// this.user_list = datas.friends().map(item => {
			// 	item.time = dateTime(item.time);
			// 	return item;
			// });
			// return
			let res = await this.$requset({
				url: this.$config.queryFriendList,
				data: {
					user_id: this.user_res._id,
					status: 0
				}
			});
			let list = res.result.friend_list;
			list.forEach(item => {
				item.time = dateTime(item.updated_at);
			});
			this.user_list = list;
		},
		goToSearch() {
			uni.navigateTo({
				url: '../search/index'
			});
		},
		goToChat(item) {
			uni.navigateTo({
				url: '../chat/index?user_id=' + item.id
			});
		},
		goToUserDetail() {
			uni.navigateTo({
				url: '../userDetail/index'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.home-pages {
	padding-top: var(--status-bar-height);
	padding-bottom: $uni-spacing-col-base;
	.main-content {
		padding-top: 88rpx;
	}
	.topbar {
		background-color: rgba(255, 255, 255, 0.96);
	}
	.user-list {
		.user-item {
			display: flex;
			align-items: center;
			padding: 20rpx $uni-spacing-row-base;
			&:active {
				background-color: $uni-bg-color-grey;
			}
			.user-avatar {
				width: 96rpx;
				height: 96rpx;
				border-radius: $uni-border-radius-base;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-right: $uni-spacing-row-base;
				position: relative;
				.avatar {
					width: 96rpx;
					height: 96rpx;
					border-radius: $uni-border-radius-base;
				}
			}
			.user-item-content {
				flex: 1;
				width: 1px;
				.line1 {
					font-size: $uni-font-size-lg;
					color: $uni-text-color;
					display: flex;
					justify-content: space-between;
					.time {
						font-size: $uni-font-size-sm;
						color: rgba(39, 40, 50, 0.4);
					}
				}
				.line2 {
					font-size: $uni-font-size-base;
					color: rgba(39, 40, 50, 0.6);
					.user-message {
						display: block;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
			}
			&.apply {
				.user-avatar {
					background: $uni-color-primary;
					.avatar {
						width: 56rpx;
						height: 52rpx;
						border-radius: 0;
					}
				}
			}
		}
	}
}
</style>
