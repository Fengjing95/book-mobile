<template>
	<view class="dynamic-detail">
		<view class="content">
			<view class="dynamic-info">
				<u-avatar :src="userPhoto" size="default"></u-avatar>
				<view class="d-user">
					<view class="user-name">
						{{dynamic.user.userName}}
					</view>
					<view class="d-time">
						{{dynamic.ddate | intervalTime}}
					</view>
				</view>
				<view class="delete-btn" v-if="my">
					删除
				</view>
			</view>
			<view class="dynamic-text">
				<u-parse :html="dynamic.dcontent"></u-parse>
			</view>
			<view class="d-options">
				<view class="d-ic" :class="{'d-active': dynamic.like, 'd-no': !dynamic.like}" @click="like">
					<u-icon name="thumb-up-fill" size="40"></u-icon>
					{{dynamic.likeNum}}
				</view>
				<view class="d-ic d-no">
					<u-icon name="chat-fill" size="40"></u-icon>
					{{dynamic.reviewsNum}}
				</view>
			</view>
		</view>
		
		<view class="review-ipt">
			<u-input class="ipt" height="70" placeholder="输入评论内容" v-model="review" :clearable="false" border></u-input>
			<u-button class="btn" size="default" type="primary" :disabled="review==='' || isBanned" @click="sendReview">评论</u-button>
		</view>
		
		<view class="review" ref="reviewRef">
			<my-review v-for="item in reviewList" @refreshReview="refreshReview" :key="item.drId" 
			:reviewObj="item" :isMine="my" :isBanned="isBanned" :myId="nowUser">
				<view v-if="item.sonReview.length !== 0">
					<my-review v-for="item2 in item.sonReview" :key="item2.drId" :reviewObj="item2"
					style="background-color: #fafbfc;" @refreshReview="refreshReview" :myId="nowUser"
					:isMine="my" :isBanned="isBanned"></my-review>
				</view>
			</my-review>
		</view>
	</view>
</template>

<script>
	import MyReview from '../../components/MyReview.vue'
	export default {
		components: {
			MyReview,
		},
		data() {
			return {
				dId: undefined,
				scrollReview: false,
				dynamic: {user: {image: ''}},
				isBanned:false,
				my: false,
				nowUser: undefined,
				loading: true,
				reviewList: [],
				pageNumber: 1,
				allPageNumber: undefined,
				review: '',
				userPhoto: ''
			}
		},
		computed: {
			
		},
		methods: {
			getDynamic() {
				this.loading = true
				this.$u.get(`/dynamic/querybyid?dynamicId=${this.dId}`).then(res => {
					// console.log(res);
					this.dynamic = res.obj.dynamic
					this.isBanned = res.obj.isBanned
					this.my = res.obj.my
					this.nowUser = res.obj.nowUser
					this.userPhoto = this.$photoHeader + this.dynamic.user.image
				}).finally(() => {
					this.loading = false
				})
			},
			getReviewList() {
				return this.$u.get(`/dynamicreview/queryreviews?dId=${this.dId}&pageNumber=${this.pageNumber}&pageSize=10`).then(res => {
					// console.log(res);
					this.reviewList.push(...res.obj.content)
					this.allPageNumber = res.obj.totalPages
				}).finally(() => {
					this.loading = false
				})
			},
			async refreshReview() {
				const oldPage = this.pageNumber
				const top = document.documentElement.scrollTop
				this.pageNumber = 0
				this.reviewList = []
				for(let i = 1; i <= oldPage; i++) {
					await this.nextPage()
				}
				document.documentElement.scrollTop = top
			},
			async nextPage() {
				this.loading = true;
				this.pageNumber++
				await this.getReviewList()
				return Promise.resolve()
			},
			sendReview() {
				const sendReviewObj = {
					reviewContent: this.review,
					dynamicId: this.dId,
				}
				this.$u.post('/dynamicreview/releasereview', sendReviewObj).then(
					res => {
						if (res) {
							if (this.myId !== this.dynamic.userId) {
								const message = {}
								message.targetId = this.dynamic.userId
								message.msg = sendReviewObj.reviewContent
								message.token = this.$store.getters.getToken
								message.dynamicId = this.dId
								this.$socket.emit('send_review', message)
							}
							this.review = ''
							this.refreshReview()
							uni.showToast({
								title: '评论成功'
							})
							
						}
					}
				)
			},
			like() {
				if(this.dynamic.like) {
					this.cancelLike()
				} else {
					this.giveLike()
				}
			},
			cancelLike() {
				this.$u.get(`/givelike/cancellike?dynamicId=${this.dId}`).then(res => {
					this.dynamic.likeNum--
					this.dynamic.like = false
				})
			},
			giveLike() {
				this.$u.get(`/givelike/givelike?dynamicId=${this.dId}`).then(res => {
					this.dynamic.likeNum++
					this.dynamic.like = true
					if(this.nowUser !== this.dynamic.userId) {
						const message = {}
						message.targetId = this.dynamic.userId
						message.dynamicId = this.did
						message.token = this.$store.getters.getToken
						this.$socket.emit('send_like', message)
					}
				})
			},
		},
		mounted() {
			// 直接跳转到评论区
			if(this.scrollReview) {
				uni.createSelectorQuery().select('.review').boundingClientRect(data=>{//目标位置的节点：类或者id
					uni.createSelectorQuery().select(".dynamic-detail").boundingClientRect(res=>{//最外层盒子的节点：类或者id
						uni.pageScrollTo({
							  duration: 200,//过渡时间
							  scrollTop:data.top - res.top  ,//到达距离顶部的top值
						})
					}).exec()
				}).exec();
			}
		},
		onLoad(options) {
			this.dId = options.dId
			this.scrollReview = options.review
			this.getDynamic()
			this.getReviewList()
		},
		onPullDownRefresh() {
			this.reviewList = []
			this.pageNumber = 1
			this.getDynamic()
			this.getReviewList()
			uni.stopPullDownRefresh()
		},
		onReachBottom() {
			if(this.pageNumber < this.allPageNumber) {
				if(!this.loading) {
					uni.showLoading({
						title: '加载中'
					})
					this.nextPage()
					uni.hideLoading()
				}
			} else {
				uni.showToast({
					title: '没有更多了',
					icon: 'none'
				})
			}
		},
	}
</script>

<style lang="less">
	.d-active {
		color: #409eff;
	}
	.d-no {
		color: #777;
	}
.dynamic-detail {
	.content {
		.dynamic-info {
			padding: 10px 15px;
			display: flex;
			position: relative;
			.d-user {
				margin-left: 10px;
				margin-top: 7px;
				.d-time {
					color: #777;
					font-size: 13px;
				}
			}
			.delete-btn {
				position: absolute;
				top: 20px;
				right: 20px;
				color: #777;
			}
		}
		.dynamic-text {
			padding: 10px 20px;
		}
		.d-options {
			height: 40px;
			padding-right: 20px;
			.d-ic {
				float: right;
				padding: 10px;
			}
		}
	}
	.review-ipt {
		// display: flex;
		padding: 10px 20px;
		.ipt {
			display: inline-block;
			width: 60vw;
			margin-right: 20px;
		}
		.btn {
			display: inline-block;
			position: relative;
			top: -12px;
			// #ifdef MP-WEIXIN  
			top: 0;
			// #endif 
			width: 20vw;
		}
	}
	.review {
	}
}
</style>
