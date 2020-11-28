<template>
	<view class="book-reivew">
		<view class="content">
			<view class="user">
				<u-avatar class="img" :src="userPhoto" size="70"></u-avatar>
				<view class="right">
					<view class="name">
						{{reviewObj.user.userName}}
					</view>
					<view class="date">
						{{reviewObj.reviewDate | intervalTime}}
					</view>
				</view>
			</view>
			<view class="review">
				<u-tag class="tag" v-if="reviewObj.value>=3" text="好评" size="mini" type="error" />
				<u-tag class="tag" v-else text="差评" size="mini" type="warning" />
				<span class="re">{{reviewObj.reviewContent}}</span>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			reviewObj: Object,
		},
		computed: {
			userPhoto() {
				return this.$photoHeader + this.reviewObj.user.image
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="less" scoped>
.book-reivew {
	padding: 10px;
	.content {
		padding: 0 0 10px 0;
		border-bottom: solid 1px #f0f0f0;
		.user {
			.img {
				float: left;
				margin-right: 10px;
			}
			.date {
				color: #777;
				font-size: 13px;
			}
		}
		.review {
			// margin-left: 45px;
			.tag {
				margin-right: 10px;
			}
		}
	}
}
</style>
