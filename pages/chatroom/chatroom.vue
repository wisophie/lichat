<template>
	<view content>
		<view class="top-bar">
			<view class="top-bar-left" @tap="backone">
				<image src="../../static/images/common/back.png" class="backimg"></image>
			</view>
			<view class="top-bar-center">
				<view class="title">
					小明
				</view>
			</view>
			<view class="top-bar-right">
			</view>
		</view>
		<scroll-view class="chat" scroll-y="true" scroll-with-animation="true" :scroll-into-view="sintoview">
			<view class="chat-main" :style="{paddingBottom:inputh+'px'}">
				<view class="chat-ls" v-for="(item,index) in msgs" :key="index" :id="'msg'+item.tip">
					<view class="chat-time" v-if="item.time!=''">{{changeTime(item.time)}}</view>
					<view class="msg-m msg-left" v-if="item.id!='b'">
						<image class="user-img" :src="item.imgurl"></image>
						<view class="message" v-if="item.types==0">
							<view class="msg-text">{{item.message}}</view>
						</view>
						<view class="message" v-if="item.types==1">
							<image :src="item.message" class="msg-img" mode="widthFix" @tap="previewImg(item.message)"></image>
						</view>
					</view>
					<view class="msg-m msg-right" v-if="item.id=='b'">
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
				msgs: [],
				imgMsg:[],
				sintoview:'',
				oldTime:new Date(),
				inputh:'60',
				data:{}
			}
		},
		onLoad() {
			this.getMsg();
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
			//处理时间
			changeTime:function(date){
				return myfunction.dateTime1(date)
			},
			getMsg: function() {
				let msg = datas.message();
				for (var i = 0; i < msg.length; i++) {
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
				}this.$nextTick(function(){
					this.sintoview='msg'+this.msgs[i-1].tip;
					
				})
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
			//接收文字,显示到聊天页面
			recive:function(e){
				let len =this.msgs.length;
				let data = {
					id:'b',
					imgurl:'../../static/images/img/one.png',
					message:e.message,
					types:e.types,
					time:new Date(),
					tip:len,
				};
				this.msgs.push(data);
				this.$nextTick(function(){
					this.sintoview='msg'+len;
					})
				if(e.types==1){
					this.imgMsg.push(e.message);
				}
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
					this.sintoview='msg'+this.msgs[this.msgs.length-1].tip;
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
</style>
