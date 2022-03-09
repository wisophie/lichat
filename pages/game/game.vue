<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backone">
				<image src="../../static/images/common/back.png" class="backimg"></image>
			</view>
			<view class="top-bar-center">
				<view class="title">宁海麻将</view>
			</view>
			<view class="top-bar-right">
			</view>
		</view>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	@import "../../commons/css/mycss.scss";
	.top-bar {
		background: rgba(244, 244, 244, 0.96);
		box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1);
	}

</style>
