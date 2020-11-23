<template>
	<view class="wrap">
		<u-toast ref="uToast" />
		<view class="top"></view>
		<view class="content">
			<view class="title">欢迎登录书源</view>
			<view v-if="isPhoneLogin">
				<input class="u-border-bottom" type="number" v-model="tel" placeholder="请输入手机号" />
				<view class="tips">未注册的手机号验证后自动创建书源账号</view>
				<button @tap="submit" :style="[inputStyle]" class="getCaptcha">获取短信验证码</button>
			</view>
			<view v-else>
				<input class="u-border-bottom" type="number" v-model="tel" placeholder="请输入手机号" />
				<input class="u-border-bottom pwd" type="password" v-model="pwd" placeholder="请输入密码" />
				<button @tap="login" :style="[inputStyle]" class="getCaptcha">登录</button>
			</view>
			<view class="alternative">
				<view class="password" @click="isPhoneLogin = !isPhoneLogin">切换登录方式</view>
				<view class="issue">忘记密码</view>
			</view>
		</view>
		<view class="buttom">
			<view class="hint">
				登录代表同意
				<text class="link">书源网用户协议、隐私政策，</text>
				并授权使用您的书源账号信息（如昵称、头像等）以便您统一管理
			</view>
		</view>
	</view>
</template>

<script>
import md5Libs from "uview-ui/libs/function/md5";
export default {
	data() {
		return {
			tel: '',
			pwd: '',
			isPhoneLogin: true
		}
	},
	computed: {
		inputStyle() {
			let style = {};
			if(this.isPhoneLogin) {
				if(this.tel) {
					style.color = "#fff";
					style.backgroundColor = this.$u.color['primary'];
				}
			} else {
				if(this.tel && this.pwd) {
					style.color = "#fff";
					style.backgroundColor = this.$u.color['primary'];
				}
			}
			return style;
		}
	},
	methods: {
		submit() {
			if(this.$u.test.mobile(this.tel)) {
				this.$u.post('/user/getsms',{phone: this.tel}).then(res => {
					if(res) {
						this.$u.route('pages/login/code',{phone: this.tel})
					}
				})
			}
		},
		login() {
			const loginObj = {
				phone: this.tel,
				password: md5Libs.md5(this.pwd)
			}
			
			this.$u.post('/user/login', loginObj).then(res => {
				if(res) {
					uni.setStorageSync('token', res.obj.token)
					uni.setStorageSync('image', res.obj.image);
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
	}
};
</script>

<style lang="scss" scoped>
.wrap {
	font-size: 28rpx;
	.content {
		width: 600rpx;
		margin: 80rpx auto 0;

		.title {
			text-align: left;
			font-size: 60rpx;
			font-weight: 500;
			margin-bottom: 100rpx;
		}
		input {
			text-align: left;
			margin-bottom: 10rpx;
			padding-bottom: 6rpx;
		}
		.tips {
			color: $u-type-info;
			margin-bottom: 60rpx;
			margin-top: 8rpx;
		}
		.pwd {
			margin-top: 15px;
			margin-bottom: 14px;
		}
		.getCaptcha {
			background-color: rgb(174, 208, 253);
			color: $u-tips-color;
			border: none;
			font-size: 30rpx;
			padding: 12rpx 0;
			
			&::after {
				border: none;
			}
		}
		.alternative {
			color: $u-tips-color;
			display: flex;
			justify-content: space-between;
			margin-top: 30rpx;
		}
	}
	.buttom {
		.loginType {
			display: flex;
			padding: 350rpx 150rpx 150rpx 150rpx;
			justify-content:space-between;
			
			.item {
				display: flex;
				flex-direction: column;
				align-items: center;
				color: $u-content-color;
				font-size: 28rpx;
			}
		}
		
		.hint {
			padding: 20rpx 40rpx;
			font-size: 20rpx;
			color: $u-tips-color;
			
			.link {
				color: $u-type-primary;
			}
		}
	}
}
</style>
