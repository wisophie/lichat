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
					<view class="user-head">
						<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
						 <image class="user-img" :src="cropFilePath" @tap="upload"></image>
					</view>
					<view class="more">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="row" @tap="modify('签名',dataarr.sign,ispwd)">
					<view class="title">签名</view>
					<view class="cont">
						{{dataarr.sign}}
					</view>
					<view class="more">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="row">
					<view class="title">注册</view>
					<view class="cont">
						{{changeTime(dataarr.time)}}
					</view>
				</view>
			</view>
			<view class="column heads">
				<view class="row" @tap="modify('昵称',dataarr.name,false)">
					<view class="title">昵称</view>
					<view class="cont">
						{{dataarr.name}}
					</view>
					<view class="more">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="row">
					<view class="title">性别</view>
					<view class="cont">
						<picker @change="bindPickerChange" :value="index" :range="array">
							<view class="uni-input">{{array[index]}}</view>
						</picker>
					</view>
					<view class="more">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="row">
					<view class="title">生日</view>
					<view class="cont">
						<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
							<view class="uni-input">{{date}}</view>
						</picker>
					</view>
					<view class="more">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="row" @tap="modify('昵称',dataarr.name,false)">
					<view class="title">电话</view>
					<view class="cont">
						sfsfsffsf
					</view>
					<view class="more">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
				<view class="row" @tap="modify('昵称',dataarr.name,true)">
					<view class="title">邮箱</view>
					<view class="cont">
						{{dataarr.email}}
					</view>
					<view class="more">
						<image src="../../static/images/common/more.png" mode="aspectFit"></image>
					</view>
				</view>
			</view>
			<view class="column heads">
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
			<view class="bt2">
				退出登录
			</view>
		</view>
		<view class="modify" :style="{bottom:-+modifyHeight+'px'}" :animation="animationData">
			<view class="modify-header">
				<view class="close" @tap="modify">取消</view>
				<view class="title">签名</view>
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
				dataarr:{
					name:'小明',
					sign:'沙发沙发上咋发山东粉丝啊啊啊舒服爽多少分沙发垫付sfsdfsdfdsfsfsf',
					time:new Date(),
					email:'464646@454.com'
				},
				array: ['男', '女', '未知'],
				index: 0,
				date: currentDate,
				tempFilePath: '',
				cropFilePath: '../../static/images/img/four.png',
				modifyTitle:'',
				data:'修改的内容',
				ispwd:false,
				pwd:'',
				animationData: {},
				isModify: false,
				modifyHeight:'',
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
		methods: {
			//图片裁剪
			upload() {
			            uni.chooseImage({
			                count: 1, //默认9
			                sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			                sourceType: ['album','camera'], //从相册和相机选择
			                success: (res) => {
			                    this.tempFilePath = res.tempFilePaths.shift()
			                }
			            });
			        },
			        confirm(e) {
			              this.tempFilePath = "";
			              this.cropFilePath = e.detail.tempFilePath;
			        
			              // #ifdef APP-PLUS||MP
			              //除了H5端返回base64数据外，其他端都是返回临时地址，所以你要判断base64还是临时文件名，（用条件编译APP-PLUS||MP执行编译。）
			              //按我这里是先上传裁剪得来的临时文件地址然后得到临时文件名，
			              //待活你要判断是H5还是其他端传给后端类型参数让后端判断执行何种情况代码就OK了
			        
			              uni.uploadFile({
			                url: "后端地址上传图片接口地址",
			                filePath: this.cropFilePath,
			                name: "file",
			                fileType: "image",
			                //formData:{},传递参数
			                success: (uploadFileRes) => {
			                  var backstr = uploadFileRes.data;
			                  //自定义操作
			                },
			        
			                fail(e) {
			                  console.log("this is errormes " + e.message);
			                },
			              });
			        
			              // #endif
			            },
			            cancel() {
			              console.log("canceled");
			              this.tempFilePath = "";
			            },
			    
			bindDateChange: function(e) {
				this.date = e.target.value
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
			},
			getElementStyle: function() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.modify').boundingClientRect(data => {
					
					this.modifyHeight = data.height;
				}).exec();
			},
			//修改项动画
			modify:function(type,data,ispwd){
				this.ispwd =ispwd;
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
			},
			//弹出修改确定
			modifySubmit:function(){
				this.modify();
			},
			//处理时间
			changeTime:function(date){
				return myfunction.detailTime(date)
			},
			
			
			toLogin: function() {
				uni.navigateBack({
					delta: 1
				});
			},
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
