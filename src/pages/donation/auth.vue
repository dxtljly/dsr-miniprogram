<template>
	<view style="height:100%;background:#fff;">
		<block v-if="true">
			<gl-navbar back home text="资格认证"></gl-navbar>
			<view></view>
			<image mode="widthFix" :src="imgHOST + '/donation/auth/head.png'" class="head-bg" />
			<view style="width: 100%;padding: 0 20rpx;box-sizing: border-box;">
                <block v-for="(item, index) in config.donation" :key="index">
                    <view class="container flx fx-column" v-if="item.page">
                        <view class="form">
                            <view class="li">
                                <view class="label">{{ item.labelname }}</view>
                                <input v-model="authen.name" placeholder="请输入姓名" placeholder-class="place-holder" class="input" />
                            </view>
                            <view class="li">
                                <view class="label">{{ item.labelphone }}</view>
                                <input type="number" maxlength="11" v-model="authen.phone" placeholder="请输入手机号" placeholder-class="place-holder" class="input" />
                            </view>
                            <view class="li">
                                <view class="label">{{ item.labelidentity }}</view>
                                <input type="idcard" maxlength="18" v-model="authen.identity" placeholder="请输入身份证号" placeholder-class="place-holder" class="input input1"/>
                            </view>
                        </view>
                        <view class="id-img-content">
                            <view class="id-img">
                                <block v-if="student_id.temp">
                                    <image mode="aspectFill" :src="student_id.temp" data-key="student_id" @click="previewImg" />
                                    <image mode="aspectFill" :src="imgHOST + '/icon/loadding-bubbles-grey.svg'" class="loadding" />
                                    <image mode="aspectFill" :src="imgHOST + '/icon/delete-close.png'" class="close" data-key="student_id" @click.stop="deleteImg" />
                                </block>
                                <block v-else-if="student_id.upload">
                                    <image mode="aspectFill" :src="student_id.upload" data-key="student_id" @click="previewImg" />
                                    <image mode="aspectFill" :src="imgHOST + '/icon/delete-close.png'" class="close" data-key="student_id" @click.stop="deleteImg" />
                                </block>
                                <block v-else><image mode="aspectFill" :src="imgHOST + '/donation/auth/id-0.png'" data-key="student_id" @click="chooseImg" /></block>
                                <view>身份证正面照片</view>
                            </view>
                            <view class="id-img">
                                <block v-if="identify_id.temp">
                                    <image mode="aspectFill" :src="identify_id.temp" data-key="identify_id" @click="previewImg" />
                                    <image mode="aspectFill" :src="imgHOST + '/icon/loadding-bubbles-grey.svg'" class="loadding" />
                                    <image mode="aspectFill" :src="imgHOST + '/icon/delete-close.png'" class="close" data-key="identify_id" @click.stop="deleteImg" />
                                </block>
                                <block v-else-if="identify_id.upload">
                                    <image mode="aspectFill" :src="identify_id.upload" data-key="identify_id" @click="previewImg" />
                                    <image mode="aspectFill" :src="imgHOST + '/icon/delete-close.png'" class="close" data-key="identify_id" @click.stop="deleteImg" />
                                </block>
                                <block v-else><image mode="aspectFill" :src="imgHOST + '/donation/auth/id-1.png'" data-key="identify_id" @click="chooseImg" /></block>
                                <view>身份证反面照片</view>
                            </view>
                        </view>
                        
                        <view class="form-btm">
                            <view class="li">
                                <view class="label">{{item.labeltoname}}</view>
                                <input v-model="authen.proveName" :placeholder="item.toname" placeholder-class="place-holder" class="input" />
                            </view>
                            <view class="li">
                                <view class="label">{{item.labeltoprove}}</view>
                                <view class="input input1">{{item.toprove}}</view>
                            </view>
                        </view>

                        <view class="wrap">
                            <view class="img-wrap">
                                <view class="imglist flx fx-wrap">
                                    <view class="img-item" v-for="(imgItm,imgIndex) in imgs" :key="imgIndex">
                                        <image :src="imgItm" mode="aspectFill" />
                                        <view class='img-delete' @click='deleteImgs' data-index="imgIndex">
                                            <image :src="imgHOST + '/donation/auth/delete.png'" />
                                        </view>
                                    </view>
                                    <view class="last-item" v-if="imgs.length >= 9 ? false : true" @click="bindUpload">
                                        <text class="sign">+</text>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </block>
			</view>
			<!-- <view style="height:180rpx;background:#fff;"></view> -->
			<view class="submit-btn" @click.stop="submit">提交</view>
		</block>
	</view>
