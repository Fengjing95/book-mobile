<template>
	<view class="attendance">
		<view class="info-ui">
			<view class="i-u-t">
				<view class="i-u-t-l">
					<view class="days">
						{{weekTimes}}天
					</view>
					<view class="tips">
						本周已签到
					</view>
				</view>
				<view class="i-u-t-r">
					<u-button size="medium" shape="circle" :disabled="hadAttendance" @click="attendance" type="primary">{{hadAttendance?'已签到':'签到'}}</u-button>
				</view>
			</view>
			<view class="i-u-b">
				<u-steps :list="coinList" mode="number" :current="weekTimes - 1"></u-steps>
			</view>
		</view>


		<u-popup mode="center" v-model="show" width="250px" height="300px" border-radius="30">
			<view class="content">
				<attendance-pop :coin="todayCoin" />
			</view>
		</u-popup>
	</view>
</template>

<script>
	import AttendancePop from '../../components/AttendancePop.vue'
	export default {
		components: {
			AttendancePop
		},
		data() {
			return {
				show: false,
				todayCoin: 0,
				hadAttendance: false,
				weekTimes: 0,
				coinList: [{
						name: 100
					},
					{
						name: 200
					},
					{
						name: 200
					},
					{
						name: 400
					},
					{
						name: 400
					},
					{
						name: 500
					},
					{
						name: 1000
					},
				]
			}
		},
		methods: {
			attendance() {
				this.$u.get('/attendance/attendance').then(res => {
					if (res) {
						this.hadAttendance = res.obj.attendanceDate
						this.weekTimes = res.obj.attendanceTimes
						switch (this.weekTimes) {
							case 1:
								this.todayCoin = 100
								break
							case 2:
								this.todayCoin = 200
								break
							case 3:
								this.todayCoin = 400
								break
							case 4:
								this.todayCoin = 400
								break
							case 5:
								this.todayCoin = 500
								break
							case 6:
								this.todayCoin = 500
								break
							case 7:
								this.todayCoin = 1000
								break
							default:
								break
						}
						this.show = true
					}
				})
			},
			getAttendanceInfo() {
				this.$u.get('/attendance/getattendance').then(res => {
					if (res) {
						this.hadAttendance = res.obj.attendanceDate
						this.weekTimes = res.obj.attendanceTimes
					}
				})
			}
		},
		created() {
			this.getAttendanceInfo()
		}
	}
</script>

<style lang="less">
	.attendance {
		.info-ui {
			position: relative;

			.i-u-t {
				display: flex;
				padding: 40px 20px 0 30px;
				background: url(../../static/image/att-bg.png);
				height: 300px;
				border-radius: 0 0 30% 30%;

				.i-u-t-l {
					flex: 1;
					font-size: 30px;
					line-height: 38px;
					color: #fff;

					.days {
						margin-left: 17px;
					}

					.tips {
						font-size: 14px;
					}
				}

				.i-u-t-r {}
			}

			.i-u-b {
				width: 692rpx;
				height: 200px;
				background-color: #fff;
				border-radius: 20px;
				position: absolute;
				top: 60%;
				left: 50%;
				transform: translateX(-50%);
				box-shadow: 0 5px 5px #d4e9ff;
				padding-top: 80px;
			}
		}

		.content {
			position: relative;
			// width: 450px;
			// height: 550px;

		}
	}
</style>
