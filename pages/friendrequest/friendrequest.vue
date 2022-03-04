<template>
	<view content>
		<view class="top-bar">
			<view class="top-bar-left" @tap="backone">
				<image src="../../static/images/common/back.png" class="backimg"></image>
			</view>
			<view class="top-bar-center">
				<view class="title">
					好友请求
				</view>
			</view>
			<view class="top-bar-right">
			</view>
		</view>
		<view class="main">
			<view class="requester" v-for="(item,index) in friends" :key="item.id">
				<view class="request-top">
					<view class="reject btn">拒绝</view>
					<view class="header-img">
						<image :src="item.imgurl" mode=""></image>
					</view>
					<view class="agree btn">同意</view>
				</view>
				<view class="request-center">
					<view class="title">{{item.name}}</view>
					<view class="time">{{changeTime(item.time)}}</view>
				</view>
				<view class="notice">
					<text>留言:</text>
					你好,请求加你为好友.谢谢你的通过.
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
				friends:[],
			}
		},
		onLoad(){
			this.getRequesters();
		},
		methods: {
			getRequesters: function() {
				this.friends = datas.friends();
				for(let i=0;i<this.friends.length;i++){
					this.friends[i].imgurl='../../static/images/img/'+this.friends[i].imgurl;
					}
				
			},
			//处理时间
			changeTime:function(date){
				return myfunction.detailTime(date)
			},
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
   }
   .main{
	   padding:108rpx 32rpx;
	   .requester{
		   margin:112rpx 0 20rpx;
		   padding:32rpx;
		   background: #FFFFFF;
		   box-shadow: 0px 24rpx 64rpx -8rpx rgba(0, 0, 0, 0.1);
		   border-radius:$uni-border-radius-base;
		   // border: 1px solid red;
	   }
	   .request-top{
		   display: flex;
		   flex-direction: row;
		   .btn{
			   flex:none;
			   text-align: center;
			   width: 160rpx;
			   height: 64rpx;
			   line-height: 64rpx;
			   background: rgba(255,93,91,0.1);
			   border-radius: 40rpx;
			   font-size: 32rpx;
		   }
		   .reject{
			   color:$uni-color-error;
			   background: rgba(255,93,91,0.1);
		   }
		   .agree{
			   color:$uni-text-color;
			   background: $uni-color-primary;
		   }
		   .header-img{
			   margin-top: -102rpx;
			   flex:auto;
			   text-align: center;
			   // border: 1px solid red;
		   image{ 
				  width: 144rpx;
				  height: 144rpx;
				  border-radius: 50%;
				  background-color: $uni-color-primary;
			   }
		   }
			   
		   
		   
	   }
	   .request-center{
		   text-align: center;
		   padding-top:20rpx;
		   padding-bottom:30rpx;
		   .title{
			   font-size:36rpx;
			   font-weight: 500;
			   line-height: 50rpx;
		   }
		   .time{
			   font-size:$uni-font-size-sm ;
			   color: $uni-text-color-grey;
			   line-height: 34rpx;
		   }
		   
	   }
	   .notice{
		   padding:20rpx 16rpx ;
		   border-radius:$uni-border-radius-base ;
		   background-color:#eaeaea;
		   font-size: 32rpx; 
		   line-height: 40rpx;
		   // border: 1px solid red;
	   }
   }
</style>
