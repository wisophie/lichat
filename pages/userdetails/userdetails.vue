<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="toLogin">
				<image src="../../static/images/common/back.png" class="backimg"></image>
			</view>
			<view class="top-bar-center">
				<view class="title">详情</view>
			</view>
		</view>

		<view class="main">
			<view class="column heads">
				<view class="row head">
					<view class="title">头像</view>
					<view class="user-head" v-if="id==uid">
						<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
						 <image class="user-img" :src="cropFilePath" @tap="upload"></image>
					</view>
					<view class="more" v-if="id==uid">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
					<image class="user-img" :src="cropFilePath" v-if="id!=uid"></image>
				</view>
				<view class="row" @tap="modify('explain','签名',user.explain,ispwd)">
					<view class="title">签名</view>
					<view class="cont">
						{{user.explain}}
					</view>
					<view class="more">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="row">
					<view class="title">注册</view>
					<view class="cont">
						{{changeTime(user.time)}}
					</view>
				</view>
			</view>
			<view class="column heads">
				<view class="row" @tap="modify('name','昵称',user.name,false)">
					<view class="title">昵称</view>
					<view class="cont">
						{{user.name}}
					</view>
					<view class="more">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="row">
					<view class="title">性别</view>
					<view class="cont">
						<picker @change="bindPickerChange" :value="index" :range="array" v-if="id==uid">
							<view class="uni-input">{{array[index]}}</view>
						</picker>
						<view class="uni-input" v-if="id!=uid">{{array[index]}}</view>
					</view>
					<view class="more" v-if="id==uid">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="row">
					<view class="title">生日</view>
					<view class="cont">
						<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange" v-if="id==uid">
							<view class="uni-input">{{date}}</view>
						</picker>
							<view class="uni-input" v-if="id!=uid">{{date}}</view>
					</view>
					<view class="more" v-if="id==uid">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="row" @tap="modify('phone','电话',user.phone,false)">
					<view class="title">电话</view>
					<view class="cont">
						{{user.phone}}
					</view>
					<view class="more">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="row" @tap="modify('email','邮箱',user.email,true)">
					<view class="title">邮箱</view>
					<view class="cont">
						{{user.email}}
					</view>
					<view class="more">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
			</view>
			<view class="column heads" v-if="id==uid" @tap="modify('pwd','密码','',true)">
				<view class="row">
					<view class="title">密码</view>
					<view class="cont">
						******
					</view>
					<view class="more">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
			</view>
			<view class="bt2" v-if="id==uid"@tap="quit">退出登录</view>
			<view class="bt2" v-if="id!=uid"@tap="deleteFriend">删除好友</view>
		</view>
		<view class="modify" :style="{bottom:-+modifyHeight+'px'}" :animation="animationData">
			<view class="modify-header">
				<view class="close" @tap="modify">取消</view>
				<view class="title">ddd</view>
				<view class="define" @tap="modifySubmit">确定</view>
			</view>
			<view class="modify-main">
				<input v-if="this.ispwd" type="text" v-model="pwd" class="modify-pwd" placeholder="请输入原密码" placeholder-style="color:#ccc"></input>
				<textarea v-model="data" class="modify-content" ></textarea>
			</view>
		</view>
	</view>
</template>

