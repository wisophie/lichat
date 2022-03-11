<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		// onShow: function() {
		// 	console.log('App Show')
		// },
		// onHide: function() {
		// 	console.log('App Hide')
		// }
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	.uni-tabbar{
		 background-color:#FFFFFF !important;
		 .uni-tabbar-border { // tabBar 上边框
		                 background-color: 0px 1px 0px 0px rgba(0, 0, 0, 0.1)!important; // tabBar 上边框的颜色
		             }
		 .uni-tabbar__label { // tabBar 文字
		                    font-size: 16px !important;
		                }
	}
</style>
