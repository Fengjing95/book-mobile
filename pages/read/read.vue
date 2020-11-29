<template>
    <view style="width: 100%;" >
        <web-view :src="allUrl"></web-view>
    </view>
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
				uni.request({
				    url: this.$photoHeader + 'api' + url,
					responseType: 'arraybuffer',
				    header: {
				        'Content-Type': 'application/pdf',
						'authorization': this.$store.getters.getToken
				    },
				    success: (res) => {
						// console.log(res);
						const fileUrl = this.transBlobToUrl(new Blob([res.data]))
						this.allUrl = this.viewerUrl + '?file=' + fileUrl
						console.log(this.allUrl);
				    },
				});
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