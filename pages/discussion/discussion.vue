<template>
	<view style="padding: 10px;">
		<u-waterfall v-model="discussionList" ref="disList">
			<template v-slot:left="{leftList}">
				<discussion-item v-for="(item, index) in leftList" :key="index" :disObj="item">
					<!-- 这里编写您的内容，item为您传递给v-model的数组元素 -->
					<!-- {{item.bdName}} -->
				</discussion-item>
			</template>
			<template v-slot:right="{rightList}">
				<discussion-item v-for="(item, index) in rightList" :key="index" :disObj="item">
					<!-- 这里编写您的内容，item为您传递给v-model的数组元素 -->
					<!-- {{item.bdName}} -->
				</discussion-item>
			</template>
		</u-waterfall>
	</view>
</template>

<script>
	import DiscussionItem from '../../components/DiscussionItem.vue'
	export default {
		components: {
			DiscussionItem
		},
		data() {
			return {
				discussionList: [],
				pageNumber: 1,
				allPageNumber: null,
				loadStatus: false
			}
		},
		// computed: {
		// 	leftList() {
		// 		return this.discussionList.filter((item, index) => {
		// 			return (index+1) % 2 === 1
		// 		})
		// 	},
		// 	rightList() {
		// 		return this.discussionList.filter((item, index) => {
		// 			return index % 2 === 1
		// 		})
		// 	}
		// },
		methods: {
			getDiscussionList() {
				this.$u.get(`/discussions/querydiscussion?pageNumber=${this.pageNumber}&pageSize=10`).then(res => {
					if(res) {
						// console.log(res);
						this.discussionList.push(...res.obj.content)
						this.allPageNumber = res.obj.totalPages
						this.loadStatus = false
					}
				})
			},
			nextPage() {
				this.loadStatus = true;
				this.pageNumber++
				this.getDiscussionList()
				this.loadStatus = false;
			},
		},
		created() {
			this.getDiscussionList()
		},
		onReachBottom() {
			if(this.pageNumber < this.allPageNumber) {
				if(!this.LoadStatus) {
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
			this.$refs.disList.clear()
			this.pageNumber = 1
			this.discussionList = []
			this.allPageNumber = null
			this.getDiscussionList()
			uni.stopPullDownRefresh()
		}
	}
</script>

<style>

</style>
