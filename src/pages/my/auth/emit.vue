<template>
	<view style="height: 100%;">
		<block v-if="user.nickName != '微信用户' && user.nickName">
			<gl-navbar text="个人信息" back home />
		</block>

		<view class="manage">
			
			<form @submit="formSubmit">
				<button class="updateImg" open-type="chooseAvatar" 
					@chooseavatar="onChooseAvatar" @click="changeApp">
					<image :src="setData.avatarUrl" mode="widthFix" />
				</button>
				<view class="Tips">
					<image class="icon" :src="imgHOST + '/icon/Tips.png'" mode="aspectFit" />
					点击图片更换头像
				</view>
				<view class="updateInput">
					<view class="label">
						昵称
					</view>
						<input name="input" type="nickname" :value="setData.nickName"
						 class="update-input" 
						 placeholder="请输入昵称" minlength="2" maxlength="20" />
				</view>
				<button class="update-btn" 	form-type="submit">提 交</button>
			</form>
		</view>
	</view>
</template>

<script>
const app = getApp();
import {
    imgHOST,
  Host,
  xhr,
  allowTypes,
  local,
  shareContent,
} from "@/common/util";
import loginVue from './login.vue';

export default {
	data() {
		return {
            imgHOST,
			user: local.get('user'),
			setData:{
				nickName: "",
				avatarUrl: "https://guli-dsr.oss-cn-shanghai.aliyuncs.com/img/WechatIMG1.png"
			},
			updataImg: "https://guli-dsr.oss-cn-shanghai.aliyuncs.com/img/WechatIMG1.png"
		}
	},
	methods: {
		changeApp(){
			app.globalData.runLogin = false
		},
		onChooseAvatar(e){
			const { avatarUrl } = e.detail
			this.setData.avatarUrl = avatarUrl
		},
		formSubmit(e){
			let userName = e.detail.value.input
			if(!userName || userName == "微信用户"){
				this.setData.nickName = ""
				uni.showToast({
					title: "请输入合法昵称",
					icon: "none"
				})
				return false
			}else {
				this.setData.nickName = userName
				if(this.updataImg != this.setData.avatarUrl){
					// this.setData.avatarUrl = this.updataImg
					let url = "/tools/uploadtoken",
						data = {};
					xhr.get(url,data, res=> {
						if (res.statusCode == 200) {
							let ossJson = res.data;
							  ossJson["host"] = ossJson["host"].replace(/^http:/, "https:");
							let file = this.setData.avatarUrl.replace(/^http:\/\/tmp\//, "");
							let key = ossJson["dir"] + file,
								filename = ossJson["host"] + "/" + key;
							uni.uploadFile({
								header: {},
								url: ossJson["host"],
								filePath: this.setData.avatarUrl,
								name: "file",
								formData: {
									key: key,
									policy: ossJson["policy"],
									OSSAccessKeyId: ossJson["accessid"],
									success_action_status: "200", //让服务端返回200，不设置则默认返回204
									signature: ossJson["signature"],
									callback: ossJson["callback"]
								},
								success: res => {
									this.setData.avatarUrl = filename
									let updataUrl = "/user/update_user_profile",
										data = this.setData
									xhr.post(updataUrl,data, res => {
										if(res.statusCode == 200 ){
											this.user.nickName = this.setData.nickName
											this.user.avatarUrl = this.setData.avatarUrl
											local.set('user',this.user)
											app.globalData.runLogin = true
											uni.switchTab({
												url: "/pages/home/home"
											})
										}
									})
								},
								fail: err => {
									this.setData.avatarUrl = this.user.avatarUrl
									uni.showToast({
										title: "头像更新失败",
										icon: "none"
									});
								},
								complete: res => {}
							})
						}
					})
				} else {
					let updataUrl = "/user/update_user_profile",
						data = this.setData
					xhr.post(updataUrl,data, res => {
						if(res.statusCode == 200 ){
							this.user.nickName = this.setData.nickName
							this.user.avatarUrl = this.setData.avatarUrl
							local.set('user',this.user)
							app.globalData.runLogin = true
							uni.switchTab({
								url: "/pages/home/home"
							})
						}
					})
				}
			}
		},
		initImg(){
			if(this.user.nickName){
				this.setData.avatarUrl = this.user.avatarUrl
				this.updataImg = this.user.avatarUrl
				if(this.user.nickName == "微信用户"){
					this.setData.nickName = ""
				} else {
					this.setData.nickName = this.user.nickName
				}
			}
		}
	},
	onload(){
		
	},
	onShow(){
		this.initImg()
	}
}
</script>

<style lang="scss" scoped>
.manage{
	margin-top: 100rpx;
	width: 100%;
    height: 600rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
    .updateImg{
        width: 150rpx;
        height: 150rpx;
		border: 1rpx solid #666;
		overflow: hidden;
		border-radius: 50%;
        margin: 100rpx auto 20rpx;
		image{
			width: 100%;
			height: 100%;
		}
    }
	.Tips{
		margin-top: 10rpx;
		height: 24rpx;
		font-size: 22rpx;
		color: #666;
		text-align: center;
		.icon{
			width: 20rpx;
			height: 20rpx;
			margin-right: 2rpx;
		}
	}
	.updateInput{
		width: 100%;
		height: 60rpx;
		margin-top: 70rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		.label{
			padding: 10rpx;
			margin-right: 30rpx;
			font-size: 30rpx;
			font-weight: bold;
		}
		.update-input{
			width: 300rpx;
			line-height: 60rpx;
			padding-bottom: 2rpx;
			border-bottom: 1rpx solid #ccc;
		}
	}
	.update-btn{
		margin-top: 80rpx;
		font-size: 40rpx;
		color:  $uni-color-success;
		border: 1rpx solid $uni-color-success;
		padding: 10rpx 60rpx;
		border-radius: 30rpx;
	}
}
</style>