<script>
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	import myfunction from '../../commons/js/myfunction.js';
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				id:'',
				uid:'',
				imgurl:'',
				token:'',
				myname:'',
				user: {},
				markname:'',
				headimg:'',
				// dataarr:{
				// 	name:'小明',
				// 	sign:'沙发沙发上咋发山东粉丝啊啊啊舒服爽多少分沙发垫付sfsdfsdfdsfsfsf',
				// 	time:new Date(),
				// 	email:'464646@454.com'
				// },
				array: ['男', '女', '未知'],
				index: 0,
				date: currentDate,
				tempFilePath: '',
				cropFilePath: '../../static/images/img/four.png',
				modifyTitle:'',
				data:'修改的内容',
				ispwd:false,
				pwd:undefined,
				type:'',     //修改项
				animationData: {},
				isModify: false,
				modifyHeight:'1000',
			}
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		components: {ImageCropper},
		onReady(){
			this.getElementStyle();
		},
		onShow(){
			this.getStorages();
			this.getUser();
			this.getMarkName();
		},
		onLoad(){
			
		},
		methods: {
			//获取缓存数据
			getStorages:function(){
				try {
				   const value = uni.getStorageSync('user');
				   const id = uni.getStorageSync('id');
					if(value){
						this.uid=value.id;
						this.id=id;
						this.imgurl=this.serverUrl+'/user/'+value.imgurl;
						this.token =value.token;
						this.myname = value.username;
						// console.log(this.id)
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
							this.cropFilePath = this.serverUrl + '/user/' + res.imgurl;
						
							//处理简介
							if (typeof(res.explain)=='undefined') {
								res.explain = '这个人很懒,什么都没有留下';
							}
							//处理生日
							if (typeof(res.birth)=='undefined') {
								this.date = '0000-00-00';
							}else{
								let birth = myfunction.detailTime1(res.birth)
								this.date =birth;
							}
							//处理电话
							if (typeof(res.phone)=='undefined') {
								res.phone = '000';
							}
							//处理markname
							if (this.markname.length == 0) {
								this.markname = res.name;
							}
							this.sexJudge(res.sex);
							this.user = res;
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
			//获取好友昵称
			getMarkName: function() {
				if(this.id!=this.uid){
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
							}else if(status == 500){
								uni.showToast({
									title: '服务器出错',
									icon: 'none',
									duration: 2000
								});
							}else if(status == 300) {
									//token过期
									uni.navigateTo({
									    url: '../login/login?name='+this.myname,
									});
								}
						}
					})
				}
				
			},
			//性别判断
			sexJudge: function(e) {
				if (e == 'female') {
					this.index=1;
				} else if (e == 'male') {
					this.index=0;
				} else {
					this.index=2;
				}
			},
			//图片裁剪
			upload() {
			            uni.chooseImage({
			                count: 1, //默认9
			                sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
			                sourceType: ['album','camera'], //从相册和相机选择
			                success: (res) => {
			                    this.tempFilePath = res.tempFilePaths.shift()
			                }
			            });
			        },
			        confirm(e) {
			              this.tempFilePath = "";
			              this.cropFilePath = e.detail.tempFilePath;
						this.headimg=e.detail.tempFilePath;
						// console.log(e)
			              // #ifdef APP-PLUS||MP
			              //除了H5端返回base64数据外，其他端都是返回临时地址，所以你要判断base64还是临时文件名，（用条件编译APP-PLUS||MP执行编译。）
			              //按我这里是先上传裁剪得来的临时文件地址然后得到临时文件名，
			              //待活你要判断是H5还是其他端传给后端类型参数让后端判断执行何种情况代码就OK了
			              uni.compressImage({
			                src: this.headimg,
			                quality: 30,
			                success: res => {
			                  // console.log(res.tempFilePath)
							  uni.uploadFile({
							    url: this.serverUrl +"/files/upload",   //后端接口地址
							    filePath: res.tempFilePath,
							    name: "file",
							    fileType: "image",
							    formData:{
							  								url:'user',
							  								name:this.uid,
							  								token:this.token,
							  							},           //传递参数
							    success: (uploadFileRes) => {
							      var backstr = uploadFileRes.data;
							  							  
							      //存储用户信息修改
							      try {
							        uni.setStorageSync('user', {'id':this.uid,'username':this.myname,'imgurl':backstr,'token':this.token});
							      	
							      } catch (e) {
							          // error
							      	console.log('数据存储出错')
							      }
							  							  this.update(backstr,'imgurl');
							    },
							  			        
							    fail(e) {
							      console.log("this is errormes " + e.message);
							    },
							  });
			                }
			              })
			              
			        
			              // #endif
			            },
			            cancel() {
			              console.log("canceled");
			              this.tempFilePath = "";
			            },
			    
			bindDateChange: function(e) {
			
					this.date = e.target.value
					this.update(this.date,'birth')
				
				
			},
			//获取日期
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			bindPickerChange: function(e) {
				this.index = e.target.value
				let sex='asexual';
				if(this.index==0){
					sex='male'
				}else if(this.index==1){
					sex='female';
				}
				this.update(sex,'sex')
			},
			getElementStyle: function() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.modify').boundingClientRect(data => {
					
					this.modifyHeight = data.height;
				}).exec();
			},
			//修改项动画
			modify:function(t,type,data,ispwd){
				if(this.id==this.uid){
					this.ispwd =ispwd;
					if(this.ispwd==true){
						this.pwd=''
					}
					this.type=t;
					this.modifyTitle=type;
					this.data=data;
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
				}
				
			},
			//弹出修改确定
			modifySubmit:function(){
				
				//提交修改
				if(this.data.length>0){
					this.update(this.data,this.type,this.pwd)
					this.user[this.type]=this.data;
				}
				this.modify();
			},
			//修改数据
			update:function(data,type,pwd){
				uni.request({
					url: this.serverUrl + '/user/update',
					data: {
						id: this.uid,
						data: data,
						type:type,
						pwd:pwd,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status;
						if (status == 200) {
							let res = data.data;
							if(type=='pwd'){
								//用户需要重新登录
								//清除缓存
								uni.removeStorage({
									key: 'user',
									success: function (res) {
										console.log('success');
									}
								});
								uni.navigateTo({
								    url: '../login/login?name='+this.myname,
								});
							}
							// console.log(res)
						}else if(status == 500){
							uni.showToast({
								title: '服务器出错',
								icon: 'none',
								duration: 2000
							});
						}else if(status == 400){
							uni.showToast({
								title: '密码错误',
								icon: 'none',
								duration: 2000
							});
						}else if(status == 600){
							uni.showToast({
								title: '已被占用',
								icon: 'none',
								duration: 2000
							});
						}else if(status == 300) {
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
			
			
			toLogin: function() {
				uni.navigateTo({
					url: '../userhome/userhome?id='+this.id,
				});
			},
			quit:function(){
				uni.removeStorage({
					key: 'user',
					success: function (res) {
						
					}
				});
				uni.navigateTo({
				    url: '../login/login',
				});
			},
			//删除好友
			deleteFriend:function(){
				uni.showModal({
					title: '提示',
					content: '确定删除该好友吗?',
					success: (res) => {
						if (res.confirm) {
							uni.request({
								url: this.serverUrl + '/friend/deletefriend',
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
										uni.switchTab({
										    url: '../index/index',
										});
										// console.log(data.data)
									}else if(status == 500){
										uni.showToast({
											title: '服务器出错',
											icon: 'none',
											duration: 2000
										});
									}else if(status == 300) {
											//token过期
											uni.navigateTo({
											    url: '../login/login?name='+this.myname,
											});
										}
								}
							})
							// console.log('用户点击确定');
						} else if (res.cancel) {
							// console.log('用户点击取消');
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	@import "../../commons/css/mycss.scss";

	.top-bar {
		background: rgba(255, 255, 255, 0.96);
		box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1);
	}

	.main {
		padding-top: 118rpx;
		display: flex;
		flex-direction: column;

		.column {
			display: flex;
			flex-direction: column;
			// border:1px solid red;
			border-bottom: 1px solid $uni-border-color;

			.row {
				display: flex;
				flex-direction: row;
			}

			.title {
				flex: none;
				// flex: auto;
				padding: 0 $uni-spacing-col-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 112rpx;
				// border:1px solid red;
			}

			.user-head {
				flex: auto;
			}

			.head {
				height: 148rpx;
				display: flex;
				align-items: center;
			}

			.user-img {
				width: $uni-img-size-lg;
				height: $uni-img-size-lg;
				border-radius: $uni-border-radius-base;
			}

			.cont {
				flex: auto;
				// display: flex;
				// align-items: center;
				font-size: $uni-font-size-lg;
				color: $uni-text-color-grey;
				line-height: 112rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.more {
				flex: none;
				height: 112rpx;
				display: flex;
				align-items: center;

				// border:1px solid red;
				image {
					width: 80rpx;
					height: 28rpx;
				}
			}
		}

		.bt2 {
			margin-top: 50rpx;
			text-align: center;
			font-size: 32rpx;
			color: $uni-color-error;
			line-height: 88rpx;
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
