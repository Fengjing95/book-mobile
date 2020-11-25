<template>
	<view class="msg">
		<u-tabs :list="list" :is-scroll="false" :current="current" @change="change"></u-tabs>
		<view class="user-content" v-show="current === 0">
			<message-item v-for="item in userMsg" :key="item.msgId" :messageObj="item"></message-item>
		</view>

		<view class="system-content" v-show="current === 1">
			<message-item v-for="item in sysMsg" :key="item.msgId" :messageObj="item"></message-item>
		</view>

		<view class="public-notice" v-show="current === 2">
			<u-collapse>
				<u-collapse-item v-for="(item, index) in notice" :key="index" @change="readNotice(index)">
					<span slot="title">
						{{item.noticeTitle}}
						<view class="my-budge" v-if="!item.read"></view>
					</span>
					<u-parse :html="item.noticeContent"></u-parse>
				</u-collapse-item>
			</u-collapse>
		</view>
	</view>
</template>

<script>
	import MessageItem from '../../components/MessageItem.vue'
	export default {
		components: {
			MessageItem
		},
		data() {
			return {
				list: [{
					name: '用户消息',
					// count: this.$store.getters.getUserMsg
				}, {
					name: '系统通知',
					// count: this.$store.getters.getUserMsg
				}, {
					name: '公告',
					// count: this.$store.getters.getUserMsg
				}],
				current: 0,
				userMsg: [],
				sysMsg: [],
				notice: [],
				pageNumber: 1,
				allPageNumber: [],
				loading: false
			}
		},
		methods: {
			change(index) {
				this.current = index;
				this.pageNumber = 1
				switch (index) {
					case 0:
						this.userMsg = []
						this.getUserMsg()
						break
					case 1:
						this.sysMsg = []
						this.getSystemMsg()
						break
					case 2:
						this.notice = []
						this.getNoticeMsg()
						break
					default:
						break
				}
			},
			getUserMsg() {
				this.$u.get(`/msg/querymsg?pageNumber=${this.pageNumber}&pageSize=100`).then(res => {
					// console.log(res);
					this.userMsg.push(...res.obj.content)
					this.allPageNumber[0] = res.obj.totalPages
					// this.list[0].count = this.userMsg.filter(item => {
					// 	return !item.read
					// }).length
				})
			},
			getNoticeMsg() {
				this.$u.get(`/notice/user/querynotice?pageNumber=1&pageSize=100`).then(res => {
					// console.log(res);
					this.notice.push(...res.obj.content)
					this.allPageNumber[2] = res.obj.totalPages
					// this.list[2].count = this.notice.filter(item => {
					// 	return !item.read
					// }).length
				})
			},
			getSystemMsg() {
				this.$u.get(`/msg/querysystem?pageNumber=1&pageSize=100`).then(res => {
					// console.log(res);
					this.sysMsg.push(...res.obj.content)
					this.allPageNumber[1] = res.obj.totalPages
					// this.list[1].count = this.sysMsg.filter(item => {
					// 	return !item.read
					// }).length
				})
			},
			readNotice(index) {
				if (!this.notice[index].read) {
					const noticeId = this.notice[index].noticeId
					this.$u.get(`/notice/user/readnotice?noticeId=${noticeId}`).then(res => {
						console.log(res);
						this.notice[index].read = true
						this.$store.commit('addNoticeMsg', -1)
						// this.list[2].count = this.list[2].count - 1
					})
				}
			}
		},
		onReachBottom() {
			this.loading = true
			if (this.pageNumber < this.allPageNumber[this.current]) {
				if (!this.loading) {
					uni.showLoading({
						title: '加载中'
					})
					switch (this.current) {
						case 0:
							this.getUserMsg()
							break
						case 1:
							this.getSystemMsg()
							break
						case 2:
							this.getNoticeMsg()
							break
						default:
							break
					}
					uni.hideLoading()
				}
			} else {
				uni.showToast({
					title: '没有更多了',
					icon: 'none'
				})
			}
		},
		created() {
			this.getUserMsg()
			this.getSystemMsg()
			this.getNoticeMsg()
		},
		onPullDownRefresh() {
			this.pageNumber = 1
			switch (this.current) {
				case 0:
					this.userMsg = []
					this.getUserMsg()
					break
				case 1:
					this.sysMsg = []
					this.getSystemMsg()
					break
				case 2:
					this.notice = []
					this.getNoticeMsg()
					break
				default:
					break
			}
			uni.stopPullDownRefresh()
		}
	}
</script>

<style lang="less" scoped>
	.msg {
		padding: 0 20px;

		.public-notice {
			.my-budge {
				width: 8px;
				height: 8px;
				border-radius: 50%;
				float: right;
				background-color: red;
			}
		}
	}
</style>
