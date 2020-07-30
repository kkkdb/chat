<template>
	<view class="content search-pages">
		<view class="main-content">
			<view class="topbar fixed border">
				<view class="input-content">
					<input @input="inputHandle" placeholder="搜索用户/群" class="input" type="text" />
					<image class="search-icon" src="../../static/search/search.png"></image>
				</view>
				<view class="cancel" @click="goback">取消</view>
			</view>
			<view class="search-content">
				<view class="search-item" :key="item.title" v-for="item in show_list">
					<view class="search-item-title">{{ item.title }}</view>
					<view class="search-item-list">
						<view v-for="elem in item.list" :key="elem.id" class="item-item">
							<navigator :url="'../userDetail/index?user_id=' + elem._id"><image :src="elem.avatar" class="avatar"></image></navigator>
							<view class="user-info">
								<text class="name" v-html="elem.name"></text>
								<text class="email" v-html="elem.email"></text>
							</view>
							<view class="btn base" v-if="elem.is_friend">发消息</view>
							<view class="btn" @click="addFriends(elem)" v-else>{{ '加' + (item.title === '用户' ? '好友' : '群') }}</view>
						</view>
					</view>
				</view>
				<text class="empty" v-if="is_empty">无匹配内容 {{ value }}</text>
			</view>
		</view>
	</view>
</template>

<script>
import datas from '../../common/js/datas.js';
import { debounce } from '../../common/js/common.js';
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			value: '',
			show_list: [],
			is_empty: false
		};
	},
	computed: {
		...mapState(['user_res'])
	},
	methods: {
		...mapMutations(['goback']),
		inputHandle: debounce(async function(e) {
			let value = e.detail.value,
				show_list = [];
			this.value = value;
			if (value) {
				let res = await this.$requset({
					url: this.$config.querySearchResult,
					data: {
						user_id: this.user_res._id,
						data: value
					}
				});
				let friends_list = this.getFilterList(res.result.user_list);
				let groups_list = this.getFilterList(res.result.group_list);
				show_list = [
					{
						title: '用户',
						list: friends_list
					},
					{
						title: '群组',
						list: groups_list
					}
				];
				show_list = show_list.filter(item => {
					return item.list.length !== 0;
				});
				this.$nextTick(() => {
					if (show_list.length === 0) {
						this.is_empty = true;
					}
				});
				this.show_list = show_list;
			} else {
				this.is_empty = false;
			}
		}),
		//获取过滤之后的用户列表
		getFilterList(list) {
			let friend_mapping = this.getFriendsMapping();
			let _list = list.filter(item => {
				return item.name.includes(this.value) || item.email.includes(this.value);
			});
			if (_list.length) {
				_list.forEach(item => {
					item.name = this.replaceKeywords(item.name, this.value);
					item.email = item.email && this.replaceKeywords(item.email, this.value);
				});
			}
			return _list;
		},
		getFriendsMapping() {
			let is_friend_list = datas.is_friend();
			let friend_mapping = {};
			is_friend_list.forEach(item => {
				if (friend_mapping[item.user_id]) {
					friend_mapping[item.user_id].push(item.friend_id);
				} else {
					friend_mapping[item.user_id] = [item.friend_id];
				}
			});
			return friend_mapping;
		},
		replaceKeywords(str, key) {
			let reg = new RegExp(key);
			str = str.replace(reg, "<span class='text-note'>" + key + '</span>');
			return str;
		},
		addFriends(item) {
			if (item.is_friend) {
			} else {
				uni.navigateTo({
					url: '../userHome/index?user_id=' + item._id
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.search-pages {
	padding-top: var(--status-bar-height);
	padding-bottom: $uni-spacing-col-base;
	.main-content {
		padding-top: 88rpx;
	}
	.topbar {
		background-color: $uni-bg-color;
		.input-content {
			flex: 1;
			height: 60rpx;
			border-radius: $uni-border-radius-sm;
			background-color: $uni-bg-color-grey;
			display: flex;
			align-items: center;
			padding: 0 12rpx;
			margin-left: $uni-spacing-row-base;
			.input {
				flex: 1;
				color: $uni-text-color;
				font-size: 28rpx;
			}
			.search-icon {
				width: 40rpx;
				height: 40rpx;
				font-size: 40rpx;
				margin-left: 16rpx;
			}
		}
		.cancel {
			padding: 0 $uni-spacing-row-base;
			font-size: $uni-font-size-base;
		}
	}
	.search-content {
		padding: 34rpx 32rpx;
		.search-item {
			margin-bottom: 60rpx;
			.search-item-title {
				color: $uni-text-color;
				font-size: 44rpx;
				margin-bottom: 20rpx;
			}
			.search-item-list {
				.item-item {
					height: 80rpx;
					display: flex;
					align-items: center;
					margin-bottom: 40rpx;
					font-size: $uni-font-size-lg;
					.avatar {
						border-radius: 20rpx;
						height: 80rpx;
						width: 80rpx;
						margin-right: $uni-spacing-row-base;
					}
					.user-info {
						flex: 1;
						color: $uni-text-color;
						.name {
							font-size: $uni-font-size-lg;
							display: block;
						}
						.email {
							font-size: $uni-font-size-sm;
							display: block;
						}
					}
					.btn {
						width: 120rpx;
						height: 48rpx;
						line-height: 48rpx;
						text-align: center;
						background: rgba(74, 170, 255, 0.1);
						border-radius: 24rpx;
						font-size: $uni-font-size-sm;
						color: #4aaaff;
						&.base {
							background-color: $uni-color-primary;
							color: $uni-text-color;
						}
					}
				}
			}
		}
		.empty {
			font-size: $uni-font-size-base;
			color: $uni-text-color-grey;
			text-align: center;
			display: block;
		}
	}
}
</style>
