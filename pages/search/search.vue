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
			<view class="search-user result">
				<view class="title">用户</view>
				<view class="list user">
					<image src="../../static/images/img/five.png" ></image>
					<view class="names">
						<view class="name">大力出奇迹</view>
						<view class="email">sfsf@qq.com</view>
					</view>
					<view class="right-bt send">发消息</view>
				</view>
				<view class="list user">
					<image src="../../static/images/img/three.png" ></image>
					<view class="names">
						<view class="name">大力出奇迹</view>
						<view class="email">sfsf@qq.com</view>
					</view>
					<view class="right-bt add">加好友</view>
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
			search:function(){
				
			}
			
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
			top: var(--status-bar-height);
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
		padding:88rpx $uni-spacing-col-base;
		.result{
			padding-top:32rpx;
			.title{
				font-size: 44rpx;
				font-weight: 600;
				color:$uni-text-color;
				line-height: 60rpx;
			}
			.list{
				// border:1px solid red;
				padding:20rpx;
				// width: 100%;
				height: 80rpx;
				image{
					float:left;
					width: 80rpx;
					height: 80rpx;
					border-radius: 20rpx;
				}
			}
			.names{
				float:left;
				padding-left:$uni-spacing-col-base ;
				// border:1px solid red;
			}
			.name{
				font-size: 36rpx;
				color: $uni-text-color;
				line-height: 50rpx;
				
			}
			.email{
				font-size:$uni-font-size-sm;
				color:$uni-text-color ;
				line-height: 28rpx;
			}
			.right-bt{
				float:right;
				width: 120rpx;
				height: 48rpx;
				
				border-radius: 24rpx;
				font-size:$uni-font-size-sm;
				
				line-height: 48rpx;
				text-align: center;
				margin-top: 16rpx;
			}
			.send{
				background:$uni-color-primary;
				color:$uni-text-color ;
			}
			.add{
				background:rgba(74,170,255,0.1);
				color:#00aaff;
			}
		}
	}
</style>
