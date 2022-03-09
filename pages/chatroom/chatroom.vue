<template>
	<view content>
		<view class="top-bar">
			<view class="top-bar-left" @tap="backone">
				<image src="../../static/images/common/back.png" class="backimg"></image>
			</view>
			<view class="top-bar-center">
				<view class="title">{{fname}}</view>
			</view>
			<view class="top-bar-right">
			</view>
		</view>
		<scroll-view class="chat" scroll-y="true" scroll-with-animation="true" :scroll-into-view="sintoview" @scrolltoupper="nextPage">
			<view class="chat-main" :style="{paddingBottom:inputh+'px'}">
				<view class="loading" :class="{displaynone:isloading}">
						<image class="loading-img" src="../../static/images/common/loading.png" mode="" :animation="animationData"></image>
				</view>
				<view class="chat-ls" v-for="(item,index) in msgs" :key="index" :id="'msg'+item.id">
					<view class="chat-time" v-if="item.time!=''">{{changeTime(item.time)}}</view>
					<view class="msg-m msg-left" v-if="item.fromId!=uid">
						<image class="user-img" :src="item.imgurl"></image>
						<view class="message" v-if="item.types==0">
							<view class="msg-text">{{item.message}}</view>
						</view>
						<view class="message" v-if="item.types==1">
							<image :src="item.message" class="msg-img" mode="widthFix" @tap="previewImg(item.message)"></image>
						</view>
					</view>
					<view class="msg-m msg-right" v-if="item.fromId==uid">
						<image class="user-img" :src="item.imgurl"></image>
						<view class="message" v-if="item.types==0">
							<view class="msg-text">{{item.message}}</view>
						</view>
						<view class="message" v-if="item.types==1">
							<image :src="item.message"  class="msg-img" mode="widthFix" @tap="previewImg(item.message)"></image>
						</view>
					</view>
				</view>
			
			</view>
			
		</scroll-view>
		<chatbar @inputs ="recive" @heights="heights"></chatbar>
	</view>
</template>

