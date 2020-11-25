<template>
	<view class="collection">
		<view class="have-collection" v-if="collectionList">
			<ul class="books-list">
				<li v-for="item in collectionList" :key="item.bookId">
					<img :src="getImg(item.image)" @click="$u.route(`/pages/book/book?bookId=${item.bookId}`)" />
					<view class="book-name">{{item.bookName}}</view>
				</li>
				<li v-if="collectionList.length % 3 === 2">
					<view style="width: 220rpx;"></view>
				</li>
			</ul>
		</view>
		<view v-else>
			<u-empty text="" mode="list"></u-empty>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				collectionList: []
			}
		},
		computed: {
			// row() {
			// 	return Math.ceil(this.collectionList.length / 6)
			// }
		},
		methods: {
			getImg(image) {
				return this.$photoHeader + image
			},
			getCollection() {
				return this.$u.get("/book/mycollection").then((res) => {
					if (res) {
						// console.log(res);
						this.collectionList = res.obj
					}
				});
			},
		},
		created() {
			this.getCollection();
		},
		async onPullDownRefresh() {
			await this.getCollection()
			uni.stopPullDownRefresh()
		}
	}
</script>

<style lang="less" scoped>
.collection {
	padding: 25rpx;
}
  ul {
    list-style: none;
	padding: 0;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	li {
	    position: relative;
	    display: inline-block;
	    overflow-y: hidden;
	    overflow-x: visible;
		margin-left: 0;
		.book-name {
			width: 220rpx;
			overflow: hidden;
			text-overflow:ellipsis;
			white-space: nowrap;
			margin-bottom: 20px;
		}
	}
  }
  img {
	  width: 220rpx;
	  height: 294rpx;
	  border: solid 1px #f0f0f0;
	  box-sizing: border-box;
  }
</style>
