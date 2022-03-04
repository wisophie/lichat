<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backone">
				<image src="../../static/images/common/back.png" class="backimg"></image>
			</view>
			<view class="top-bar-right" @tap="">
				<view class="more-img" v-if="relation==0||relation==1">
					<image src="../../static/images/userhome/more.png"></image>
				</view>

			</view>
		</view>
		<view class="bg">
			<view class="bg-white" :animation="animationData4"></view>
			<image class="bg-img" :src="user.imgurl" mode="aspectFill"></image>
		</view>
		<view class="main">
			<view class="user-header">
				<view class="sex" :style="{background: sexBg}" :animation="animationData3">
					<image :src="seximg"></image>
				</view>
				<image class="user-img" :src="user.imgurl" mode="aspectFill" :animation="animationData2"></image>
			</view>
			<view class="user-imf">
				<view class="name">{{markname}}</view>
				<view class="nick">昵称:{{user.name}}</view>
				<view class="intro">{{user.explain}}</view>
			</view>
		</view>
		<view class="button-bar">
			<view class="btn1 btn" @tap="addFriendAnimation" v-if="relation==2">加为好友</view>
			<view class="btn1 btn" v-if="relation==1">发送消息</view>
		</view>
		<view class="add-misg" :style="{height:addHeight+'px',bottom:-+addHeight+'px'}" :animation="animationData">
			<view class="name">{{user.name}}</view>
			<textarea :value="myname+'请求加为好友'" class="add-main" maxlength="120" />
		</view>
		<view class="add-bt button-bar" :animation="animationData1">
			<view class="close btn" @tap="addFriendAnimation">取消</view>
			<view class="send btn">发送</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '', //对象
				uid: '', //用户id
				token: '',
				myname: '',
				markname: '',
				user: {}, //简介
				relation: '', //用户关系 0自己  1好友  2陌生人
				seximg: '../../static/images/userhome/female.png',
				sexBg: 'rgba(255,93,91,1)',
				addHeight: '',
				animationData: {},
				animationData1: {},
				animationData2: {},
				animationData3: {},
				animationData4: {},
				isadd: false,

			}
		},
		onLoad(e) {
			this.id = e.id;
			this.getStorages();
			this.getUser();
			this.judgeFriend();
		},
		onReady() {
			this.getElementStyle();
		},
		methods: {
			backone: function() {
				uni.navigateBack({
					delta: 1
				});
			},
			//获取缓存数据
			getStorages: function() {
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						this.uid = value.id;
						this.token = value.token;
						this.myname = value.name;
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
			//获取用户信息
			getUser: function() {
				uni.request({
					url: this.serverUrl + '/user/detail',
					data: {
						id: this.id,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status;
						if (status == 200) {
							let res = data.data.result;
							//处理头像链接
							res.imgurl = this.serverUrl + '/user/' + res.imgurl;
						
							//处理简介
							if (typeof(res.explain)) {
								res.explain = '这个人很懒,什么都没有留下';
							}
							//处理markname
							if (this.markname.length == 0) {
								this.markname = res.name;
							}
							this.sexJudge(res.sex);
							this.user = res;
							console.log(res)
						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错',
								icon: 'none',
								duration: 2000
							});
						}
					}
				})
			},
			//性别判断
			sexJudge: function(e) {
				if (e == 'female') {
					this.seximg = '../../static/images/userhome/female.png';
					this.sexBg = 'rgba(255,93,91,1)'
				} else if (e == 'male') {
					this.seximg = '../../static/images/userhome/male.png';
					this.sexBg = 'rgba(93, 185, 255, 1.0)'
				} else {
					this.seximg = '../../static/images/userhome/asexual.png';
					this.sexBg = 'rgba(19, 35, 49, 1.0)'
				}
			},
			//判断用户关系
			judgeFriend: function() {
				if (this.id == this.uid) {
					this.relation = 0;
				} else {
					//如果不是自己,进行后端访问验证
					uni.request({
						url: this.serverUrl + '/search/isfriend',
						data: {
							uid: this.uid,
							fid: this.id,
							token: this.token,
						},
						method: 'POST',
						success: (data) => {
							let status = data.data.status;
							if (status == 200) {
								//好友
								this.relation = 1;
								console.log(this.relation)
								this.getMarkName();
							} else if (status == 400) {
								//陌生人
								this.relation = 2;
							} else if (status == 500) {
								uni.showToast({
									title: '服务器出错',
									icon: 'none',
									duration: 2000
								});
							}
						}
					})
				}
			},
			//获取好友昵称
			getMarkName: function() {
				uni.request({
					url: this.serverUrl + '/user/getmarkname',
					data: {
						uid: this.uid,
						fid: this.id,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status;
						if (status == 200) {
							let res = data.data.result;
							if (!typeof(res.markname)) {
								//如果存在就替换
								this.markname = res.markname;
							}
						}
						uni.showToast({
							title: '服务器出错',
							icon: 'none',
							duration: 2000
						});
					}
				})
			},
			getElementStyle: function() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.bg').boundingClientRect(data => {
					console.log("得到布局位置信息" + JSON.stringify(data));
					console.log("节点离页面顶部的距离为" + data.top);
					this.addHeight = data.height - 186;
				}).exec();
			},
			//添加好友动画
			addFriendAnimation: function() {
				this.isadd = !this.isadd;
				var animation = uni.createAnimation({
					duration: 300,
					timingFunction: 'ease',
				})
				var animation1 = uni.createAnimation({
					duration: 300,
					timingFunction: 'ease',
				})
				var animation2 = uni.createAnimation({
					duration: 300,
					timingFunction: 'ease',
				})
				var animation3 = uni.createAnimation({
					duration: 300,
					timingFunction: 'ease',
				})
				var animation4 = uni.createAnimation({
					duration: 300,
					timingFunction: 'ease',
				})
				if (this.isadd) {
					animation.bottom(0).step()
					animation1.bottom(0).step()
					animation2.width(140).height(140).step()
					animation3.opacity(0).step()
					animation4.backgroundColor('rgba(255,151,137,0.6)').step()
				} else {
					animation.bottom(-this.addHeight).step()
					animation1.bottom(-100).step()
					animation2.width().height().step()
					animation3.opacity(1).step()
					animation4.backgroundColor('rgba(255,151,137,0)').step()
				}
				this.animationData = animation.export()
				this.animationData1 = animation1.export()
				this.animationData2 = animation2.export()
				this.animationData3 = animation3.export()
				this.animationData4 = animation4.export()

			}
		}
	}
