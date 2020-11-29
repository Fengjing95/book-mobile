<template>
	<view style="padding: 10px;">
		<u-time-line v-if="readList.length !== 0">
		    <u-time-line-item v-for="item in readList" :key="item.bookId">
				<template v-slot:content>
					<view class="card" @click="linkTo(item.bookId)">
						<img class="book-image" :src="getImg(item.book.image)" @click="goToBook(item.bookId)" />
						<view>
							<h4 class="book-name move" @click="goToBook(item.bookId)">{{item.book.bookName}}<span style="color: #777777;">&nbsp;(作者：{{item.book.author}})</span></h4>
							<view class="earnings move">阅读到第{{item.historyPage}}页</view>
							<u-line-progress class="pro" :stroke-width="18" :percent="parseInt(item.historyPage * 100 / item.book.bookPage)" active-color="#ff9900"></u-line-progress>
						</view>
					</view>
					<view class="time">
						{{item.historyDate | formatDate2}}
					</view>
				</template>
		    </u-time-line-item>
		</u-time-line>
		<view class="no-h" v-else>
			<u-empty text="无阅读历史" mode="history"></u-empty>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				readList: [],
				pageNumber: 1,
				allPageNumber: undefined,
				loading: false,
			}
		},
		methods: {
			getImg(img) {
				return this.$photoHeader + img
			},
			getReadList() {
				this.$u.get(`/history/queryall?pageNumber=${this.pageNumber}&pageSize=10`).then(res => {
					this.readList.push(...res.obj.content)
					this.allPageNumber = res.obj.totalPages
					this.loading = false
				})
			},
			nextPage() {
				this.loading = true
				this.pageNumber++
				this.getReadList()
			},
			linkTo(bookId) {
				this.$u.route(`/pages/book/book?bookId=${bookId}`)
			}
		},
		created() {
			this.getReadList()
		},
		onPullDownRefresh() {
			this.readList = []
			this.pageNumber = 1
			this.getReadList()
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
		}
	}
</script>

<style lang="less" scoped>
  .card {
    display: flex;
    .book-image {
      width: 120rpx;
      height: 160rpx;
      border: solid 1px #f0f0f0;
    }
    .book-name {
      margin-left: 20px;
      cursor: pointer;
    }
    .earnings {
      margin-left: 20px;
      color: #777777;
    }
    .pro {
      margin-left: 20px;
      width: 154px;
    }
    .move {
      margin-bottom: 10px;
    }
  }
  .time {
	  color: #777;
  }
  .no-h {
	  margin-top: 300rpx;
  }
</style>
