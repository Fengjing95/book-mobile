<template>
	<view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			getUserMsg() {
				this.$u.get(`/msg/querymsg?pageNumber=1&pageSize=100`).then(res => {
					if(res) {
						
					}
				})
			},
			getNoticeMsg() {
				this.$u.get(`/notice/user/querynotice?pageNumber=1&pageSize=100`).then(res => {
					if(res) {
						
					}
				})
			},
			getSystemMsg() {
				this.$u.get(`/msg/querysystem?pageNumber=1&pageSize=100`).then(res => {
					if(res) {
						
					}
				})
			}
		}
	}
</script>

<style>

</style>
