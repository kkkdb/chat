<template>
	<view class="content user-detail">
		<view class="topbar border">
			<view class="topbar-left flex-c-c" @click="goback"><image src="../../static/common/back.png" mode="aspectFit" class="back"></image></view>
			<view class="topbar-center">用户详情</view>
			<view class="topbar-right" v-if="is_myself"><view @click="save" class="btn" :class="{ active: this.has_modify }">保存</view></view>
		</view>
		<view class="main-content" :class="{ 'hide-arrow': !is_myself }">
			<view class="line-block pd20 right-arrow">
				<view class="left-content">头像</view>
				<view class="right-content">
					<avatar
						selWidth="200px"
						selHeight="200px"
						ref="avatar"
						fileType="png"
						:avatarSrc="user_info.avatar"
						@upload="myUpload"
						quality="1"
						inner="true"
						avatarStyle="width: 54px; height: 54px;border-radius: 10px;"
					></avatar>
					<view @click="chooseImage" class="choose-content"></view>
				</view>
			</view>
			<view class="line-block right-arrow" @click="showInput('修改签名', 'introduce')">
				<view class="left-content">签名</view>
				<view class="right-content">
					<view class="introduce">{{ user_info.introduce }}</view>
				</view>
			</view>
			<view class="line-block right-arrow" @click="showInput('修改昵称', 'name')">
				<view class="left-content">昵称</view>
				<view class="right-content">{{ user_info.name }}</view>
			</view>
			<view class="line-block right-arrow">
				<view class="left-content">性别</view>
				<view class="right-content">
					<picker :disabled="!is_myself" style="width: 100%;" @change="bindPickerChange" range-key="value" :value="index" :range="sex_array">
						<view class="uni-input">{{ sex_value }}</view>
					</picker>
				</view>
			</view>
			<view class="line-block right-arrow">
				<view class="left-content">生日</view>
				<view class="right-content">
					<picker :disabled="!is_myself" style="width: 100%;" mode="date" :value="user_info.birthday" @change="bindDateChange">
						<view class="uni-input">{{ user_info.birthday || '未知' }}</view>
					</picker>
				</view>
			</view>
			<view class="line-block right-arrow" @click="showInput('修改电话', 'mobile')">
				<view class="left-content">电话</view>
				<view class="right-content">{{ user_info.mobile }}</view>
			</view>
			<view class="line-block">
				<view class="left-content">邮箱</view>
				<view class="right-content">{{ user_info.email }}</view>
			</view>
			<view class="line-block right-arrow" @click="showInput('修改密码', 'pwd')" v-if="is_myself">
				<view class="left-content">密码</view>
				<view class="right-content"><text class="active">点击修改密码</text></view>
			</view>
		</view>
		<view class="footer">
			<view class="footer-btn" @click="signout" v-if="is_myself">退出应用</view>
			<view class="footer-btn" @click="deleteFriend" v-else-if="is_friend">删除好友</view>
			<view class="footer-btn success" @click="add_visiable = true" v-else>添加好友</view>
		</view>
		<inputComponents ref="inputComponents" :title="input_title" :_key="input_key" :value="input_value" @setInputValue="setInputValue" />
		<view class="mask" v-show="add_visiable">
			<view class="mask-content center-center">
				<view class="title">添加好友请求</view>
				<view class="textarea-content"><textarea :focus="add_visiable" maxlength="120" :value="apply_message" class="message" @blur="bindTextAreaBlur" /></view>
				<view class="btn-content">
					<view class="btn cancel-btn" @click="add_visiable = false">取消</view>
					<view class="btn send-btn" @click="applyAddFriend">发送</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import avatar from '../../components/yq-avatar/yq-avatar.vue';
