<template>
	<view class="mine">
		<view class="is-login" v-if="isLogin">
			<my-center />
		</view>
		<view class="not-login" v-else>
			<u-button type="primary" @click="login_register">登录/注册</u-button>
		</view>
	</view>
</template>

<script>
	import MyCenter from '../../components/MyCenter.vue'
	export default {
		components: {
			MyCenter
		},
		data() {
			return {
				
			}
		},
		computed: {
			isLogin() {
				return this.$store.getters.getToken
			}
		},
		methods: {
			login_register() {
				uni.redirectTo({
					url: '/pages/login/login'
				})
			}
		},
		onShow() {
			this.$store.commit('freshToken')
		},
		onNavigationBarButtonTap() {
			this.$u.route('/pages/attendance/attendance')
		}
	}
</script>

<style lang="less">
.mine {
	.not-login {
		margin-top: 200px;
		padding: 0 20px;
	}
}
</style>
