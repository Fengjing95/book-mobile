<template>
	<div class="message-item" :class="messageObj.read ? 'read' : 'no-read'" @click.capture="readById">
		<u-avatar class="avatar" :src="$photoHeader+messageObj.avatarUrl" :size="80"></u-avatar>
		<div class="content">
			<div class="date">
				{{messageObj.msgDate | intervalTime}}
			</div>
			<span class="username">
				{{messageObj.userName}}</span>
			<span v-if="messageObj.type===0"> 点赞了你的动态</span>
			<span v-else-if="messageObj.type===1"> 评论了你：
				<span class="review">{{messageObj.msg}}</span>
			</span>
			<span v-else> {{messageObj.msg}}</span>
		</div>
		<div class="link" v-if="messageObj.type===0||messageObj.type===1">
			<router-link :to="`/pages/discussion/dynamicdetail?dId=${messageObj.dynamicId}`">查看详情</router-link>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			messageObj: Object
		},
		methods: {
			readById() {
				if (this.messageObj.type === 0 || this.messageObj.type === 1) {
					this.$u.get(`/msg/hasread?msgId=${this.messageObj.msgId}`).then(
						res => {
							if (res) {
								this.$store.commit('addUserMsg', -1)
								this.messageObj.read = true
							}
						}
					)
				} else {
					this.$u.get(`/msg/hasread?msgId=${this.messageObj.msgId}`).then(
						res => {
							if (res) {
								this.$store.commit('addSystemMsg', -1)
								this.messageObj.read = true
							}
						}
					)
				}
			},
		},
	}
</script>

<style lang="less">
.no-read {
  border: solid 1px #ffaac3;
  background-color: #fff3f7;
}
.read {
  border: solid 1px #badcdc;
  background-color: #f9fcfc;
}
.message-item {
  margin: 10px 0;
  padding: 5px 10px;
  border-radius: 10px;
  display: flex;
  .content {
    text-align: left;
    flex: 1;
    // line-height: 40px;
    margin-left: 20px;
    margin-right: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: default;
    .username {
      color: #83c0ff;
      font-size: 14px;
    }
    .review {
      color: #777;
    }
    .date {
      font-size: 12px;
      color:#bfbfbf;
      // line-height: 40px;
    }
  }
  .link {
    line-height: 40px;
    a {
      text-decoration: none;
      color: #409eff;
    }
  }
}
</style>
