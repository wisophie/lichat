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
					<view class="reject btn" @tap="refuse(item.id)">拒绝</view>
					<view class="header-img">
						<image :src="item.imgurl" mode=""></image>
					</view>
					<view class="agree btn" @tap="agree(item.id)">同意</view>
				</view>
				<view class="request-center">
					<view class="title">{{item.name}}</view>
					<view class="time">{{changeTime(item.lastTime)}}</view>
				</view>
				<view class="notice">
					<text>留言:</text>
					{{item.msg}}
				</view>
			</view>
		
		</view>
	</view>
</template>

<script>
	import myfunction from '../../commons/js/myfunction.js';
	export default {
		data() {
			return {
				friends:[],
				uid:'',
				token:'',
				myname:'',
			}
		},
		onLoad(){
			this.getStorages();
			this.friendRequest();
		},
		methods: {
			
			getStorages:function(){
				try {
				   const value = uni.getStorageSync('user');
					if(value){
						this.uid=value.id;
						// this.imgurl=this.serverUrl+'/user/'+value.imgurl;
						this.token =value.token;
						this.myname = value.username;
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
			friendRequest: function() {
				uni.request({
					url: this.serverUrl + '/index/getfriends',
					data: {
						uid: this.uid,
						state:1,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status;
						if (status == 200) {
							let res=data.data.result;
							for(let i=0;i<res.length;i++){
								res[i].imgurl=this.serverUrl+'/user/'+res[i].imgurl;
								this.friendMsg(res,i)
							}
							this.friends=res;
						 //console.log(res)
						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错',
								icon: 'none',
								duration: 2000
							});
						}else if (status == 300) {
							//token过期
							uni.navigateTo({
							    url: '../login/login?name='+this.myname,
							});
						}
					}
				})
				
			},
			//获取留言
			friendMsg: function(arr,i) {
				uni.request({
					url: this.serverUrl + '/index/getonemsg',
					data: {
						uid: this.uid,
						fid:arr[i].id,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status;
						if (status == 200) {
							let res=data.data.result;
							let e=arr[i];
							e.msg=res.message;
							arr.splice(i,1,e);
						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错',
								icon: 'none',
								duration: 2000
							});
						}else if (status == 300) {
							//token过期
							uni.navigateTo({
							    url: '../login/login?name='+this.myname,
							});
						}
					}
				})
				
			},
			//拒绝好友
			refuse: function(fid) {
				uni.request({
					url: this.serverUrl + '/friend/deletefriend',
					data: {
						uid: this.uid,
						fid:fid,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status;
						console.log(status)
						if (status == 200) {
							for(let i=0;i<this.friends.length;i++){
								if(this.friends[i].id==fid){
									this.friends.splice(i,1);
								}
							}
							
						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错',
								icon: 'none',
								duration: 2000
							});
						}else if (status == 300) {
							//token过期
							uni.navigateTo({
							    url: '../login/login?name='+this.myname,
							});
						}
					}
				})
				
			},
			//同意好友申请
			agree: function(fid) {
				uni.request({
					url: this.serverUrl + '/friend/updatefriendstate',
					data: {
						uid: this.uid,
						fid:fid,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status;
						console.log(status)
						if (status == 200) {
							for(let i=0;i<this.friends.length;i++){
								if(this.friends[i].id==fid){
									this.friends.splice(i,1);
								}
							}
							uni.showToast({
								title: '添加好友成功',
								icon: 'none',
								duration: 2000
							});
						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错',
								icon: 'none',
								duration: 2000
							});
						}else if (status == 300) {
							//token过期
							uni.navigateTo({
							    url: '../login/login?name='+this.myname,
							});
						}
					}
				})
				
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
