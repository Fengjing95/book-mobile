<script>
	export default {
		computed: {
			messageNumber() {
				return this.$store.getters.getAllMsg
			},
			token() {
				return this.$store.getters.getToken
			}
		},
		watch: {
			messageNumber(newVal) {
				if(newVal !== 0) {
					uni.showTabBarRedDot({
					  index: 3
					});
				} else {
					uni.hideTabBarRedDot({
					  index: 3
					});
				}
			},
			token(newVal) {
				if(newVal) {
					this.$socket.emit('set_info', {msg: newVal})
					this.getUserMsg()
					// this.getNoticeMsg()
					// this.getSystemMsg()
				}
			}
		},
		methods: {
			getUserMsg() {
				this.$u.get('/msg/querymsg?pageNumber=1&pageSize=100').then(res => {
					if(res) {
						const notReadUser = res.obj.content.filter(item => {
							return !item.read
						})
						this.$store.commit('addUserMsg', notReadUser.length)
					}
				}).then(() => {
					this.getNoticeMsg()
				}).then(() => {
					this.getSystemMsg()
				})
			},
			getNoticeMsg() {
				this.$u.get('/notice/user/querynotice?pageNumber=1&pageSize=100').then(res => {
					if(res) {
						const notReadNotice = res.obj.content.filter(item => {
							return !item.read
						})
						this.$store.commit('addNoticeMsg', notReadNotice.length)
					}
				})
			},
			getSystemMsg() {
				this.$u.get('/msg/querysystem?pageNumber=1&pageSize=100').then(res => {
					if(res) {
						const notReadSystem = res.obj.content.filter(item => {
							return !item.read
						})
						this.$store.commit('addSystemMsg', notReadSystem.length)
					}
				})
			}
		},
		onLaunch: function() {
			if(this.$store.getters.getToken) {
				this.getUserMsg()
				// this.getNoticeMsg()
				// this.getSystemMsg()
			}
		},
		// onShow: function() {
		// 	console.log('App Show')
		// },
		// onHide: function() {
		// 	console.log('App Hide')
		// }
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	/*每个页面公共css */
</style>
