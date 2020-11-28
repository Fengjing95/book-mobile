<template>
	<view>
		<view class="book-info">
			<view class="book-image">
				<img class="img" :src="bookImg">
				<view class="type">
					{{book.typeName}}
				</view>
			</view>
			<view class="text-info">
				<view class="name">
					{{book.bookName}}
				</view>
				<view class="author">
					{{book.author}}
				</view>
				<view class="publisher">
					{{book.publisher}}
				</view>
				<view class="publish-date">
					{{book.publishDate | formatDate}} 出版
				</view>
				<view class="price">
					售价: {{book.bookPrice}}
				</view>
				<view class="uploader">
					由<span style="color: #2B85E4;">{{book.userId === 1 ? '书源网' : book.user.userName}}</span>整理上传
				</view>
				<u-icon @click="collect" class="icon" :class="{active: book.myCollection}" :name="book.myCollection ? 'heart-fill' : 'heart'"></u-icon>
			</view>
		</view>
		<view class="part-list">
			<view class="h">
				<h3>章节列表</h3>
				<view class="btns">
					<u-button class="btn" size="mini" :plain="true" type="success">试读</u-button>
					<u-button class="btn" size="mini" :plain="true" type="primary"
					 :disabled="!book.bookState || unlockInfo.limitAll" @click="unlockNext">解锁下一部分</u-button>
					<u-button class="btn" size="mini" :plain="true" type="error"
					 :disabled="!book.bookState || unlockInfo.limitAll" @click="unlockAll">全本解锁</u-button>
				</view>
			</view>
			<view class="p-list">
				<u-button class="p-btn" v-for="index in part" :key="index" 
				size="mini" :disabled="(unlockInfo.limitPage < index && !unlockInfo.limitAll) || !book.bookState">
					{{index !== part ? (index - 1) * 100 + 1 + '—' + index * 100 :
					 (index - 1) * 100 + 1 + '—' + book.bookPage }}
				</u-button>
			</view>
			
		</view>
		<view class="recommend">
			<h3>推荐你看</h3>
			<view class="list">
				<view class="re-item" v-for="item in recommend" :key="item.bookId" @click="linkTo(item.bookId)">
					<img :src="getImg(item.image)" />
					<view class="book-name">
						{{item.bookName}}
					</view>
				</view>
			</view>
		</view>
		<view class="book-review">
			<h3>用户评价</h3>
			<view class="has-review" v-if="reviewList.length !== 0">
				<book-review v-for="item in reviewList" :key="item.reviewId" :reviewObj="item"/>
			</view>
			<view class="no-review" v-else>
				<u-empty text="还没有评论" mode="data"></u-empty>
			</view>
		</view>
	</view>
</template>

