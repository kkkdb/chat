<script>
export default {
	globalData: {
		user_id: '1'
	},
	onLaunch: function() {
		console.log('App Launch');
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style lang="scss">
/*每个页面公共css */
@import url('./css/common.scss');
.topbar {
	height: 88rpx;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	z-index: 999;
	padding-top: var(--status-bar-height);
	box-sizing: content-box;
	background-color: $uni-bg-color;
	&.fixed {
		position: fixed;
		top: 0;
		left: 0;
	}
	&.border {
		box-shadow: 0rpx 2rpx 0rpx 0rpx rgba(0, 0, 0, 0.1);
	}
	.topbar-left {
		display: flex;
		align-items: center;
		padding: 0 $uni-spacing-row-base;
		height: 100%;
		.avatar {
			width: 68rpx;
			height: 68rpx;
			border-radius: 16rpx;
		}
		.back {
			width: 48rpx;
			height: 48rpx;
			display: block;
		}
	}
	.topbar-center {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		text-align: center;
		.logo {
			width: 88rpx;
			max-height: 88rpx;
		}
	}
	.topbar-right {
		height: 100%;
		display: flex;
		align-items: center;
		padding: 0 $uni-spacing-row-base;
		font-size: $uni-font-size-lg;
		.icon {
			width: 52rpx;
			height: 52rpx;
			margin-left: 40rpx;
			&:first-child {
				margin-left: 0;
			}
		}
		.close {
			width: 42rpx;
			height: 42rpx;
			display: block;
		}
	}
}
.footer{
	position: fixed;
	bottom: 76rpx;
	left: 0;
	width: 100%;
}
</style>
