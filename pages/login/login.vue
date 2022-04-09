<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-right" @tap="toSignUp">
				<view class="text" >注册</view>
			</view>
		</view>
		<view class="logo">
			<image src="../../static/images/img/333.jpg" @tap="testFun1"></image>
		</view>
		<view class="main">
			<view class="title">登录</view>
			<view class="slogan">您好,欢迎来到lichat!</view>
			<view class="inputs">
				<input type="text" v-model="username" placeholder="用户名/邮箱" placeholder-style="color:#ccc"/>
				<input type="password" v-model="password" placeholder="密码" placeholder-style="color:#ccc"/>
			</view>
			<view class="tips" :style="{display:wrong}">输入用户名或密码错误</view>
		</view>
		<view class="submit" @tap="login">登录</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username:'',
				password:'',
				token:'',
				wrong:'none',
			}
		},
		onLoad:function(e){
			if(e.username){
				this.username=e.username;
				uni.showToast({
				    title: '注册成功请登陆',
					icon:'none',
				    duration: 2000
				});
			}else if(e.name){
				this.username=e.name;
				uni.showToast({
				    title: '信息过期请重新登陆',
					icon:'none',
				    duration: 2000
				});
			}
		},
		methods: {
			//后台链接测试
			testFunc:function(){
				uni.request({
					url:'http://192.168.2.2:3000/login/match',
					data:{
						// id:'621a46033d2bf13559c608e0',
						data:'严大',
						// username:'严大试试',
						// email:'3333343@qq.com',
						pwd:'12345678',
						
					},
					method:'POST',
					success:(data)=>{
						this.token=data.data.back.token;
						console.log(data);
					}
				})
			},
			testFun1:function(){
				uni.request({
					url:'http://192.168.2.2:3000/index/getfriends',
					data:{
						// id:'621cdc1b886b25a22a1976b8',
						uid:'621cdc1b886b25a22a1976b8',    //小明
						// fid:'621cdc8a886b25a22a1976be',
						// msg:'申请好友6',
						//type:'sex',
						//pwd:'123456',
						state:0,
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
			//登录提交
			login:function(){
				if(this.username&&this.password)
				uni.request({
					url:this.serverUrl+'/login/match',
					data:{
						data:this.username,
						pwd:this.password,
					},
					method:'POST',
					success:(data)=>{
						let status=data.data.status;
						if(status==200){
							//登录成功
							let res=data.data.back;
							this.wrong='none';
							//存储用户信息
							try {
							    uni.setStorageSync('user', {'id':res.id,'username':res.username,'imgurl':res.imgurl,'token':res.token});
								uni.setStorageSync('token',res.token);
							} catch (e) {
							    // error
								console.log('数据存储出错')
							}
							//跳转到首页
							uni.switchTab({
							    url: '../index/index',
							});
						}else if(status==400){
							//用户匹配失败
							this.wrong='block';
							this.password='';
						}else if(status==500){
							uni.showToast({
							    title: '服务器出错',
								icon:'none',
							    duration: 2000
							});
						}
					}
				})
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
		// border:1px solid red;
		image{
			padding-top: 100rpx;
			width: 500rpx;
			height: 400rpx;
			margin:0 auto;
			// border:1px solid red;
		}
		
	}
	.main{
		padding: 10rpx $uni-spacing-row-lg 120rpx;
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
