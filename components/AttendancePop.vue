<template>
	<view class="pop-item">
		<view class="a-image">
			<image src="../static/image/attendance.png" mode="scaleToFill" style="width: 105px; height: 65px;"/>
		</view>
		<view class="c-top">
			<view class="text">
				签到成功
			</view>
		</view>
		<view class="c-bottom">
			<view class="c-b-t">
				恭喜，获取
				<span style="color: #409eff;">【{{coin}}源币】</span>
			</view>
			<view class="c-b-b">
				继续坚持哦
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			coin: Number,
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="less">
.pop-item {
	.a-image {
		position: absolute;
		z-index: 9;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		image {
			// object-fit: cover;
		}
	}
	.c-top {
		height: 150px;
		width: 100%;
		background: radial-gradient(at bottom left, #60aeff, #0072e8);
		position: relative;
		.text {
			color: #ffffff;
			font-size: 30px;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -70%);
		}
	}
	.c-bottom {
		height: 150px;
		width: 100%;
		text-align: center;
		.c-b-t {
			padding-top: 40px;
		}
		.c-b-b {
			margin-top: 10px;
		}
	}
}
</style>
