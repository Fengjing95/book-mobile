<template>
	<view class="review">
		<u-avatar size="70" class="left" :src="userPhoto"></u-avatar>
		<view class="right">
			<view class="review-name">{{reviewObj.userPojo.userName}} </view>
			<view class="review-date">{{reviewObj.drDate | intervalTime}} <span v-if="myId===reviewObj.userId || isMine">·
					<span style="color: #777;padding: 0;" @click="deleteReview">删除</span></span></view>
			<view class="reply" v-if="reviewObj.drPid !== reviewObj.drSpid"><span style="color: #777;">回复 </span><span>{{reviewObj.repUserPojo ? reviewObj.repUserPojo.userName : '原评论已删除'}}:</span></view>
			<view class="content">
				<view class="content-text">{{reviewObj.drContent}}</view>
				<view class="content-btn" @click="showForm" :disabled="isBanned">回复</view>
			</view>
			<view class="review-input" v-if="isShowForm" @mousedown.prevent>
				<u-input height="35" focus border ref="reviewInput" @blur="hiddenForm" v-model="content" :placeholder="`回复@${reviewObj.userPojo.userName}`"
				 @mousedown.stop></u-input>
				<u-button class="reply-btn" size="mini" @click="sendReview" type="primary" :disabled="content === ''">{{btnText}}</u-button>
			</view>
			<slot />
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			reviewObj: Object,
			isMine: {
				type: Boolean,
				default: false,
			},
			myId: {
				type: Number,
				default: 0,
			},
			isBanned: Boolean
		},
		computed: {
			userPhoto() {
				return this.$photoHeader + this.reviewObj.userPojo.image
			}
		},
		data() {
			return {
				isShowForm: false,
				content: '',
				btnText: '回复'
			}
		},
		methods: {
			showForm() { // 显示评论框
				if (!this.isShowForm) {
					this.isShowForm = true
					// this.$nextTick(() => {
					// 	this.$refs.reviewInput.focus()
					// })
				}
			},
			hiddenForm() { // 隐藏评论框
				this.isShowForm = false
				this.content = ''
			},
			sendReview() {
				this.btnText = '发送中……'
				const sendReviewObj = {
					reviewContent: this.content,
					parentId: this.reviewObj.drId,
					supParentId: this.reviewObj.drSpid === 0 ? this.reviewObj.drId : this.reviewObj.drSpid,
					dynamicId: this.reviewObj.dynamicId,
				}
				this.$u.post('/dynamicreview/releasereview', sendReviewObj).then(
					res => {
						if (res) {
							if (this.myId !== this.reviewObj.userId) {
								const message = {}
								message.targetId = this.reviewObj.userId
								message.msg = sendReviewObj.reviewContent
								message.token = this.$store.getters.getToken
								message.dynamicId = this.reviewObj.dynamicId
								this.$socket.emit('send_review', message)
							}
							uni.showToast({
								title: '评论成功'
							})
						}
					}
				).finally(() => {
					this.content = ''
					this.btnText = '回复'
					// this.$nextTick(() => {
						// this.$refs.reviewInput.blur()
					// })
					this.isShowForm = false
					this.$emit('refreshReview')
					
				})
			},
			deleteReview() {
				this.$u.get(`/dynamicreview/deletereview?dId=${this.reviewObj.dynamicId}&reviewId=${this.reviewObj.drId}`).then(
					res => {
						if (res) {
							// console.log(res);
							this.$emit('refreshReview')
							uni.showToast({
								title: '删除成功'
							})
						}
					}
				)
			}
		},
	}
</script>

<style lang="less">
.review {
  // margin-bottom: 10px;
  padding: 10px;
  .left {
    float: left;
  }
  .right {
    margin-left: 40px;
    .review-name {
      font-size: 14px;
      font-weight: 700;
    }
    .review-date {
      margin-top: 5px;
      font-size: 12px;
      color: #777;
    }
    .content {
      display: flex;
      padding: 10px 0;
      .content-text {
        flex: 1;
      }
      .content-btn {
        padding: 0;
		// float: right;
		color: #409eff;
      }
    }
    .reply {
      margin-top: 5px;
      font-size: 14px;
      flex-wrap:wrap;
    }
    .review-input {
      display: flex;
      .reply-btn {
        margin-left: 20px;
      }
    }
  }
}
</style>