</script>

<style lang="scss">
	@import "../../commons/css/mycss.scss";

	.bg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -2;

		.bg-white {
			width: 100%;
			height: 100%;
			//background-color: #eee;
		}

		.bg-img {
			opacity: 0.6;
			position: absolute;
			left: -10rpx;
			top: -10rpx;
			width: 110%;
			height: 110%;
			filter: blur(16px);
			z-index: -1;
		}
	}

	.main {
		text-align: center;
		padding-top: 240rpx;

		.user-header {
			margin: 0 auto;
			position: relative;
			width: 412rpx;
			height: 412rpx;

			.sex {
				position: absolute;
				bottom: 22rpx;
				right: 22rpx;
				width: 64rpx;
				height: 64rpx;
				border-radius: $uni-border-radius-circle;
				z-index: 11;

				image {
					padding: 16rpx;
					width: 32rpx;
					height: 32rpx;
				}
			}

			.user-img {
				top: 0;
				width: 400rpx;
				height: 400rpx;
				border-radius: 48rpx;
				border: 6rpx solid rgba(255, 255, 255, 1);
				box-shadow: 0px 36rpx 40rpx 0px rgba(39, 40, 50, 0.1);
				background: #FFFFFF;
				z-index: 10;

			}
		}

		.user-imf {
			padding-top: 42rpx;

			.name {
				font-size: 52rpx;
				color: $uni-text-color;
				line-height: 74rpx;
			}

			.nick {
				font-size: $uni-font-size-sm;
				line-height: 40rpx;
				color: $uni-text-color;
			}

			.intro {
				padding: 20rpx 100rpx;
				width: 552rpx;
				font-size: 28rpx;
				font-weight: 300;
				color: $uni-text-color;
				line-height: 48rpx;

			}
		}
	}

	.button-bar {
		.btn1 {
			margin: 0 $uni-spacing-col-base;
		}
	}

	.add-misg {
		position: fixed;
		width: 100%;
		box-sizing: border-box;
		// bottom: 0;
		padding: 0 56rpx;
		// height: 1252rpx;
		background: rgba(255, 255, 255, 1);
		border-radius: 40rpx 40rpx 0 0;

		// border: 1px solid red;
		.name {
			padding: 168rpx 0 20rpx;
			font-size: 52rpx;
			color: $uni-text-color;
			line-height: 74rpx;
		}

		.add-main {
			padding: 18rpx 22rpx;
			box-sizing: border-box;
			width: 100%;
			height: 420rpx;
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
			line-height: 44rpx;
			background: $uni-bg-color-grey;
			border-radius: $uni-border-radius-base;
		}
	}

	.add-bt {

		display: flex;
		bottom: -200rpx;

		z-index: 100;

		.close {
			// flex: ;
			width: 172rpx;
			margin-left: $uni-spacing-col-base;
			background: $uni-bg-color-grey;
			border-radius: $uni-border-radius-sm;
			// border: 1px solid red;
		}

		.send {
			margin: 0 $uni-spacing-col-base;
			flex: auto;
			background: $uni-color-primary;
			border-radius: $uni-border-radius-sm;
		}
	}
</style>
