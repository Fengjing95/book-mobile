<template>
	<view>
		<u-toast ref="uToast" />
		<u-modal v-model="outShow" content="确认退出？" :show-title="false" show-cancel-button @confirm="confirmLogout"
		 cancel-color="black" confirm-color="#409eff"></u-modal>
		<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30" style="padding-top: 10px;">
			<view class="u-m-r-10">
				<u-avatar :src="userAvatar" size="140" @tap="chooseAvatar"></u-avatar>
			</view>
			<view class="u-flex-1" style="margin-left: 20px;">
				<view class="u-font-18 u-p-b-20">{{user.userName}}</view>
				<view class="u-font-14 u-tips-color">账号: {{user.userPhone}}</view>
			</view>
		</view>

		<view class="u-m-t-20">
			<!-- #ifdef MP-WEIXIN -->
			 <u-cell-group>
				<u-cell-item icon="edit-pen" title="每日签到" @click="attendance"></u-cell-item>
			 </u-cell-group>
			<!-- #endif -->
			<u-cell-group>
				<u-cell-item icon="rmb-circle" :title="`源币:${user.userCoin}`"></u-cell-item>
			</u-cell-group>
		</view>

		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="star" title="收藏" @click="gotoCollection"></u-cell-item>
				<u-cell-item icon="eye" title="阅读历史" @click="gotoHistory"></u-cell-item>
				<u-cell-item icon="chat" title="消息" @click="goToMsg">
					<u-badge type="error" :count="msgNum"></u-badge>
				</u-cell-item>
			</u-cell-group>
		</view>

		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="setting" title="设置" @click="setting"></u-cell-item>
				<u-cell-item icon="info-circle-fill" title="退出登录" style="color: red;" @tap="logout"></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: true,
				outShow: false,
				user: {
					image: uni.getStorageSync('image')
				}
			}
		},
		computed:{
			userAvatar() {
				return this.$photoHeader + this.user.image
			},
			msgNum() {
				return this.$store.getters.getAllMsg
			}
		},
		created() {
			this.getUserInfo();
			uni.$on('uAvatarCropper', path => {
				this.avatar = path;
				// 可以在此上传到服务端
				uni.uploadFile({
					url: this.$baseUrl + '/user/imageupload',
					header: {
						authorization: uni.getStorageSync('token')
					},
					filePath: path,
					name: 'file',
					success: (res) => {
						uni.setStorageSync('image', JSON.parse(res.data).obj)
						this.user.image = JSON.parse(res.data).obj
					}
				});
			})
		},
		methods: {
			attendance() {
				this.$u.route('/pages/attendance/attendance')
			},
			goToMsg() {
				this.$u.route('/pages/message/message')
			},
			gotoHistory() {
				this.$u.route('/pages/mine/history')
			},
			getUserInfo() {
				this.$u.get('/user/getinfo').then(res => {
					if (res) {
						// console.log(res);
						this.user = res.obj
					}
				})
			},
			gotoCollection() {
				this.$u.route('/pages/mine/collection')
			},
			chooseAvatar() {
				this.$u.route({
					url: '/uview-ui/components/u-avatar-cropper/u-avatar-cropper',
					params: {
						destWidth: 300,
						rectWidth: 200,
						fileType: 'jpg',
					}
				})
			},
			logout() {
				this.outShow = true
			},
			confirmLogout() {
				this.$u.get('/user/logout').then(res => {
					// console.log(res);
					const _this = this
					if(res) {
						this.$refs.uToast.show({
							title: '退出成功',
							type: 'success',
							duration: 1000,
							callback: function() {
								uni.clearStorageSync()
								_this.$store.commit('freshToken')
								_this.$store.commit('logout')
							}
						})
					}
				})
			},
			setting() {
				this.$u.route('/pages/setting/setting')
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #ededed;
	}

	.camera {
		width: 54px;
		height: 44px;

		&:active {
			background-color: #ededed;
		}
	}

	.user-box {
		background-color: #fff;
	}
</style>
