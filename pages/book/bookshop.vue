<template>
	<view>
		<u-swiper :list="showList"></u-swiper>
		<view class="title">
			<img src="../../static/icon/hot.png" />
			大家都在看
		</view>
		<view class="book-top">
			<view class="left">
				<view class="left-top" @click="link(first.bookId)">
					<img class="f-img" :src="first.image" />
					<view class="f-name">
						{{first.bookName}}
					</view>
				</view>
				<view class="left-bottom" @click="link(second.bookId)">
					<img class="s-img" :src="second.image" />
					<view class="s-name">
						{{second.bookName}}
					</view>
				</view>
			</view>
			<view class="right">
				<view class="right-item" v-for="item in other" :key="item.bookId" @click="link(item.bookId)">
					<img class="o-img" :src="item.image" />
					<view class="o-name">
						{{item.bookName}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showList: [],
				bookTopLilst: [],
			}
		},
		computed: {
			first() {
				let first = {...this.bookTopLilst[0]}
				first.image = this.$photoHeader + first.image
				return first
			},
			second() {
				let second = {...this.bookTopLilst[1]}
				second.image = this.$photoHeader + second.image
				return second
			},
			other() {
				return this.bookTopLilst.slice(2).map(item => {
					item.image = this.$photoHeader + item.image
					return item
				})
			}
		},
		methods: {
			link(bookId) {
				this.$u.route(`/pages/book/book?bookId=${bookId}`)
			},
			getShowList() {
				this.$u.get('/show/showinfo').then(res => {
					// console.log(res);
					this.showList = res.obj.map(item => {
						return {image: this.$photoHeader + item.showImage}
					})
				})
			},
			getBookTop() {
				this.$u.get('/book/typetop?typeId=1').then(res => {
					// console.log(res);
					this.bookTopLilst = res.obj
				})
			}
		},
		created() {
			this.getShowList()
			this.getBookTop()
		},
		onNavigationBarButtonTap() {
			this.$u.route('/pages/attendance/attendance')
		},
		onPullDownRefresh() {
			this.getShowList()
			this.getBookTop()
			uni.stopPullDownRefresh()
		}
	}
</script>

<style lang="less" scoped>
	.title {
		margin-top: 20px;
		font-size: 16px;
		color: #fd7586;
		img {
			height: 20px;
			width: 42px;
			position: relative;
			top: 3px;
		}
	}
.book-top {
	width: 750rpx;
	height: 750rpx;
	margin-top: 10px;
	border-top: solid 1px #f0f0f0;
	.left {
		width: 450rpx;
		height: 100%;
		float: left;
		// background-color: red;
		.left-top {
			height: 500rpx;
			background-color: #a2ccdc;
			border-bottom: solid 1px #f0f0f0;
			position: relative;
			.f-img {
				width: 240rpx;
				height: 320rpx;
				// border: solid 1px #f0f0f0;
				position: absolute;
				bottom: 40rpx;
				right: 50rpx;
			}
			.f-name {
				color: #fff;
				font-size: 17px;
				padding: 40rpx 20rpx 0 40rpx;
			}
		}
		.left-bottom {
			height: 250rpx;
			background-color: #c1dde8;
			border-bottom: solid 1px #f0f0f0;
			position: relative;
			.s-img {
				width: 150rpx;
				height: 200rpx;
				position: absolute;
				top: 25rpx;
				left: 30rpx;
			}
			.s-name {
				color: #fff;
				width: 230rpx;
				float: right;
				margin-top: 40rpx;
				margin-left: 20rpx;
			}
		}
	}
	.right {
		display: flex;
		flex-direction: column;
		.right-item {
			height: 250rpx;
			width: 100%;
			background-color: #e0eef3;
			border-bottom: solid 1px #f0f0f0;
			border-left: solid 1px #f0f0f0;
			position: relative;
			.o-img {
				width: 120rpx;
				height: 160rpx;
				position: absolute;
				top: 25rpx;
				left: 30rpx;
			}
			.o-name {
				width: 260rpx;
				position: absolute;
				top: 200rpx;
				left: 20rpx;
				overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
			}
			&:nth-of-type(2) {
				background-color: #e9f3f6;
				.o-img {
					left: 150rpx;
				}
			}
		}
	}
}
</style>
