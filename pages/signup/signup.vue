<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="toLogin">
				<image src="../../static/images/common/back.png" class="backimg"></image>
			</view>
		</view>
		<view class="logo">
			<image src="../../static/images/img/enterprise.jpg" ></image>
		</view>
		<view class="main">
			<view class="title">注册</view>
			<view class="slogan">您好,欢迎注册lichat!</view>
			<view class="inputs">
				<view class="inputs-div">
					<input type="text" @blur="matchUser" placeholder="请输入用户名" placeholder-style="color:#ccc"/>
					<view class="ocupy" v-if="userocupy">用户名已占用</view>
					<image src="../../static/images/sign/right1.png" class="ok" v-if="isuser" ></image>
				</view>
				<view class="inputs-div">
					<input type="text" @blur="isEmail" placeholder="请输入邮箱" placeholder-style="color:#ccc"/>
					<view class="ocupy" v-if="emailocupy">邮箱已占用</view>
					<view class="einvalid" v-if="einvalid">邮箱无效</view>
					<image src="../../static/images/sign/right1.png" class="ok" v-if="isemail" ></image>
				</view>
				<view class="inputs-div">
					<input :type="type" @input="getPwd" placeholder="请输入密码" placeholder-style="color:#ccc"/>
					<image :src="lookurl"  class="look" @tap="looks"></image>
					
				</view>
				
			</view>
			
		</view>
		<view :class="[{submit:isok},{submit1:!isok}]" @tap="signUp">注册</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type:'password',
				isuser:false,
				isemail:false,
				look:false,
				einvalid:false,
				userocupy:false,
				emailocupy:false,
				lookurl:'../../static/images/sign/biyan.png',
				email:'',
				username:'',
				password:'',
				isok:false
			}
		},
		methods: {
			//返回到登陆页面
			toLogin:function(){
				uni.navigateBack({
				    delta:1
				});
			},
			//密码显示开关
			looks:function(){
				if(this.look){
					this.type="password"
					this.look=!this.look
					this.lookurl='../../static/images/sign/biyan.png'
				}else{
					this.type="text"
					this.look=!this.look
					this.lookurl='../../static/images/sign/look.png'
				}
			},
			//判断是否是邮箱格式
			isEmail:function(e){
				let reg= /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
				this.email=e.detail.value;
				if(this.email.length>0){
					if(reg.test(this.email)){
						this.einvalid=false
						//后端验证邮箱是否占用
						this.matchMail();
					}else{
						this.einvalid=true;
						this.emailocupy=false;
						this.isemail=false;
					}
				}else{
					this.einvalid=false;
					this.emailocupy=false;
					this.isemail=false;
				}
				this.isOk()
			},
			//后端匹配邮箱
			matchMail:function(){
					uni.request({
						url:this.serverUrl+'/signup/judge',
						data:{
							data:this.email,
							type:'email',
						},
						method:'POST',
						success:(data)=>{
							let status=data.data.status;
							if(status==200){
								let res=data.data.result;
								if(res>0){
								//表示邮箱已存在
								this.emailocupy=true;
								this.isemail=false;
								}else{
									this.emailocupy=false;
									this.isemail=true;
								}
								this.isOk()
							}else if(status==500){
								uni.showToast({
								    title: '服务器出错',
									icon:'none',
								    duration: 2000
								});
							}
						}
					})
			},
			//匹配用户名
			matchUser:function(e){
				this.username=e.detail.value;
				if(this.username.length>0){
					uni.request({
						url:this.serverUrl+'/signup/judge',
						data:{
							data:this.username,
							type:'name',
						},
						method:'POST',
						success:(data)=>{
							let status=data.data.status;
							if(status==200){
								let res=data.data.result;
								if(res>0){
								//表示用户已存在
								this.userocupy=true;
								this.isuser=false;
								}else{
									this.userocupy=false;
									this.isuser=true;
								}
								this.isOk()
							}else if(status==500){
								uni.showToast({
								    title: '服务器出错',
									icon:'none',
								    duration: 2000
								});
							}
						}
					})
				}else{
					this.userocupy=false;
					this.isuser=false;
					this.isOk()
				}
				
			},
			//获取密码
			getPwd:function(e){
				this.password=e.detail.value;
				this.isOk()
			},
			//判断是否可注册了
			isOk:function(){
				if(this.isuser&&this.isemail&&this.password.length>5){
					this.isok= true;
				}else{
					this.isok=false
					}
				
			},
			// signUp:function(){
			// 	uni.navigateTo({
			// 	    url: '../login/login?username='+this.username
			// 	});
			// },
			//注册提交
			signUp:function(){
				if(this.isOk){
					uni.request({
						url:this.serverUrl+'/signup/add',
						data:{
							username:this.username,
							email:this.email,
							pwd:this.password,
						},
						method:'POST',
						success:(data)=>{
							let status=data.data.status;
							if(status==200){
								//注册成功跳转到登陆页并填写用户名
								uni.navigateTo({
								    url: '../login/login?username='+this.username
								});
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
	// 	line-height: 88rpx;
	// 	padding-top: var(--status-bar-height);
	// 	background-color: $uni-bg-color;
	// 	// box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1);
	// 	// border:1px solid red;
	
	// 	// box-sizing: border-box;
	// 	z-index: 10;
	// }

	// .top-bar-left {
	// 	float: left;
	// 	 padding-left: 32rpx;
	// 	 width: 88rpx;
	// 	 height: 88rpx;
	// 	 // border: 1px solid red;
	// 	.backimg{
	// 		margin-top: 21rpx;
	// 		width:26rpx;
	// 		height:46rpx;
			
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
		.inputs-div{
			position: relative;
			// border:1px solid red;
		}
		.ocupy,.einvalid{
			position:absolute;
			float: right;
			right: 0;
			top:40rpx;
			font-size:$uni-font-size-base ;
			font-weight: 500;
			color: $uni-color-error;
			line-height: 88rpx;
		}
		.ok{
			position:absolute;
			right: 0;
			top:75rpx;
			width: 42rpx;
			height: 32rpx;
		}
		.look{
			position:absolute;
			padding: 10rpx;
			right: 0;
			top:66rpx;
			width: 32rpx;
			height: 18rpx;
			// border:1px solid red;
		}
		
	}
	.submit{
		width: 520rpx;
		height: 96rpx;
		background: $uni-color-primary;
		box-shadow: 0 50rpx 32rpx -36rpx rgba(46, 255, 231, 0.4);
		border-radius: 48rpx;
		font-size: 32rpx;
		font-weight: 520;
		color: $uni-text-color;
		line-height: 96rpx;
		text-align: center;
		margin: 0 auto;
	}
	.submit1{
		width: 520rpx;
		height: 96rpx;
		background: $uni-bg-color-grey;
		box-shadow: 0 50rpx 32rpx -36rpx rgba(247, 255, 255, 0.4);
		border-radius: 48rpx;
		font-size: 32rpx;
		font-weight: 500;
		color: $uni-text-color-grey;
		line-height: 96rpx;
		text-align: center;
		margin: 0 auto;
	}
</style>
