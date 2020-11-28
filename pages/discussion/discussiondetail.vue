<template>
	<view class="discussion-detail">
		<view class="bd-info">
			<view class="bd-i-t">
				<u-avatar class="bd-img" :src="photo" size="large"></u-avatar>
				<view class="bd-name">
					{{discussion.bdName}}
				</view>
			</view>
			<view class="bd-i-b">
				<view class="people-num">
					当前人数：{{discussion.peopleNum}}
				</view>
				<view class="publish-btn">
					<u-button v-if="bdInfo.state" type="error" size="mini" :disabled="bdInfo.isBanned" @click="outBd">退出书圈</u-button>
					<u-button v-else type="primary" size="mini" @click="joinBd">加入书圈</u-button>
				</view>
			</view>
		</view>
		
		<view class="dynamic">
			<dynamic-item v-for="item in dynamicList" :key="item.did" :dynamicObj="item" :isBanned="isBanned" :myId="myId"/>
		</view>
		
		<view class="publish" @click="publish" v-show="bdInfo.state">
			<u-icon name="edit-pen-fill" size="50"></u-icon>
		</view>
	</view>
</template>

<script>
	import DynamicItem from '../../components/DynamicItem.vue'
	export default {
		components: {
			DynamicItem,
		},
	 	data() {
			return {
				discussion: {},
				bdId: '',
				bdInfo: {},
				dynamicList: [],
				pageNumber: 1,
				allPageNumber: undefined,
				loadStatus: false,
				isBanned: false,
				myId: undefined,
				photo: ''
			}
		},
		computed: {
		},
		methods: {
			getDiscussionDetail() {
				this.$u.get(`/discussions/querybyid?discussionId=${this.bdId}`).then(res => {
					// console.log(res);
					this.discussion = res.obj.obj
					this.bdInfo = res.obj
					this.isBanned = res.obj.isBanned
					this.myId = res.obj.myId
					this.photo = this.$photoHeader + this.discussion.bdPhoto
					uni.setNavigationBarTitle({
						title: this.discussion.bdName
					})
					
				})
			},
			publish() {
				if(this.isBanned) {
					uni.showToast({
						title: '您正处于禁言期，无法发布动态'
					})
				} else {
					this.$u.route('/pages/discussion/editor')
				}
			},
			joinBd() {
				this.$u.get(`/bduser/join?bdId=${this.bdId}`).then(res => {
					uni.showToast({
						title: '加入成功',
						icon: 'none',
						success: () => {
							this.getDiscussionDetail()
						}
					})
				})
			},
			outBd() {
				this.$u.get(`/bduser/exit?bdId=${this.bdId}`).then(res => {
					uni.showToast({
						title: '退出成功',
						icon: 'none',
						success: () => {
							this.getDiscussionDetail()
						}
					})
				})
			},
			getDynamicList() {
				this.$u.get(`/dynamic/querydynamic?bdId=${this.bdId}&pageNumber=${this.pageNumber}&pageSize=10`).then(res => {
					// console.log(res);
					this.dynamicList.push(...res.obj.content)
					this.allPageNumber = res.obj.totalPages
					this.loadStatus = false
				})
			},
			nextPage() {
				this.loadStatus = true;
				this.pageNumber++
				this.getDynamicList()
			},
		},
		onLoad(options) {
			this.bdId = options.bdId
			this.getDiscussionDetail()
			this.getDynamicList()
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
			this.pageNumber = 1
			this.dynamicList = []
			this.allPageNumber = undefined
			this.getDiscussionDetail()
			this.getDynamicList()
			uni.stopPullDownRefresh()
		}
	}
</script>


<style>
	page {
		background-color: #F0F0F0;
	}
</style>

<style lang="less" scoped>
.discussion-detail {
	// position: relative;
	.bd-info {
		background-color: #ffffff;
		
		padding: 15px;
		.bd-i-t {
			display: flex;
			.bd-img {
				
			}
			.bd-name {
				flex: 1;
				line-height: 70px;
				margin-left: 20px;
			}
		}
		.bd-i-b {
			margin-top: 10px;
			display: flex;
			.people-num {
				flex: 1;
				line-height: 28px;
			}
		}
	}
	.dynamic {
		
	}
	.publish {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		padding: 10px;
		background-color: #409eff;
		color: #fff;
		box-sizing: border-box;
		box-shadow: 0 3px 3px rgba(0,0,0,0.2);
		position: fixed;
		bottom: 60px;
		right: 30px;
		&:active {
			background-color: #2767a8;
		}
	}
}
</style>
