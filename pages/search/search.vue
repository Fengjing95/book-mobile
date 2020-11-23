<template>
	<view>
		<view class="search-text">
			<u-search placeholder="请输入关键字" v-model="keyword" @search="search" @custom="search"></u-search>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyword: ''
			}
		},
		methods: {
			search() {
				console.log(this.keyword);
			}
		}
	}
</script>

<style>
.search-text {
	padding: 10px;
}
</style>
