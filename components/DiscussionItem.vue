<template>
	<view class="dis-item" @click="gotoDetail">
		<u-lazy-load threshold="-450" border-radius="10" :image="bdPhoto"></u-lazy-load>
		<!-- {{disObj}} -->
		<view class="bd-name">
			{{disObj.bdName}}
		</view>
		<view class="bd-des">
			{{disObj.bdDes}}
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			disObj: Object
		},
		data() {
			return {
				
			};
		},
		computed: {
			bdPhoto() {
				return this.$photoHeader + this.disObj.bdPhoto
			}
		},
		methods: {
			gotoDetail() {
				this.$u.route('/pages/discussion/discussiondetail', {
					bdId: this.disObj.bdId
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: rgb(240, 240, 240);
	}
</style>

<style lang="less">
.dis-item {
	background-color: #FFFFFF;
	border-radius: 10px;
	padding: 10px;
	margin: 5px 8px 11px 8px;
	.bd-name {
		margin-top: 5px;
		font-weight: bold;
	}
	.bd-des {
		font-size: 12px;
		margin-top: 5px;
		color: #777777;
	}
}
</style>