<script>
	import datas from '../../commons/js/datas.js';
	import myfunction from '../../commons/js/myfunction.js';
	import chatbar from '../../components/chatbar/chatbar.vue';
	export default {
		
		data() {
			return {
				uid:'',
				uimgurl:'',
				token:'',
				uname:'',
				fid:'',
				fimgurl:'',
				fname:'',
				usertype:'',   //0为一对一
				msgs: [],
				imgMsg:[],
				sintoview:'',
				oldTime:0,
				inputh:'60',
				data:{},
				animationData: {},
				nowpage:0,
				pagesize:10,
				loading:'',
				isloading:true,
				beginloading:true,
			}
		},
		onLoad(e) {
			this.fid=e.id;
			this.fname=e.name;
			this.type=e.type;
			this.fimgurl=e.img;
			this.getStorages();
			this.getMsg();
			this.receiveSocketMsg();
			//this.nextPage();
		},
		components:{
			chatbar,
		},
		methods: {
			backone: function() {
				uni.navigateBack({
					delta: 1
				});
			},
			//获取缓存数据
			getStorages:function(){
				try {
				   const value = uni.getStorageSync('user');
					if(value){
						this.uid=value.id;
						this.uimgurl=this.serverUrl+'/user/'+value.imgurl;
						this.token =value.token;
						this.uname = value.username;
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
			//处理时间
			changeTime:function(date){
				return myfunction.dateTime1(date)
			},
			//顶部滚动加载下一页
			nextPage: function(){
				if(this.nowpage>0 && this.beginloading){
					//出现loading
					this.isloading=false;
					//禁止重复加载
					this.beginloading=false;
					var animation = uni.createAnimation({
					  duration: 1000,
					    timingFunction: 'step-start',
					})
								
					this.animation = animation
								
					let i=1;
					this.loading=setInterval(function() {
					  animation.rotate(i*30).step()
					  this.animationData = animation.export()
					  i++;
					  //获取聊天数据
					  if(i>5){
						  this.getMsg(this.nowpage);
					  }
					}.bind(this), 100)
				}
				
			  },
			  //获取聊天数据
			  getMsg: function(page) {
				uni.request({
					url: this.serverUrl + '/chat/msg',
					data: {
						uid:this.uid,
						fid:this.fid,
						nowPage:this.nowpage,
						pageSize:this.pagesize,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status;
						if (status == 200) {
							let msg=data.data.result;
							console.log(msg)
							msg.reverse();
							let oldtime =msg[0].time;
							let imgarr=[];
							if(msg.length>0){
								for (var i =1; i < msg.length; i++) {
									msg[i].imgurl =this.serverUrl+'/user/'+msg[i].imgurl;
									//时间间隔
									if(i<msg.length-1){  //最后一条不做判断
										let t=myfunction.spacTime(oldtime,msg[i].time);
										if(t){
											oldtime=t;;
										}
										msg[i].time=t;
									}
									//匹配最大时间
									if(this.nowpage==0){
										if(msg[i].time>this.oldTime){
											this.oldTime=msg[i].time;
										}
									}
									//补充图片地址
									if (msg[i].types == 1) {
										msg[i].message = this.serverUrl+'/user/'+ msg[i].message;
										imgarr.push(msg[i].message)
										
									}
									//this.msgs.unshift(msg[i]);
								}
								
								msg[0].imgurl =this.serverUrl+'/user/'+msg[0].imgurl;
								this.msgs=msg.concat(this.msgs)
								this.imgMsg=imgarr.concat(this.imgMsg);
							}
							
							//判断nowPage
							if(msg.length==10){
								
								this.nowpage++;
							}else{
								this.nowpage=-1;
							}
							//页数加1
							this.$nextTick(function(){
								this.sintoview='msg'+this.msgs[msg.length-1].id;
								
							})
							clearInterval(this.loading)
							//关闭loading
							this.isloading=true;
							//开启加载
							this.beginloading=true;
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
			//获取聊天数据
			getMsg1: function(page) {
			
				let msg = datas.message();
				let maxpages=msg.length;
				if(msg.length>(page+1)*10){
					maxpages=(page+1)*10;
					//页数加1
					this.nowpage++;
				}else{
					this.nowpage=-1;
				}
				for (var i =page*10; i < maxpages; i++) {
					msg[i].imgurl = '../../static/images/img/' + msg[i].imgurl;
					//时间间隔
					if(i<msg.length-1){  //最后一条不做判断
						let t=myfunction.spacTime(this.oldTime,msg[i].time);
						if(t){
							this.oldTime=t;;
						}
						msg[i].time=t;
					}
					
					if (msg[i].types == 1) {
						msg[i].message = '../../static/images/img/' + msg[i].message;
						this.imgMsg.unshift(msg[i].message);
					}
					this.msgs.unshift(msg[i]);
				}
				//页数加1
				this.$nextTick(function(){
					this.sintoview='msg'+this.msgs[maxpages-page*10-1].tip;
					
				})
				clearInterval(this.loading)
				//关闭loading
				this.isloading=true;
				//开启加载
				this.beginloading=true;
				// console.log(this.msgs)
			},
			//预览图片
			previewImg:function(e){
				//获取点击图片索引
				let index=0;
				for (let i = 0; i < this.imgMsg.length; i++){
					if(this.imgMsg[i]==e)
					index=i
				}
				
				uni.previewImage({
							current:index,
				            urls:this.imgMsg,
				            longPressActions: {
				                itemList: ['发送给朋友', '保存图片', '收藏'],
				                success: function(data) {
				                    console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
				                },
				                fail: function(err) {
				                    console.log(err.errMsg);
				                }
				            }
				        });
			},
			//接收chatbar输入内容
			recive:function(e){
				this.reciveMsg(e,this.uid,this.uimgurl,0)
			},
			//接收文字,显示到聊天页面
			reciveMsg:function(e,id,img,tip){
				//tip=0表示自己发的,tip=1
				let len =this.msgs.length;
				let nowTime=new Date();
				let t=myfunction.spacTime(this.oldTime,nowTime);
				if(t){
					this.oldTime=t;;
				} 
				nowTime=t;
				let data = {
					fromId:id,       //发送者id
					imgurl:img,
					message:e.message,
					types:e.types,
					time:nowTime,
					id:len,
				};
				this.msgs.push(data);
				
				//接收图片显示
				if(e.types==1){
					this.imgMsg.push(e.message);
				}
				//socket文字提交
				if(e.types==0){
					//
					this.sendSocket(e);
				}
				this.$nextTick(function(){
					this.sintoview='msg'+len;
					})
			},
			//聊天数据提交
			sendSocket:function(e){
				if(this.usertype==0){
					this.socket.emit('msg',e,this.uid,this.fid)
				}else{
					//群发
					this.socket.emit('groupMsg',e,this.uid,this.fid)
				}
			},
			//socket聊天数据接收
			receiveSocketMsg:function(){
				this.socket.on('msg',(msg,fromid,tip)=>{
					if(fromid==this.fid && tip==0){
						let len =this.msgs.length;
						let nowTime=new Date();
						let t=myfunction.spacTime(this.oldTime,nowTime);
						if(t){
							this.oldTime=t;;
						} 
						nowTime=t;
						let data = {
							fromId:fromid,       //发送者id
							imgurl:this.fimgurl,
							message:msg.message,
							types:msg.types,
							time:nowTime,
							id:len,
						};
						this.msgs.push(data);
						// if(msg.types==1){
						// 	this.imgMsg.push(e.message);
						// }
						this.$nextTick(function(){
							this.sintoview='msg'+len;
							})
					}
					
					// console.log(msg+'是'+fromid)
				})
			},
			//接收高度
			heights:function(e){
				this.inputh=e;
				this.goBottom();
			},
			//滚动到底部
			goBottom:function(){
				this.sintoview='';
				this.$nextTick(function(){
					this.sintoview='msg'+this.msgs[this.msgs.length-1].id;
				})
			}
			
		}
	}
</script>

<style lang="scss">
	@import "../../commons/css/mycss.scss";
	page {
		height: 100%;
		background: rgba(244, 244, 244, 0.96);
	}
// .content{
// 	height: 100%;
// 	background: rgba(244, 244, 244, 0.96);
// }
	.top-bar {
		background: rgba(244, 244, 244, 0.96);
		box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1);
	}
	
	.chat {
		height: 100vh;
		.loading{
			text-align: center;
			.loading-img{
				height: 60rpx;
				width: 60rpx;
			}
		}
		.chat-main {
			padding-left: $uni-spacing-col-base;
			padding-right: $uni-spacing-col-base;
			padding-top: 100rpx;
			// padding-bottom: 120rpx;
			display: flex;
			flex-direction: column;
		}

		.chat-ls {
			.chat-time {
				font-size: $uni-font-size-sm;
				color: $uni-text-color-disable;
				line-height: 34rpx;
				padding: 20rpx 0;
				text-align: center;
			}

			.msg-m {
				display: flex;
				padding: 20rpx 0;
				// border:1px solid red;
				.user-img {
					// flex: none;
					width: $uni-img-size-sm;
					height: $uni-img-size-sm;
					border-radius: $uni-border-radius-base;
				}

				.message {
					// flex: none;
					max-width: 480rpx;

					.msg-text {
						font-size: $uni-font-size-lg;
						color: $uni-text-color;
						line-height: 44rpx;
						padding: 18rpx 24rpx;
					}
					.msg-img{
						max-width: 400rpx;
						border-radius:$uni-border-radius-base ;
					}
				}

			}

			.msg-left {
				flex-direction: row;

				.msg-text {
					margin-left: 16rpx;
					background-color: #fff;
					border-radius: 0 20rpx 20rpx 20rpx;
				}
				.msg-img{
					margin-left:16rpx;
				}
			}

			.msg-right {
				flex-direction: row-reverse;

				.msg-text {
					margin-right: 16rpx;
					// background-color: #ffcf3d;
					// background-color: #ffb183;
					background-color: $uni-color-primary;
					border-radius: 20rpx 0 20rpx 20rpx;
				}
				.msg-img{
					margin-right:16rpx;
				}
			}
		}
	}
	.displaynone{
		display: none;
	}
</style>