</template>

<script>
const app = getApp();
import { shareContent, imgHOST, Host, xhr, local, allowTypes, getUrlParam, debounce, throttle } from '@/common/util';
export default {
	data() {
		return {
			imgHOST,
			statusBarHeight: app.globalData.statusBarHeight,
			navigationHeight: app.globalData.navigationHeight,
			tabbarHeight: app.globalData.tabbarHeight,
			screenWidth: app.globalData.screenWidth,
			user: local.get('user'),
			config: {},
			college_name: '',
			authen: {
                name:"",
                phone: "",
                identity:"",
                proveName:"",
                stuff:null
            },
			student_id: {
				temp: '',
				upload: ''
			},
			identify_id: {
				temp: '',
				upload: ''
			},
			uploadXHR: {
				student_id: null,
				identify_id: null
			},
			imgs:[],
			count: 9
		};
	},
	methods: {
		getConfig() {
			let url = 'https://www.grecycle.com.cn/src/sli/config/sli-certification-config.json',
				data = {};

			xhr.get(url, data, res => {
				if (res.statusCode == 200) {
					this.config = res.data;
				}
			});
		},
		chooseImg(e) {
			console.log('chooseImg');
			let imgKey = e.currentTarget.dataset.key;

			let url = '/tools/uploadtoken',
				data = {};
			xhr.get(url, data, res => {
				console.log(res);
				if (res.statusCode == 200) {
					let ossJson = res.data;
					ossJson['host'] = ossJson['host'].replace(/^http:/, 'https:');

					uni.chooseImage({
						count: 1,
						sizeType: ['compressed'],
						sourceType: ['album', 'camera'],
						success: res => {
							let tempFiles = res.tempFiles;

							let limitSize = 3 * 1024 * 1024;
							for (let i = 0; i < tempFiles.length; i++) {
								if (tempFiles[i].size > limitSize) {
									uni.showToast({
										title: '图片过大',
										icon: 'none'
									});
								} else {
									if (allowTypes.imgs.indexOf(tempFiles[i].path.substring(tempFiles[i].path.lastIndexOf('.'))) >= 0) {
										this[imgKey].temp = tempFiles[i].path;
									} else {
										uni.showToast({
											title: '不支持图片格式',
											icon: 'none'
										});
									}
								}
							}

							let file = this[imgKey].temp.replace(/^http:\/\/tmp\//, '');
							let key = ossJson['dir'] + file,
								filename = ossJson['host'] + '/' + key;
							this.uploadXHR[imgKey] = uni.uploadFile({
								header: {},
								url: ossJson['host'],
								filePath: this[imgKey].temp,
								name: 'file',
								formData: {
									key: key,
									policy: ossJson['policy'],
									OSSAccessKeyId: ossJson['accessid'],
									success_action_status: '200', //让服务端返回200，不设置则默认返回204
									signature: ossJson['signature'],
									callback: ossJson['callback']
								},
								success: res => {},
								fail: err => {
									uni.showToast({
										title: '放置失败',
										icon: 'none'
									});
									this[imgKey].temp = '';
								},
								complete: res => {
									this.uploadXHR[imgKey] = null;
									if (String(res.statusCode)[0] == 2) {
										this[imgKey].temp = '';
										this[imgKey].upload = filename;
									} else {
										this[imgKey].temp = '';
										uni.showToast({
											title: '图片放置失败，请重试',
											icon: 'none'
										});
									}
								}
							});
						}
					});
				}
			});
		},
		deleteImg(e) {
			let imgKey = e.currentTarget.dataset.key;
			this[imgKey] = {
				temp: '',
				upload: ''
			};
			if (this.uploadXHR[imgKey]) {
				this.uploadXHR[imgKey].abort();
			}
		},
		previewImg(e) {
			let imgKey = e.currentTarget.dataset.key;

			let img = this[imgKey].temp || this[imgKey].upload;

			uni.previewImage({
				current: img,
				urls: [img]
			});
		},
		deleteImgs(e) {
			var that = this
			uni.showModal({
				title: "提示",
				content: "是否删除",
				success(res) {
					if (res.confirm) {
						for (var i = 0; i < that.data.imgs.length; i++) {
							if (i == e.currentTarget.dataset.imgIndex) that.data.imgs.splice(i, 1)
						}
						that.setData({
							imgs: that.data.imgs
						})
					} else if (res.cancel) {
						console.log("用户点击取消")
					}
				}
			})
			},
		submit() {
			if (!this.user || this.user.role != 'telUser') {
				return uni.navigateTo({
					url: '/pages/my/auth/login'
				});
			}
			if (!this.student_id.upload) {
				return uni.showToast({
					title: '未放置图片',
					icon: 'none'
				});
			}
			if (!this.identify_id.upload) {
				return uni.showToast({
					title: '未放置图片',
					icon: 'none'
				});
			}

			let url = '',
				data = {
					
				};

			uni.showLoading();
			xhr.post(url, data, res => {
				uni.hideLoading();
				if (res.statusCode == 200) {
					uni.showModal({
						title: '提交成功',
						content: '已提交！请耐心等待工作人员进行查看！',
						showCancel: false,
						confirmText: '好哩',
						complete: res => {
							uni.navigateBack();
						}
					});
				}
			});
		}
	},
	watch: {
		
	},
	mounted() {},
	onLoad(options) {
		if (options.scene) {
			let scene = getUrlParam(decodeURIComponent(options.scene).replace(/^\?/, ''));
			options = scene;
		}
		this.getConfig();
	},
	onShow() {
		this.user = local.get('user');
	},
	onShareAppMessage(res) {
		//res.from
		return {
			title: shareContent.schoolTitle,
			imageUrl: shareContent.schoolImg,
			path: '/pages/school/index'
		};
	},
	onShareTimeline(res) {
		return {
			title: shareContent.schoolTitle,
			imageUrl: shareContent.schoolImg,
			path: '/pages/school/index'
		};
	}
};
</script>

<style lang="scss" scoped>
.head-bg {
	width: 100%;
}
.container {
	width: 100%;
	box-sizing: border-box;
	padding: 40rpx;
	position: relative;
	background: #fff;
	border-radius: 30rpx;
	top: -100px;

	.form, .form-btm {
		.li {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;
			.label {
				flex-shrink: 0;
				margin-right: 20rpx;
				font-size: 14px;
				font-weight: 500;
			}
			.input {
				flex-grow: 1;
				font-size: 13px;
				overflow: auto;
				padding: 12rpx 30rpx;
				background: #f9f9f9;
				border-radius: 6rpx;
				white-space: nowrap;
				color: #6d9cf8;
			}
            .input1{
                color: #ccc;
                white-space: pre-wrap;
            }
		}
	}
	.id-img-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #fff;
        margin-top: 40rpx;
		.id-img {
			position: relative;
			width: 300rpx;
			height: 200rpx;
			font-size: 14px;
			text-align: center;
			image {
				width: 100%;
				height: 100%;
				border-radius: 12rpx;
			}
			.loadding {
				position: absolute;
				top: 0;
				left: 0;
			}
			.close {
				position: absolute;
				width: 50rpx;
				height: 50rpx;
				top: -20rpx;
				right: -20rpx;
			}
		}
	}
    .form-btm{
        margin-top: 100rpx;
    }
    .wrap{
        width: 100%;
        padding: 0 30rpx;
        box-sizing: border-box;
        .img-wrap{
            font-size: 30rpx;
            color: #33373E;
            margin-bottom: 10rpx;
            .img-item{
                width: 150rpx;
                height: 150rpx;
                margin-right: 22rpx;
                margin-bottom: 10rpx;
                position: relative;
                image{
                    width: 100%;
                    height: 100%;
                }
                .img-delete{
                    width: 30rpx;
                    height: 30rpx;
                    position: absolute;
                    top: -14rpx;
                    right: -12rpx;
                }
            }
            .last-item{
                width: 150rpx;
                height: 150rpx;
                text-align: center;
                line-height: 146rpx;
                border: 2rpx dashed #8B97A9;
                box-sizing: border-box;
            }
        }
    }

}
.submit-btn {
	position: fixed;
	margin: auto;
	left: 0;
	right: 0;
	bottom: 30rpx;
	width: calc(100% - 120rpx);
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 15px;
	color: #fff;
	background: #ff5e41;
	border-radius: 80rpx;
}
</style>
