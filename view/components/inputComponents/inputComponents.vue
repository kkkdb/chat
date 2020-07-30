<template>
	<view class="input-components" :class="{ show: visiable }">
		<view class="topbar border">
			<view class="topbar-left flex-c-c" @click="hide">取消</view>
			<view class="topbar-center">{{ title || '标题' }}</view>
			<view class="topbar-right"><view @click="save" class="btn" :class="{ active: this.has_modify }">确定</view></view>
		</view>
		<view class="input-content">
			<block v-if="_key === 'pwd'">
				<input class="input" type="password" placeholder="请输入旧密码" @blur="getOldPwd" />
				<input class="input" type="password" placeholder="请输入新密码" @blur="getNewPwd" />
			</block>
			<textarea v-else maxlength="120" :value="input_value" class="message" @blur="bindTextAreaBlur" :focus="focus" />
		</view>
	</view>
</template>

<script>
export default {
	props: ['title', '_key', 'value'],
	data() {
		return {
			visiable: false,
			has_modify: false,
			input_value: this.value,
			focus: false,
			old_pwd: '',
			new_pwd: ''
		};
	},
	methods: {
		show() {
			this.$nextTick(() => {
				this.input_value = this.value ? this.value : '';
				this.$nextTick(() => {
					this.visiable = true;
					this.focus = true;
				});
			});
		},
		hide() {
			this.visiable = false;
			this.focus = false;
			this.input_value = '';
		},
		bindTextAreaBlur(e) {
			this.input_value = e.detail.value;
		},
		async save() {
			if (this._key === 'pwd') {
				if (this.old_pwd === this.new_pwd) {
					uni.showToast({
						icon: 'none',
						title: '新密码不能和旧密码一致'
					});
					return;
				}
				let res = await this.$requset({
					url: this.$config.checkPwd,
					data: {
						pwd: this.old_pwd,
						hash_pwd: this.value
					},
					showLoading: false
				});
				if (!res.success) {
					uni.showToast({
						icon: 'none',
						title: '旧密码不正确'
					});
					return;
				}
				this.$emit('setInputValue', this.new_pwd);
			} else {
				this.$emit('setInputValue', this.input_value);
			}
			this.hide();
		},
		getOldPwd(e) {
			this.old_pwd = e.detail.value;
		},
		getNewPwd(e) {
			this.new_pwd = e.detail.value;
		}
	}
};
</script>

<style lang="scss" scoped>
.input-components {
	height: 100%;
	width: 100%;
	position: fixed;
	top: 0;
	left: 0;
	background-color: $uni-bg-color;
	visibility: hidden;
	z-index: -1;
	transition: ease all 150ms;
	transform: translateY(100%);
	&.show {
		visibility: visible;
		z-index: 999;
		transform: translateY(0);
	}
	.input-content {
		padding: $uni-spacing-col-base $uni-spacing-row-base;
		.input {
			width: 100%;
			background: $uni-bg-color-grey;
			padding: 0 20rpx;
			display: block;
			height: 100rpx;
			margin-bottom: $uni-spacing-col-base;
			border-radius: 12rpx;
		}
		.message {
			width: 100%;
			height: 386rpx;
			background: $uni-bg-color-grey;
			border-radius: 20rpx;
			padding: 20rpx;
			color: $uni-text-color;
		}
	}
}
</style>
