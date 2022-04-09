<template>
	<view class="content">
		<view class="top-bar">
			<view class="search-div">
				<image src="../../static/images/search/search.png" class="search-image"></image>
				<input class="searchbar" type="search" @input="search" placeholder="搜索用户/群" placeholder-style="color:#ccc"/>
			</view>
			<view class="top-bar-right" @tap="backOne">
				<view class="text" >取消</view>
			</view>
		</view>
		<view class="main">
			<view class="search-user result">
				<view class="title" v-if="userarr.length>0">用户</view>
				<view class="list user" v-for="(item,index) in userarr" :key="index">
					<navigator :url="'../userhome/userhome?id='+item._id">
					<image :src="item.imgurl" ></image>
					<view class="names">
						<view class="name" v-html="item.name"></view>
						<view class="email">{{item.email}}</view>
					</view>
					</navigator>
					<view class="right-bt send" v-if="item.tip==1" @tap="tochatroom(item)">发消息</view>
					<view class="right-bt add" v-if="item.tip==0" @tap="addFriendBtn(item._id)">加好友</view>
				</view>
			</view>
		</view>
		<view class="modify" :style="{bottom:-+modifyHeight+'px'}" :animation="animationData">
			<view class="modify-header">
				<view class="close" @tap="modify">取消</view>
				<view class="title">添加好友</view>
				<view class="define" @tap="addFriendSubmit">确定</view>
			</view>
			<view class="modify-main">
				<textarea v-model="msg" class="modify-content" ></textarea>
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
				userarr:[],
				uid: '', //用户id
				fid:'',
				token: '',
				myname: '',
				msg:'',  //发送添加好友信息
				animationData: {},
				isModify: false,
				modifyHeight:'',
				
			}
		},
		onLoad() {
			this.getStorages();
		},
		onReady(){
			this.getElementStyle();
		},
		methods: {
			backone:function(){
				uni.navigateBack({
				    delta:1
				});
			},
			//获取关键词
			search:myfunction.debounce(function(e){
				this.userarr=[];
				let searchval=e.detail.value;
				if(searchval.length>0){
					this.searchUser(searchval);
				}
			},300),
			//获取缓存数据
			getStorages: function() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uid = value.id;
						this.token = value.token;
						this.myname = value.username;
					} else {
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
			//获取关键词匹配好友
			searchUser:function(e){
				uni.request({
					url: this.serverUrl + '/search/user',
					data: {
						data: e,
						token:this.token,
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status;
						if (status == 200) {
							let arr = data.data.result;
							
							for(let i=0;i<arr.length;i++){
								this.isFriend(arr[i],e);
								// if(arr[i].name.search(e) !=-1 ){
									
									
								// }
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
			//判断是否是好友
			isFriend:function(arr,e){
				let tip=0;
				let exp =eval('/'+e+'/g');
				if(arr._id==this.uid){
					tip=2;
					arr.tip=tip;
					arr.imgurl=this.serverUrl + '/user/' + arr.imgurl;
					arr.name=arr.name.replace(exp,"<span style='color:#ff9789;'>"+e+"</span>");
					this.userarr.push(arr);
				}else{
					uni.request({
						url: this.serverUrl + '/search/isfriend',
						data: {
							uid:this.uid,
							fid:arr._id,
							token:this.token,
						},
						method: 'POST',
						success: (data) => {
							let status = data.data.status;
							if (status == 200) {
								//是好友
								tip=1;
							}else if(status == 400){
								//不是好友
								
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
							arr.tip=tip;
							arr.imgurl=this.serverUrl + '/user/' + arr.imgurl;
							arr.name=arr.name.replace(exp,"<span style='color:#ff9789;'>"+e+"</span>");
							this.userarr.push(arr);
						}
						
					})
				}
				
				
			},
			getElementStyle: function() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.modify').boundingClientRect(data => {
					
					this.modifyHeight = data.height;
				}).exec();
			},
			//修改项动画
			modify:function(){
				
				
				this.isModify=!this.isModify;
				var animation = uni.createAnimation({
					duration: 300,
					timingFunction: 'ease',
				})
				if(this.isModify){
					animation.bottom(0).step()
				}else{
					animation.bottom(-this.modifyHeight).step()
				}
				this.animationData = animation.export()
			},
			//添加好友按钮
			addFriendBtn:function(fid){
				this.fid=fid;
				this.msg= this.myname+' 请求添加好友';
				this.modify();
			},
			//确定添加好友
			addFriendSubmit:function(){
			    if(this.msg.length>0){
					this.modify();
					uni.request({
						url: this.serverUrl + '/friend/applyfriend',
						data: {
							uid:this.uid,
							fid:this.fid,
							token:this.token,
							msg:this.msg,
						},
						method: 'POST',
						success: (data) => {
							let status = data.data.status;
							if (status == 200) {
								//好友
								
								uni.showToast({
									title: '好友请求发送成功',
									icon: 'none',
									duration: 2000
								});
							}else if (status == 500) {
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
				}
			},
			backOne:function(){
				uni.navigateBack({
				    delta:1
				});
			},
			tochatroom:function(item){
				uni.navigateTo({
				    url: '../chatroom/chatroom?id='+item._id+'&name='+item.name+'&img='+item.imgurl+'&type=0',
				});
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
	.modify{
		position:fixed;
		z-index: 1005;
		left:0;
		height: 100%;
		width: 100%;
		background-color: #FFFFFF;
		.modify-header{
			width: 100%;
			height: 88rpx;
			padding-top: var(--status-bar-height);
			display:flex;
			flex-direction: row;
			align-items: center;
			border-bottom: 1px solid $uni-border-color;
			.close{
				padding-left:32rpx;
				font-size:$uni-font-size-lg;
				color: $uni-text-color;
				line-height: 44rpx;
			}
			.title{
				flex:auto;
				text-align: center;
				font-size:40rpx;
				color: $uni-text-color;
				line-height: 88rpx;
			}
			.define{
				padding-right:32rpx;
				font-size:$uni-font-size-lg;
				color: $uni-text-color;
				line-height: 44rpx;
			}
		}
		.modify-main{
			display: flex;
			padding: $uni-spacing-col-base;
			flex-direction: column;
			.modify-pwd{
				flex: auto;
				margin-bottom: $uni-spacing-col-base;
				padding: 0 20rpx;
				height:88rpx;
				box-sizing: border-box;
				background: $uni-border-color;
				border-radius: $uni-border-radius-base;
				font-size:$uni-font-size-lg;
				color: $uni-text-color;
				line-height: 88rpx;
			}
			.modify-content{
				flex:auto;
				padding: 16rpx 22rpx;
				width: 100%;
				height: 386rpx;
				box-sizing: border-box;
				background: $uni-border-color;
				border-radius: $uni-border-radius-base;
				font-size:$uni-font-size-lg;
				color: $uni-text-color;
				line-height: 44rpx;
			}
		}
	}
</style>
