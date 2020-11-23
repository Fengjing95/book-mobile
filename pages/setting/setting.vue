<template>
	<view class="setting">
		<u-toast ref="uToast" />
		<view class="">
			<u-form>
				<u-form-item label="昵称">
					<u-input v-model="userName" type="text" border />
				</u-form-item>
			</u-form>
			<u-button type="primary" :disabled="oldName === userName" @click="updateUsername">修改</u-button>
		</view>
		<view class="re" @click="sendSms">
			修改密码
		</view>
		<view class="code" style="width: 100%;" v-if="showRePwd">
			<view class="phone">
				验证码已发送至<span style="color: #409eff;margin-bottom: 10px;">{{phone}}</span>,注意查收
			</view>
			<u-message-input mode="middleLine" @finish="finish" :maxlength="6" value=""></u-message-input>
			<u-form>
				<u-form-item label="密码">
					<u-input v-model="newPassword" type="password" placeholder="请输入新密码" border />
				</u-form-item>
			</u-form>
			<u-button type="primary" :disabled="code === '' || newPassword === ''" @click="rePassword">提交</u-button>
		</view>
	</view>
</template>

<script>
	import md5Libs from "uview-ui/libs/function/md5";
	export default {
		data() {
			return {
				oldName: '',
				userName: '',
				phone: '',
				code: '',
				newPassword: '',
				showRePwd: false
			}
		},
		methods: {
			getUserInfo() {
				this.$u.get('/user/getinfo').then(res => {
					this.phone = res.obj.userPhone
					this.oldName = res.obj.userName
					this.userName = res.obj.userName
				})
			},
			updateUsername() {
				this.$u.post('/user/updateusername', {userName: this.userName}).then(res => {
					if(res) {
						this.$refs.uToast.show({
							title: '修改成功',
							type: 'success',
						})
						this.oldName = res.obj
						this.userName = res.obj
					}
				}).catch(err => console.log(err))
			},
			sendSms() {
				console.log({phone: this.phone});
				this.$u.post('/user/getsms', {phone: this.phone}).then(res => {
					// console.log(res);
					this.showRePwd = true
				})
			},
			finish(v) {
				this.code = v
			},
			rePassword() {
				const obj = {
					code: this.code,
					password: md5Libs.md5(this.newPassword)
				}
				this.$u.post('/user/updatepassword', obj).then(res => {
					this.$refs.uToast.show({
						title: '修改成功',
						type: 'success',
					})
				}).catch(err => {
					console.log(err);
				})
			}
		},
		created() {
			this.getUserInfo()
		}
	}
</script>

<style lang="less">
.setting {
	padding: 20px;
	.re {
		text-align: center;
		margin-top: 20px;
		color: #409eff;
	}
	.code {
		margin-top: 20px;
		.phone {
			font-size: 13px;
		}
	}
}
</style>
