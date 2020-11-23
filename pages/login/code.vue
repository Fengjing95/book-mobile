<template>
	<view class="wrap">
		<u-toast ref="uToast" />
		<view class="key-input">
			<view class="title">输入验证码</view>
			<view class="tips">验证码已发送至 {{phone}}</view>
			<u-message-input :focus="true" :value="value" @change="change" @finish="finish" mode="bottomLine" :maxlength="maxlength"></u-message-input>
			<text :class="{ error: error }">验证码错误，请重新输入</text>
			<view class="captcha">
				<text :class="{ noCaptcha: show }" @tap="noCaptcha">收不到验证码点这里</text>
				<text :class="{ regain: !show }">{{ second }}秒后重新获取验证码</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			maxlength: 6,
			value: '',
			second: 60,
			show: false,
			error: false,
			phone: '',
			phoneNumber: '',
		};
	},
	computed: {},
	onLoad(options) {
		this.phoneNumber = options.phone
		this.phone = options.phone.replace(/(\d{3})\d{4}(\d{4})/,'$1****$2')
		// this.getCaptcha()
		let interval = setInterval(() => {
			this.second--;
			if (this.second <= 0) {
				this.show = true;
				if (this.value.lenth != 6) {
					this.error = true;
				}
				clearInterval(interval);
			}
		}, 1000);
	},
	methods: {
		// 收不到验证码选择时的选择
		noCaptcha() {
			const _this = this;
			uni.showActionSheet({
				itemList: ['重新获取验证码'],
				success: function(res) {
					_this.$u.post('/user/getsms',{phone: _this.phoneNumber}).then(res => {
						if(res) {
						_this.second = 60
						_this.error = false
						_this.show = false
							let interval = setInterval(() => {
								_this.second--;
								if (_this.second <= 0) {
									if (_this.value.lenth != 6) {
										_this.error = true;
									}
									clearInterval(interval);
								}
							}, 1000);
						}
					})
				},
				fail: function(res) {
					
				}
			});
		},
		// change事件侦听
		change(value) {
			// console.log('change', value);
			// this.code = value
		},
		// 输入完验证码最后一位执行
		finish(value) {
			const phoneLogin = {
				phone: this.phoneNumber,
				code: value
			}
			console.log(phoneLogin);
			this.$u.post('/user/plogin', phoneLogin).then(res => {
				if(res) {
					uni.setStorageSync('token', res.obj.token)
					uni.setStorageSync('image', res.obj.image)
					this.$store.commit('freshToken')
					this.$refs.uToast.show({
						title: '登录成功',
						type: 'success',
						url: '/pages/mine/mine',
						isTab: true,
						duration: 1000
					})
				}
			})
		}
	},
};
</script>

<style lang="scss" scoped>
.wrap {
	padding: 80rpx;
}

.box {
	margin: 30rpx 0;
	font-size: 30rpx;
	color: 555;
}

.key-input {
	padding: 30rpx 0;
	text {
		display: none;
	}
	.error {
		display: block;
		color: red;
		font-size: 30rpx;
		margin: 20rpx 0;
	}
}

.title {
	font-size: 50rpx;
	color: #333;
}

.key-input .tips {
	font-size: 30rpx;
	color: #333;
	margin-top: 20rpx;
	margin-bottom: 60rpx;
}
.captcha {
	color: $u-type-warning;
	font-size: 30rpx;
	margin-top: 40rpx;
	.noCaptcha {
		display: block;
	}
	.regain {
		display: block;
	}
}
</style>
