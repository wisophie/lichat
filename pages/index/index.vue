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
			
			<view class="noone" v-if="noone">
				<image src="../../static/images/index/noone.png" mode="aspectFit"></image>
				<view class="no-title">你还没有好友</view>
				<view class="search-bt" @tap="tosearch">搜索好友</view>
			</view>
			<view class="refresh" v-if="refresh">
				<image src="../../static/images/index/refresh.png" mode=""></image>
				<view class="ref-title">下拉刷新</view>
			</view>
			<navigator url="../friendrequest/friendrequest?id=bbb" >
			<view class="friends" v-if="requestNum>0">
				<view class="friends-list">
					<view class="friends-list-l">
						<text class="tip">{{requestNum}}</text>
						<image src="../../static/images/img/login2.jpg"></image>
					</view>
					<view class="friends-list-r">
						<view class="top">
							<view class="name">好友申请</view>
							<view class="time">{{changeTime(requestTime)}}</view>
						</view>
						<view>
							<view class="chatcontent">你有新的好友请求</view>
						</view>
					</view>
				</view>
			</view>
			</navigator>
			<view class="friends">
				<view class="friends-list" v-for="(item,index) in friends" :key="item.id" @tap="tochatroom(item)">
					<view class="friends-list-l">
						<text class="tip">{{item.tip}}</text>
						<image :src="item.imgurl"></image>
					</view>
					<view class="friends-list-r">
						<view class="top">
							<view class="name">{{item.name}}</view>
							<view class="time">{{changeTime(item.lastTime)}}</view>
						</view>
						<view>
							<view class="chatcontent">{{item.msg}}</view>
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
				myname:'',
				requestNum:0,
				requestTime:'',
				refresh:true,//下拉刷新判断
				noone:false
			}
		},
		onShow() {
			
		},
		onLoad() {
			this.getStorages();
			this.getFriends();
			this.friendRequest();
			this.join(this.uid);
			this.receiveSocketMsg();
			// this.getFriends1();
		},
		onPullDownRefresh() {
				this.friends=[],
				this.getStorages();
				this.getFriends();
				this.friendRequest();
				setTimeout(function () {
					uni.stopPullDownRefresh();
				}, 1000);
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
			getFriends1: function() {
				this.friends = datas.friends();
				for(let i=0;i<this.friends.length;i++){
					this.friends[i].imgurl='../../static/images/img/'+this.friends[i].imgurl;
					}
				
			},
			//好友申请显示
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
						this.refresh=false;
						let status = data.data.status;
						if (status == 200) {
							this.noone=false;
							let res=data.data.result;
							this.requestNum=res.length;
							if(res.length>0){
								this.requestTime=res[0].lastTime;
								for(let i=0;i<res.length;i++){
									if(this.requestTime<res[i].lastTime){
										this.requestTime=res[i].lastTime;
									}
							}
							
							}
						 // console.log(res)
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
			//好友表
			getFriends: function() {
				uni.request({
					url: this.serverUrl + '/index/getfriends',
					data: {
						uid: this.uid,
						state:0,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						this.refresh=false;
						let status = data.data.status;
						if (status == 200) {
							
							this.noone=false;
							let res=data.data.result;
							if(res.length>0){
								for(let i=0;i<res.length;i++){
									res[i].imgurl=this.serverUrl+'/user/'+res[i].imgurl;
									if(res[i].markname){
										res[i].name=res[i].markname;
									}
									this.friends.push(res[i]);
								}
								this.friends=myfunction.paixu(this.friends,'lastTime',0)
								for(let i=0;i<this.friends.length;i++){
									this.getLastMsg(this.friends,i);
									this.getunread(this.friends,i);
								}
							}else{
								this.noone=true;
							}
							
							
						 // console.log(res)
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
			//群表
			// getGroups: function() {
			// 	uni.request({
			// 		url: this.serverUrl + '/index/getfriends',
			// 		data: {
			// 			uid: this.uid,
			// 			state:0,
			// 			token: this.token,
			// 		},
			// 		method: 'POST',
			// 		success: (data) => {
			// 			let status = data.data.status;
			// 			if (status == 200) {
			// 				let res=data.data.result;
			// 				for(let i=0;i<res.length;i++){
			// 					res[i].imgurl=this.serverUrl+'/user/'+res[i].imgurl;
			// 					this.friends.push(res[i]);
			// 				}
							
							
			// 			 console.log(res)
			// 			} else if (status == 500) {
			// 				uni.showToast({
			// 					title: '服务器出错',
			// 					icon: 'none',
			// 					duration: 2000
			// 				});
			// 			}else if (status == 300) {
			// 				//token过期
			// 				uni.navigateTo({
			// 				    url: '../login/login?name='+this.myname,
			// 				});
			// 			}
			// 		}
			// 	})
				
			// },
			//获取最后一条消息
			getLastMsg:function(arr,i){
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
							if(res.types==0){
								
							}else if(res.types==1){
								res.message='[图片]';
							}else if(res.types==2){
								res.message='[音频]';
							}else if(res.types==3){
								res.message='[位置]';
							}
							let e=arr[i];
							e.msg=res.message;
							arr.splice(i,1,e);
						 // console.log(res)
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
			//获取未读消息数
			getunread:function(arr,i){
				uni.request({
					url: this.serverUrl + '/index/unreadmsg',
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
							e.tip=res;
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
			//socket模块
			join:function(uid){
				// this.socket.on('connect', () => {
				//   console.log('connection created.')
				// });
				this.socket.emit('login',uid);
			},
			//socket聊天数据接收
			receiveSocketMsg:function(){
				this.socket.on('msg',(msg,fromid)=>{
					let nmsg='';
					if(msg.types==0){
						nmsg=msg.message;
					}else if(msg.types==1){
						nmsg='[图片]';
					}else if(msg.types==2){
						nmsg='[音频]';
					}else if(msg.types==3){
						nmsg='[位置]';
					}
					for(let i=0;i<this.friends.length;i++){
						if(this.friends[i].id==fromid){
							let e=this.friends[i];
							e.lastTime=new Date();
							e.msg=nmsg;
							e.tip++;
							//删除原来数据项
							this.friends.splice(i,1);
							//新消息插入到最顶部
							this.friends.unshift(e);
						}
						
					}
					
					// console.log(msg+'是'+fromid)
				})
			},
			
			tochatroom:function(data){
				uni.navigateTo({
				    url: '../chatroom/chatroom?id='+data.id+'&name='+data.name+'&img='+data.imgurl+'&type='+data.type,
				});
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
		width: 100%;
		// border: 1px solid red;
	}
	.refresh{
		text-align: center;
		padding-top:100rpx;
		border: 1px solid red;
		image{
			width: 32rpx;
			height: 32rpx;
		}
		.ref-title{
			font-size: 32rpx;
			color:#ccc;
			line-height: 40rpx;
		}
	}
	.noone{
		text-align: center;
		padding-top: 400rpx;
		image{
			height:250rpx;
			width: 158rpx;
		}
		.no-title{
			padding: 32rpx 0;
			font-size: 32rpx;
			color:#ccc;
			line-height: 40rpx;
		}
		.search-bt{
			display: inline-block;
			height:96rpx;
			width: 240rpx;
			background: $uni-color-primary;
			box-shadow: 0px 52rpx 36rpx -32rpx rgba(255, 198, 171, 0.4);
			border-radius: 48rpx;
			font-size: 32rpx;
			line-height: 96rpx;
		}
	}

	.friends-list {
		height: 96rpx;
		// width: 100%;
		padding: 16rpx $uni-spacing-col-base;
		// border: 1px solid red;
		// display: flex;
		// flex-direction: row;
		&:active{
			background-color: $uni-bg-color-grey;
			
		}
		
		.friends-list-l {
			position: relative;
			float: left;
// border: 1px solid red;
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
		.friends-list-r {
				padding-left: 128rpx;
				// flex:auto;
				// border: 1px solid red;
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
		// border: 1px solid red;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					/*显示的行数*/
					overflow: hidden;
				}
			}
	}

	
</style>
