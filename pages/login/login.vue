<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-right" @tap="toSignUp">
				<view class="text" >注册</view>
			</view>
		</view>
		<view class="logo">
			<image src="../../static/images/img/enterprise.jpg" ></image>
		</view>
		<view class="main">
			<view class="title">登录</view>
			<view class="slogan">您好,欢迎来到lichat!</view>
			<view class="inputs">
				<input type="text" @blur="getUser" placeholder="用户名/邮箱" placeholder-style="color:#ccc"/>
				<input type="password" @blur="getPwd" placeholder="密码" placeholder-style="color:#ccc"/>
			</view>
			<view class="tips">输入用户名或密码错误</view>
		</view>
		<view class="submit" @tap="testFunc">登录</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username:'',
				password:''
			}
		},
		methods: {
			//后台链接测试
			testFunc:function(){
				uni.request({
					url:'http://192.168.2.2:3000/mail',
					data:{
						mail:this.username,
					},
					method:'POST',
					success:(data)=>{
						console.log(data);
					}
				})
			},
			//跳转到注册页面
			toSignUp:function(){
				uni.navigateTo({
				    url: '../signup/signup'
				});
			},
			//获取用户名邮箱
			getUser:function(e){
				this.username=e.detail.value;
			},
			//获取密码
			getPwd:function(e){
				this.password=e.detail.value;
			},
			//登录提交
			login:function(){
				
				if(this.username&&this.password)
				console.log('tijio')
			}
			

		}
	}
</script>

<style lang="scss">
	@import "../../commons/css/mycss.scss";
	// .content {
		
	// 	padding-top: var(--status-bar-height);
	// }

	// .top-bar {
	// 	position: fixed;
	// 	top: 0;
	// 	left: 0;
	// 	width: 100%;
	// 	height: 88rpx;
	// 	padding-top: var(--status-bar-height);
	// 	line-height: 88rpx;
	// 	background-color: $uni-bg-color;
	// 	// box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1);
	// 	// border:1px solid red;
	
	// 	// box-sizing: border-box;
	// 	z-index: 10;
	// }

	// .top-bar-right {
	// 	float: right;
	// 	 padding:0 32rpx;
	// 	 // border:1px solid red;
	// 	.text{
	// 		font-size: $uni-font-size-lg;
	// 		font-weight: 500;
	// 		color: $uni-text-color;
	// 	}
	// }
	.logo {
		text-align: center;
		image{
			padding-top: 256rpx;
			width: 300rpx;
			height: 200rpx;
			margin:0 auto;
		}
		
	}
	.main{
		padding: 54rpx $uni-spacing-row-lg 120rpx;
		// width: 100%;
		// border:1px solid red;
		.title{
			font-size: 56rpx;
			font-weight: 500;
			color:$uni-text-color;
			line-height: 80rpx;
		}
		.slogan{
			font-size: 40rpx;
			color:$uni-text-color-grey;
			line-height:56rpx;
		}
		.inputs{
			padding-top: 8rpx;
			input{
				padding-top: 40rpx;
				height: 88rpx;
				font-size: $uni-font-size-lg;
				font-weight: 500;
				color:$uni-text-color ;
				line-height: 88rpx;
				border-bottom: 1px solid $uni-border-color;
			}
		}
		.tips{
			float: left;
			font-size: $uni-font-size-base;
			color:$uni-color-error ;
			line-height: 56rpx;
		}
	}
	.submit{
		width: 520rpx;
		height: 96rpx;
		background: $uni-color-primary;
		box-shadow: 0 50rpx 32rpx -36rpx rgba(140, 157, 158, 0.4);
		border-radius: 48rpx;
		font-size: 32rpx;
		font-weight: 500;
		color: $uni-text-color;
		line-height: 96rpx;
		text-align: center;
		margin: 0 auto;
	}
</style>