import inputComponents from '../../components/inputComponents/inputComponents.vue';
export default {
	data() {
		return {
			user_id: '',
			user_info: {},
			has_modify: false,
			is_friend: false,
			index: 0,
			sex_array: [
				{
					key: 'male',
					value: '男'
				},
				{
					key: 'female',
					value: '女'
				}
			],
			input_title: '',
			input_key: '',
			input_value: '',
			add_visiable: false,
			apply_message: ''
		};
	},
	components: {
		avatar,
		inputComponents
	},
	onLoad(options) {
		if (options.user_id) {
			this.user_id = options.user_id;
			this.getUserInfo();
		} else {
			this.user_info = this.user_res;
		}
		this.apply_message = `我是${this.user_res.name},想加你为好友~`;
	},
	computed: {
		...mapState(['user_res']),
		is_myself() {
			return !this.user_id;
		},
		sex_value() {
			let item = this.sex_array.find(item => item.key === this.user_info.sex);
			let val = (item && item.value) || '未知';
			return val;
		}
	},
	methods: {
		...mapMutations(['goback', 'setState']),
		async getUserInfo() {
			let res = await this.$requset({
				url: this.$config.queryUserDetail,
				data: {
					user_id: this.user_id
				}
			});
			if (!res.success) {
				uni.showToast({
					icon: 'none',
					title: '用户不存在'
				});
				return;
			}
			this.user_info = res.result.user_res;
			let res2 = await this.$requset({
				url: this.$config.isFriend,
				data: {
					user_id: this.user_res._id,
					friend_id: this.user_id
				}
			});
			this.is_friend = res2.result.is_friend;
		},
		signout() {
			uni.clearStorage();
			uni.redirectTo({
				url: '../login/index'
			});
		},
		chooseImage() {
			if (!this.is_myself) return;
			let avatar = this.$refs.avatar;
			avatar.fChooseImg(1, { selWidth: '480upx', selHeight: '480upx', expWidth: '480px', expHeight: '480upx', inner: false }, { data: 'xxx' });
		},
		myUpload(rsp) {
			console.log(rsp);
			this.user_info.avatar = rsp.path;
			return;

			uni.uploadFile({
				url: 'xxxx',
				filePath: rsp.path,
				name: 'avatar',
				formData: {
					avatar: rsp.path
				},
				success: uploadFileRes => {
					console.log(uploadFileRes.data);
				},
				complete(res) {
					console.log(res);
				}
			});
		},
		bindPickerChange(e) {
			this.index = e.target.value;
			this.user_info.sex = this.sex_array[this.index].key;
		},
		bindDateChange(e) {
			this.$set(this.user_info, 'birthday', e.target.value);
		},
		showInput(title, key) {
			if (!this.is_myself) return;
			let inputComponents = this.$refs.inputComponents;
			this.input_title = title;
			this.input_key = key;
			this.input_value = this.user_info[key] || '';
			inputComponents.show();
		},
		setInputValue(value) {
			this.$set(this.user_info, this.input_key, value);
		},
		async save() {
			if (!this.has_modify) return;
			let res = await this.$requset({
				url: this.$config.updateUserDetail,
				data: {
					user_res: this.user_info
				}
			});
			if (res.success) {
				this.setState({ key: 'user_res', value: this.user_info });
				uni.showToast({
					title: '保存成功'
				});
				this.has_modify = false;
			} else {
				uni.showToast({
					icon: 'none',
					title: res.msg
				});
			}
		},
		bindTextAreaBlur(e) {
			this.apply_message = e.detail.value;
		},
		deleteFriend() {},
		async applyAddFriend() {
			let res = await this.$requset({
				url: this.$config.applyAddFriend,
				data: {
					user_id: this.user_res._id,
					friend_id: this.user_id,
					message: this.apply_message
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
	},
	watch: {
		user_info: {
			handler(newVal, oldVal) {
				if (newVal && Object.keys(oldVal).length !== 0) {
					this.has_modify = true;
				}
			},
			deep: true
		}
	}
};
</script>

<style lang="scss" scoped>
.topbar-right {
	.btn {
		color: $uni-text-color-disable;
		border-radius: 8rpx;
		&.active {
			color: $uni-text-color-info;
		}
	}
}
.main-content {
	padding-top: 42rpx;
	.line-block {
		position: relative;
		display: flex;
		align-items: center;
		padding: $uni-spacing-col-lg 0;
		font-size: 32rpx;
		.left-content {
			padding: 0 $uni-spacing-row-base;
			color: $uni-text-color;
			min-width: 128rpx;
		}
		.right-content {
			color: rgba(39, 40, 50, 0.6);
			flex: 1;
			font-weight: 400;
			display: flex;
			.choose-content {
				flex: 1;
				height: 108rpx;
				width: 100%;
			}
			.introduce {
				width: 80%;
				height: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.active {
				color: $uni-text-color-info;
			}
		}
		&.pd20 {
			padding: 20rpx 0;
		}
	}
	&.hide-arrow .right-arrow::after {
		content: '';
		border: none;
	}
}
.footer {
	text-align: center;
	.footer-btn {
		height: 80rpx;
		line-height: 80rpx;
		font-size: 32rpx;
		color: $uni-color-error;
		&.success {
			color: $uni-color-success;
		}
	}
}
.mask {
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	position: fixed;
	top: 0;
	left: 0;
	text-align: center;
	.mask-content {
		background-color: $uni-bg-color;
		border-radius: 8rpx;
		width: 600rpx;
		.title {
			padding: 1em 1.6em 0.3em;
			font-weight: 400;
			font-size: 36rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}
		.textarea-content {
			padding: 20rpx 30rpx 40rpx;
			.message {
				width: 100%;
				height: 240rpx;
				background-color: $uni-bg-color-grey;
				border-radius: $uni-border-radius-base;
				padding: 18rpx 22rpx;
				font-size: 32rpx;
				font-weight: 400;
				color: $uni-text-color;
				text-align: left;
			}
		}
		.btn-content {
			position: relative;
			line-height: 96rpx;
			font-size: 36rpx;
			display: flex;
			.btn {
				flex: 1;
				color: $uni-text-color;
				border-top: 2rpx solid $uni-border-color;
				&.send-btn {
					border-left: 2rpx solid $uni-border-color;
					color: $uni-text-color-info;
				}
			}
		}
	}
}
</style>
