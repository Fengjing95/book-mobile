<template>
	<view class="u-wrap">
		<view class="u-search-box">
			<view class="search-text">
				<u-search placeholder="请输入关键字" v-model="keyword" @search="search" @custom="search"></u-search>
			</view>
		</view>
		<view class="u-menu-wrap">
			<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-top="scrollTop">
				<view v-for="(item,index) in type" :key="index" class="u-tab-item" :class="[current==index ? 'u-tab-item-active' : '']"
				 :data-current="index" @tap.stop="swichMenu(index)">
					<text class="u-line-1">{{item.typeName}}</text>
				</view>
			</scroll-view>
			<block v-for="(item,index) in type" :key="index">
				<scroll-view scroll-y class="right-box" v-if="current==index">
					<view class="page-view">
						<view class="class-item">
							<view class="item-title">
								<text>{{item.typeName}}</text>
							</view>
							<view class="item-container">
								<view class="thumb-box" v-for="(item1, index1) in bookList" :key="index1" @click="link(item1.bookId)">
									<image class="item-menu-image" :src="getImg(item1.image)" mode=""></image>
									<view class="item-menu-name">{{item1.bookName}}</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</block>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: [{typeId: 0, typeName: '全部'},],
				bookList: [],
				scrollTop: 0, //tab标题的滚动条位置
				current: 0, // 预设当前项的值
				menuHeight: 0, // 左边菜单的高度
				menuItemHeight: 0, // 左边菜单item的高度
				keyword: '',
				pageNumber: 1,
				allPageNumber: undefined,
				loading: false,
			}
		},
		computed: {
			
		},
		methods: {
			link(bookId) {
				this.$u.route(`/pages/book/book?bookId=${bookId}`)
			},
			getBookList() {
				this.$u.get(`/book/fuzzy?key=${this.keyword}&type=${this.current}&pageNumber=${this.pageNumber}&pageSize=27`).then(res => {
					// console.log(res);
					this.bookList.push(...res.obj.content)
					this.allPageNumber = res.obj.totalPages
					this.loading = false
				})
			},
			getImg(image) {
				return this.$photoHeader + image
			},
			// 点击左边的栏目切换
			async swichMenu(index) {
				if(index == this.current) return ;
				this.current = index;
				// 如果为0，意味着尚未初始化
				if(this.menuHeight == 0 || this.menuItemHeight == 0) {
					await this.getElRect('menu-scroll-view', 'menuHeight');
					await this.getElRect('u-tab-item', 'menuItemHeight');
				}
				// 将菜单菜单活动item垂直居中
				this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
				this.initBookList()
			},
			initBookList() {
				this.pageNumber = 1
				this.bookList = []
				this.getBookList()
			},
			nextPage() {
				this.loading = true
				this.pageNumber++
				this.getBookList()
			},
			// 获取一个目标元素的高度
			getElRect(elClass, dataVal) {
				new Promise((resolve, reject) => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.' + elClass).fields({size: true},res => {
						// 如果节点尚未生成，res值为null，循环调用执行
						if(!res) {
							setTimeout(() => {
								this.getElRect(elClass);
							}, 10);
							return ;
						}
						this[dataVal] = res.height;
					}).exec();
				})
			},
			search() {
				// console.log(this.keyword);
				// this.$u.get(``)
				this.initBookList()
			},
			getType() {
				this.$u.get('/booktype/querytype').then(res => {
					this.type.push(...res.obj)
				})
			}
		},
		created() {
			this.getType()
			this.getBookList()
		},
		onReachBottom() {
			if(this.pageNumber < this.allPageNumber) {
				this.nextPage()
			} else {
				uni.showToast({
					title: '没有更多了',
					icon: 'none'
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.u-wrap {
		height: calc(100vh);
		/* #ifdef H5 */
		height: calc(100vh - var(--window-top));
		/* #endif */
		display: flex;
		flex-direction: column;
	}

	.u-search-box {
		padding: 18rpx 30rpx;
	}

	.u-menu-wrap {
		flex: 1;
		display: flex;
		overflow: hidden;
	}

	.u-search-inner {
		background-color: rgb(234, 234, 234);
		border-radius: 100rpx;
		display: flex;
		align-items: center;
		padding: 10rpx 16rpx;
	}

	.u-search-text {
		font-size: 26rpx;
		color: $u-tips-color;
		margin-left: 10rpx;
	}

	.u-tab-view {
		width: 200rpx;
		height: 100%;
	}

	.u-tab-item {
		height: 110rpx;
		background: #f6f6f6;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #444;
		font-weight: 400;
		line-height: 1;
	}
	
	.u-tab-item-active {
		position: relative;
		color: #000;
		font-size: 30rpx;
		font-weight: 600;
		background: #fff;
	}
	
	.u-tab-item-active::before {
		content: "";
		position: absolute;
		border-left: 4px solid $u-type-primary;
		height: 32rpx;
		left: 0;
		top: 39rpx;
	}

	.u-tab-view {
		height: 100%;
	}
	
	.right-box {
		background-color: rgb(250, 250, 250);
	}
	
	.page-view {
		padding: 16rpx;
	}
	
	.class-item {
		margin-bottom: 30rpx;
		background-color: #fff;
		padding: 16rpx;
		border-radius: 8rpx;
	}
	
	.item-title {
		font-size: 26rpx;
		color: $u-main-color;
		font-weight: bold;
	}
	
	.item-menu-name {
		font-weight: normal;
		font-size: 20rpx;
		color: $u-main-color;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
		width: 120rpx;
	}
	
	.item-container {
		display: flex;
		flex-wrap: wrap;
	}
	
	.thumb-box {
		width: 33.333333%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin-top: 20rpx;
	}
	
	.item-menu-image {
		width: 120rpx;
		height: 150rpx;
	}
</style>

