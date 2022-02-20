<template>
	<view class="content">
		<view class="top-bar">
			<view class="search-div">
				<image src="../../static/images/search/search.png" class="search-image"></image>
				<input class="searchbar" type="search" @input="search" placeholder="搜索用户/群" placeholder-style="color:#ccc"/>
			</view>
			<view class="top-bar-right" @tap="backone">
				<view class="text" >取消</view>
			</view>
		</view>
		<view class="main">
			<view class="search-user">
				<view class="title">用户</view>
				<view class="listuser">
					<image src="" ></image>
					<view class="names">
						<view class="name">大力出奇迹</view>
						<view class="email">sfsf@qq.com</view>
					</view>
					<view class="right-bt">发送
					</view>
				</view>
				<view class="listuser">
					<image src="" ></image>
					<view class="names">
						<view class="name">大力出奇迹</view>
						<view class="email">sfsf@qq.com</view>
					</view>
					<view class="right-bt">发送
					</view>
				</view>
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
			backone:function(){
				uni.navigateBack({
				    delta:1
				});
			},
			
		}
	}
</script>

<style lang="scss">
	@import "../../commons/css/mycss.scss";
	.top-bar{
		background: rgba(255,255,255,0.96);
		box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1);
		.search-div{
			position: absolute;
			top: 0;
			left:0;
			width: 100%;
			z-index: -1;
			box-sizing: border-box;
			padding:14rpx 118rpx 14rpx $uni-spacing-col-base;
			// border: 1px solid red;
		}
		.searchbar{
			padding:0 60rpx 0 12rpx;
			height:60rpx;
			background:#e8e8e8 ;
			border-radius: 10rpx;
		}
		.search-image{
			position: absolute;
			right: 130rpx;
			top:22rpx;
			width:40rpx ;
			height:40rpx ;
		}
	}
	.main{
		
	}
</style>
