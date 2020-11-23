<template>
	<view class="dynamic-detail">
		<view class="content">
			
		</view>
		
		<view class="review" ref="reviewRef">
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dId: undefined,
				scrollReview: false,
				
			}
		},
		methods: {
			
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
		},
	}
</script>

<style lang="less">
.dynamic-detail {
	.content {
	}
	.review {
	}
}
</style>
