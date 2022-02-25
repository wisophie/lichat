<template>
	<view>
		<view class="submit-m">
			<view class="submit-chat">
				<view class="bt-img" @tap="records">
					<image :src="toc"></image>
				</view>
				<textarea class="chat-send btn" @input="inputs" v-model="msg" @focus="focus" :class="{displaynone:isrecord}" auto-height="true"></textarea>
				<view class="record btn" :class="{displaynone:!isrecord}">按住说话</view>
				<view class="bt-img" @tap="emoji">
					<image src="../../static/images/submit/bq.png"></image>
				</view>
				<view class="bt-img" @tap="moreFunc">
					<image src="../../static/images/submit/tj.png"></image>
				</view>
			</view>
			<view class="emoji" :class="{displaynone:isemoji}">
				<view class="emoji-send">
					<view class="emoji-send-del" @tap="emojiBack">
						<image src="../../static/images/submit/back.png" mode=""></image>
					</view>
					<view class="emoji-send-btn" @tap="emojiSend">发送</view>
				</view>
				<emoji @emotion="emotion" :height="260"></emoji>
			</view>
			<view class="more" :class="{displaynone:ismore}">
				<view class="more-list" @tap="sendImg('album')">
					<image src="../../static/images/submit/tp.png"></image>
					<view class="more-list-title">图片</view>
				</view>
				<view class="more-list" @tap="sendImg('camera')">
					<image src="../../static/images/submit/pz.png"></image>
					<view class="more-list-title">拍照</view>
				</view>
				<view class="more-list">
					<image src="../../static/images/submit/dw.png"></image>
					<view class="more-list-title">定位</view>
				</view>
				<view class="more-list">
					<image src="../../static/images/submit/sp.png"></image>
					<view class="more-list-title">视频</view>
				</view>
				<view class="more-list">
					<image src="../../static/images/submit/wj.png"></image>
					<view class="more-list-title">文件</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	import emoji from '../emoji/emoji.vue';
	export default {
		data() {
			return {
				isrecord:false,
				isemoji:true,
				ismore:true,
				msg:'',
				toc:"../../static/images/submit/yy.png"
			}
		},
		components:{
			emoji,
		},
		methods: {
			//获取聊天框高度
			getElementStyle:function(){
				const query = uni.createSelectorQuery().in(this);
				query.select('.submit-m').boundingClientRect(data => {
				  this.$emit('heights',data.height);
				}).exec();
			},
			//切换语音
			records:function(){
				this.isemoji=true;
				this.ismore=true;
				setTimeout(()=>{  //获取高度
					this.getElementStyle();;
				},10)
				if(this.isrecord){
					this.isrecord =false;
					this.toc="../../static/images/submit/yy.png"
				}else{
					this.isrecord =true;
				this.toc="../../static/images/submit/jp.png"
				}
			},
			//切换表情
			emoji:function(){
				this.isemoji=!this.isemoji;
				 this.ismore=true;
				setTimeout(()=>{  //获取高度
					this.getElementStyle();;
				},10)
				
			},
			//接收表情
			emotion:function(e){
				this.msg=this.msg+e;
			},
			//文字发送
			inputs:function(e){
				var chatm = e.detail.value;
				var pos = chatm.indexOf('\n');
				if(pos!=-1 && chatm.length>1){
					this.send(this.msg,0)
					    
				}
			},
			//点击输入框收回表情
			focus:function(){
				this.isemoji=true;
				setTimeout(()=>{  //获取高度
					this.getElementStyle();;
				},10)
				
			},
			//表情内的发送
			emojiSend:function(){
				if(this.msg.length>0){
					this.send(this.msg,0)
					    
				}
			},
			emojiBack:function(){
				if(this.msg.length>0){
					this.msg=this.msg.substring(0,this.msg.length-1);
  
				}
			},
			//更多功能
			moreFunc:function(){
				this.ismore=!this.ismore;
				this.isemoji=true;
				setTimeout(()=>{  //获取高度
					this.getElementStyle();;
				},10)
			},
			//发送图片
			sendImg:function(e){
				let count=9;
				if(e=='album'){
					count=9;
				}else{
					count=1;
				}
				uni.chooseImage({
				    count: count, //默认9
				    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: [e], //从相册选择
				    success: (res)=> {  //箭头函数this指向当前组建
						const filePaths=res.tempFilePaths;
				        for(let i=0;i<filePaths.length;i++){
							this.send(filePaths[i],1)
						}
				    }
				});
			},
			//发送
			send:function(msg,type){
				let data={
					message:msg,
					types:type,
				}
				this.$emit('inputs',data);
				setTimeout(()=>{  //清空聊天框
					this.msg='';
				},0)
			}
		}
	}
</script>

<style lang="scss">
	.submit-m {
		position: fixed;
		background: rgba(244, 244, 244, 0.96);
		border-top: 1px solid $uni-border-color;
		width: 100%;
		bottom: 0;
		z-index: 100;
		// border: 1px solid red;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.submit-chat {
		width: 100%;
		display: flex;
		align-items: flex-end;
		box-sizing: border-box;
		padding: 14rpx 14rpx;
		image {
			width: 56rpx;
			height: 56rpx;
			margin: 0 10rpx;
			flex: auto;
		}
		.btn{
			flex:auto;
			background-color: #fff;
			border-radius: 10rpx;
			padding: 18rpx;
			max-height: 160rpx;
			
			margin: 0 10rpx;
		}
		.chat-send{
			line-height: 44rpx;
		}
		.record{
			line-height: 44rpx;
			text-align: center;
			font-size: 32rpx;
			color: #bcbcbc;
		}
	}
	.emoji{
		width: 100%;
		height:460rpx;
		background: rgba(236,237,238,1);
		box-shadow: 0px -1rpx 0 0 rgba(0,0,0,0.1);
		.emoji-send{
			width: 300rpx;
			height: 104rpx;
			padding-top:24rpx;
			background-color: rgba(236,237,238,0.9);
			position: fixed;
			bottom:0;   //需要调整
			right:0;
			display: flex;
			.emoji-send-btn{
				flex:1;
				margin:0 32rpx 0 20rpx;
		
				height: 80rpx;
				// background: #ffcf3d;
				// background: #ffb183;
				background: #62a9ff;
				font-size: 24rpx;
				text-align: center;
				line-height: 80rpx;
				border-radius: 12rpx;
			}
			.emoji-send-del{
				flex:1;
				margin-left:24rpx ;

				height: 76rpx;
				background: #fff;
				font-size: 32rpx;
				text-align: center;
				line-height: 80rpx;
				border-radius: 12rpx;
				image{
					width: 42rpx;
					height: 32rpx;
				}
			}
		}
	}
	.more{
		width: 100%;
		height:436rpx;
		background: rgba(236,237,238,1);
		box-shadow: 0px -1rpx 0 0 rgba(0,0,0,0.1);
		bottom: env(safe-area-inset-bottom);
		padding: 8 20rpx;
		box-sizing: border-box;
		.more-list{
			width:25%;
			text-align: center;
			float:left;
			padding-top:32rpx;
			// border:1px solid red;
			image{
				width: 72rpx;
				height: 72rpx;
				padding: 24rpx;
				background:rgba(255,255,255,1);
				border-radius: 24rpx;
			}
			.more-list-title{
				font-size: 24rpx;
				color:rgba(40,40,50,0.5);
				line-height: 34rpx;
			}
		}
	}
	.displaynone{
		display: none;
	}
</style>
