<template>
	<view class="dynamic-item">
		<view class="info">
			<u-avatar :src="userPhoto" size="default"></u-avatar>
			<view class="user">
				<view class="user-name">
					{{dynamicObj.user.userName}}
				</view>
				<view class="time">
					{{dynamicObj.ddate | intervalTime}}
				</view>
			</view>
		</view>
		<view class="content">
			{{dynamicObj.dabstract}}
			
		</view>
		<view class="check-detail">
			<span @click="linkToDetail">查看详情</span>
		</view>
		<view class="options">
			<view class="ic" :class="{active: dynamicObj.like, no: !dynamicObj.like}" @click="like">
				<u-icon name="thumb-up-fill" size="40"></u-icon>
				{{dynamicObj.likeNum}}
			</view>
			<view class="ic no" @click="linkToDetailReview">
				<u-icon name="chat-fill" size="40"></u-icon>
				{{dynamicObj.reviewsNum}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			dynamicObj: Object,
			isBanned: Boolean,
			myId: Number,
		},
		data() {
			return {
				
			};
		},
		computed: {
			userPhoto() {
				return this.$photoHeader + this.dynamicObj.user.image
			}
		},
		methods: {
			like() {
				if(this.dynamicObj.like) {
					this.cancelLike()
				} else {
					this.giveLike()
				}
			},
			cancelLike() {
				this.$u.get(`/givelike/cancellike?dynamicId=${this.dynamicObj.did}`).then(res => {
					this.dynamicObj.likeNum--
					this.dynamicObj.like = false
				})
			},
			giveLike() {
				this.$u.get(`/givelike/givelike?dynamicId=${this.dynamicObj.did}`).then(res => {
					this.dynamicObj.likeNum++
					this.dynamicObj.like = true
					if(this.myId !== this.dynamicObj.userId) {
						const message = {}
						message.targetId = this.dynamicObj.userId
						message.dynamicId = this.dynamicObj.did
						message.token = this.$store.getters.getToken
						this.$socket.emit('send_like', message)
					}
				})
			},
			linkToDetail() {
				this.$u.route('/pages/discussion/dynamicdetail', {
					dId: this.dynamicObj.did
				})
			},
			linkToDetailReview() {
				this.$u.route('/pages/discussion/dynamicdetail', {
					dId: this.dynamicObj.did,
					review: true,
				})
			}
		}
	}
</script>

<style lang="less">
.active {
	color: #409eff;
}
.no {
	color: #777;
}
.dynamic-item {
	margin: 10px 0;
	// height: 200px;
	background-color: #fff;
	border: solid 1px #f0f0f0;
	.info {
		padding: 10px 15px;
		display: flex;
		.user {
			margin-left: 10px;
			margin-top: 7px;
			.time {
				color: #777;
				font-size: 13px;
			}
		}
	}
	.content {
		padding: 5px 15px;
		position: relative;
		height: 70px;
		overflow: hidden;
		&::after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 70px;
			background: linear-gradient(rgba(255, 255, 255, 0),white); /* 溢出部分那显示渐变 */
			pointer-events: none;
		}
	}
	.check-detail {
	  margin-left: 20px;
	  color: #409eff;
	}
	.options {
		height: 40px;
		padding-right: 20px;
		.ic {
			float: right;
			padding: 10px;
		}
	}
}
</style>
