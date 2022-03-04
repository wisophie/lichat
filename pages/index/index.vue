<template>
	<view class="content">
		<view class="top-bar">
			<navigator :url="'../userhome/userhome?id='+uid" hover-class="none" class="top-bar-left" @tap="">
				<image :src="imgurl"></image>
			</navigator>
			<view class="top-bar-center">
				<image src="../../static/images/img/two.png"></image>
			</view>
			<view class="top-bar-right">
				<view class="search" @tap="tosearch">
					<image src="../../static/images/img/search.png"></image>
				</view>
				<view class="add">
					<image src="../../static/images/img/add.png"></image>
				</view>
			</view>
		</view>
		<view class="main">
			<navigator url="../friendrequest/friendrequest?id=bbb" >
			<view class="friends">
				<view class="friends-list">
					<view class="friends-list-l">
						<text class="tip">1</text>
						<image src="../../static/images/img/login2.jpg"></image>
					</view>
					<view class="friends-list-r">
						<view class="top">
							<view class="name">好友申请</view>
							<view class="time">13:43</view>
						</view>
						<view>
							<view class="chatcontent">s爽肤水防阿萨发晒霜s顺丰速递费谁付fsdfsfs三十fsd</view>
						</view>
					</view>
				</view>
			</view>
			</navigator>
			<view class="friends">
				<view class="friends-list" v-for="(item,index) in friends" :key="item.id">
					<view class="friends-list-l">
						<text class="tip">{{item.tip}}</text>
						<image :src="item.imgurl"></image>
					</view>
					<view class="friends-list-r">
						<view class="top">
							<view class="name">{{item.name}}</view>
							<view class="time">{{changeTime(item.time)}}</view>
						</view>
						<view>
							<view class="chatcontent">{{item.chatcontent}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import datas from '../../commons/js/datas.js';
	import myfunction from '../../commons/js/myfunction.js';
	export default {
		data() {
			return {
				friends: [],
				uid:'',
				imgurl:'',
				token:'',
			}
		},
		onShow() {
			this.getStorages();
		},
		onLoad() {
			this.getFriends();
			
		},
		methods: {
			tosearch: function() {
				uni.navigateTo({
				    url: '../search/search'
				});
				},
			changeTime:function(date){
				return myfunction.dateTime(date)
			},
			//获取缓存数据
			getStorages:function(){
				try {
				   const value = uni.getStorageSync('user');
					if(value){
						this.uid=value.id;
						this.imgurl=this.serverUrl+'/user/'+value.imgurl;
						this.token =value.token;
					}else{
						//没有用户缓存,到登录页面
						uni.navigateTo({
						    url: '../login/login'
						});
					}
				} catch (e) {
				    // error
					console.log('数据存储出错')
				}
			},
			getFriends: function() {
				this.friends = datas.friends();
				for(let i=0;i<this.friends.length;i++){
					this.friends[i].imgurl='../../static/images/img/'+this.friends[i].imgurl;
					}
				
			}
		}
	}
</script>

<style lang="scss">
	@import "../../commons/css/mycss.scss";
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		// padding-top: var(--status-bar-height);
		padding-bottom:$uni-spacing-col-base ;
	}
	.top-bar{
		background: rgba(255,255,255,0.96);
		box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1);
	}

	.main {
		padding-top: 104rpx;
		// border: 1px solid red;
	}

	.friends-list {
		height: 96rpx;
		padding: 16rpx $uni-spacing-col-base;
		&:active{
			background-color: $uni-bg-color-grey;
		}
		.friends-list-l {
			position: relative;
			float: left;

			image {
				width: 96rpx;
				height: 96rpx;
				border-radius: $uni-border-radius-base;
				background-color: $uni-color-warning;
			}

			.tip {
				position: absolute;
				z-index: 9;
				top: -8rpx;
				left: 68rpx;
				height: 36rpx;
				min-width: 20rpx;
				padding:0 8rpx;
				background: $uni-color-error;
				line-height: 36rpx;
				border-radius: 18rpx;
				font-size: $uni-font-size-sm;
				color: $uni-text-color-inverse;
				text-align: center;
			}
		}
	}

	.friends-list-r {
		padding-left: 128rpx;

		.top {
			height: 50rpx;

			.name {
				float: left;
				font-size: 36rpx;
				font-weight: 400;
				color: $uni-text-color;
				line-height: 50rpx;

			}

			.time {
				float: right;
				font-size: $uni-font-size-sm;
				color: $uni-text-color-disable;
				line-height: 50rpx;
			}
		}

		.chatcontent {
			font-size: $uni-font-size-base;
			color: $uni-text-color-grey;
			line-height: 40rpx;

			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			/*显示的行数*/
			overflow: hidden;
		}
	}
</style>