<script>
	import BookReview from '../../components/Book-review.vue'
	export default {
		components: {
			BookReview,
		},
		data() {
			return {
				bookId: undefined,
				book: {user: {username: ''}},
				reviewList: [],
				pageNumber: 1,
				allPageNumber: undefined,
				recommend: [],
				loading: false,
				unlockInfo: {},
			};
		},
		computed: {
			bookImg() {
				return this.$photoHeader + this.book.image
			},
			part() {
			  return Math.ceil(this.book.bookPage / 100) || 0
			},
		},
		methods: {
			linkTo(bookId) {
				this.$u.route(`/pages/book/book?bookId=${bookId}`)
			},
			getImg(image) {
				return this.$photoHeader + image
			},
			getBookInfo() {
				this.$u.get(`/book/querybookinfo?bookId=${this.bookId}`).then(res => {
					this.book = res.obj
					// console.log(res);
					uni.setNavigationBarTitle({
						title: this.book.bookName
					})
				})
			},
			getReviewList() {
				this.$u.get(`/bookreview/querybookreview?bookId=${this.bookId}&pageNumber=${this.pageNumber}&pageSize=15`).then(res => {
					// console.log(res);
					this.allPageNumber = res.obj.totalPages
					this.reviewList.push(...res.obj.content)
					this.loading = false
				})
			},
			nextPage() {
				this.loading = true
				this.pageNumber++
				this.getReviewList()
			},
			getRecommend() {
				this.$u.get('/cf/cf').then(res => {
					this.recommend = res.obj
				})
			},
			collect() {
				if(this.book.myCollection) {
					this.cancelCollection()
				} else {
					this.addCollection()
				}
			},
			addCollection() {
				this.$u.get(`/collection/on?bookId=${this.bookId}`).then(res => {
					this.book.myCollection = true
					uni.showToast({
						icon: 'success',
						title: '收藏成功'
					})
				})
			},
			cancelCollection() {
				this.$u.get(`/collection/off?bookId=${this.bookId}`).then(res => {
					this.book.myCollection = false
					uni.showToast({
						icon: 'success',
						title: '已取消'
					})
				})
			},
			getUnlockInfo() {
				this.$u.get(`/limit/querylimit?bookId=${this.bookId}`).then(res => {
					// console.log(res);
					this.unlockInfo = res.obj
				})
			},
			unlockNext() {
				this.$u.get(`/limit/partlimit?bookId=${this.bookId}`).then(res=> {
					this.getUnlockInfo()
					uni.showToast({
						icon: 'success',
						title: '解锁成功'
					})
				})
			},
			unlockAll() {
				this.$u.get(`/limit/alllimit?bookId=${this.bookId}`).then(res => {
					this.getUnlockInfo()
					uni.showToast({
						icon: 'success',
						title: '解锁成功'
					})
				})
			},
			freeRead() {
				
			},
			readOnline(part) {
				this.$u.get(``)
			},
			
		},
		created() {
			this.getBookInfo()
			this.getRecommend()
			this.getReviewList()
			this.getUnlockInfo()
		},
		onLoad(options) {
			this.bookId = options.bookId
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
		onPullDownRefresh() {
			this.getBookInfo()
			this.getRecommend()
			this.pageNumber = 1
			this.reviewList = []
			this.getReviewList()
			this.getUnlockInfo()
			uni.stopPullDownRefresh()
		}
	}
</script>

<style lang="less" scoped>
.book-info {
	border-bottom: solid 1px #f0f0f0;
	.book-image {
		padding: 50rpx;
		width: 375rpx;
		position: relative;
		float: left;
		.img {
			width: 275rpx;
			height: 367rpx;
			border: solid 1px #f0f0f0;
			box-sizing: border-box;
		}
		.type {
			background: url(../../static/image/标签.png) no-repeat;
			width: 46px;
			height: 20px;
			color: #fff;
			font-size: 10px;
			line-height: 20px;
			padding-left: 8px;
			position: absolute;
			top: 60rpx;
			right: 50rpx;
		}
	}
	.text-info {
		padding: 50rpx 50rpx 50rpx 10rpx;
		height: 467rpx;
		display: flex;
		flex-direction: column;
		position: relative;
		view {
			flex: 1;
		}
		.name {
			font-size: 17px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.author {
			color: #777;
		}
		.active {
			color: red;
		}
		.icon {
			font-size: 20px;
			position: absolute;
			bottom: 150rpx;
			right: 50rpx;
		}
	}
}
.part-list {
	clear: both;
	border-bottom: solid 1px #f0f0f0;
	.p-list {
		padding: 10px;
		// display: flex;
		// flex-wrap: wrap;
		// flex-direction: row;
		.p-btn {
			width: 80.3px;
			margin: 0 10px 5px 10px;
		}
	}
	
	.h {
		display: flex;
		h3 {
			margin-left: 10px;
			margin-top: 5px;
			display: inline-block;
		}
		.btns {
			flex: 1;
			display: inline-flex;
			padding: 5px 10px;
			.btn {
				margin: 0 10px;
			}
		}
	}
}
.recommend {
	clear: both;
	border-bottom: solid 1px #f0f0f0;
	
	h3 {
		margin-left: 10px;
	}
	.list {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 25rpx;
		img {
			width: 210rpx;
			height: 280rpx;
			border: solid 1px #f0f0f0;
		}
		.book-name {
			width: 210rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 13px;
			margin-bottom: 10px;
		}
	}
	
}
.book-review {
	clear: both;
	h3 {
		margin-left: 10px;
	}
	.has-review {}
	.no-review {
		margin-top: 20px;
	}
}
</style>
