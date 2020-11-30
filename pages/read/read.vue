<template>
	<!-- #ifndef MP-WEIXIN -->
		<view style="width: 100%;" >
		    <web-view :src="allUrl"></web-view>
		</view>
	<!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
		<view style="text-align: center;">
			<view class="">
				由于小程序的机制问题，无法在小程序端预览
			</view>
			<view class="">
				您可以到APP进行阅读
			</view>
			
		</view>
    <!-- #endif -->
</template>

<script>
    export default {
        data() {
            return {
                allUrl:'',
				viewerUrl: '/hybrid/html/web/viewer.html', // 格式化文件流的一个js 文件 文末会分享出来
            }
        },
		methods: {
			getFile(url) {
				//#ifdef H5
				uni.request({
				    url: this.$photoHeader + 'api' + url,
					responseType: 'arraybuffer',
				    header: {
				        'Content-Type': 'application/pdf',
						'authorization': this.$store.getters.getToken
				    },
				    success: (res) => {
						// console.log(res);
						console.log(res);
						const blob = new Blob([res.data])
						const fileUrl = this.transBlobToUrl(blob)
						this.allUrl = this.viewerUrl + '?file=' + fileUrl
				    },
				});
				//#endif
				
				//#ifdef APP-VUE
					uni.downloadFile({
						url: this.$photoHeader + 'api' + url,
						header: {
						    'Content-Type': 'application/pdf',
							'authorization': this.$store.getters.getToken
						},
						success: (res) => {
							// uni.saveFile({
							// 	tempFilePath: '',
							// 	success: (res1) => {
							// 		console.log(res1.savedFilePath)
							// 		this.allUrl = this.viewerUrl + '?file=' + res1.savedFilePath
							// 	},
							// 	fail: (err) => {
							// 		console.log(err);
							// 	}
							// });
							this.allUrl = this.viewerUrl + '?file=../../../../' + res.tempFilePath.substr(1)
						}
					})
				//#endif
			},
			transBlobToUrl(file) {
			  // 将获取的blob转化为url
			  // console.log(file);
			  let url = null;
				if (window.createObjectURL != undefined) { // basic
				  url = window.createObjectURL(file);
				} else if (window.webkitURL != undefined) { // webkit or chrome
				  try {
					url = window.webkitURL.createObjectURL(file);
				  } catch (error) {
					console.log(error)
				  }
				} else if (window.URL != undefined) { // mozilla(firefox)
				  try {
					url = window.URL.createObjectURL(file);
				  } catch (error) {
					  console.log(1);
					console.log(error)
				  }
				}
				return url;
			},
		},
        onLoad(options) {
			let {url, title} = options
			uni.setNavigationBarTitle({
				title: title
			})
			this.getFile(decodeURIComponent(url))
			
          }
    }
</script>

<style>

</style>