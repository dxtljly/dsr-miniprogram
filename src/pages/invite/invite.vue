<template>
	<view style="height:100%;width: 100%;">
		<gl-navbar back home text="邀请好友"></gl-navbar>
		<view class="container">
			<image mode="widthFix" :src="imgHOST + '/invite/bg.png'" class="bg" />
			<view class="introduction-content">
				<image mode="widthFix" :src="imgHOST + '/invite/title.png'" style="display:block;position:relative;width:96%;margin:auto;top: 15px;" />
				<view class="ladder">
					<view class="head-content">
						<view class="invitation-label">已邀 {{ invitationsNum }} 人</view>
						<view class="invitation-txt">快去邀好友吧</view>
					</view>
					<view class="line"></view>
					<view class="redpacket-list">
						<block v-for="(item, index) in redpacketList" :key="index">
							<view class="li" :class="{ off: invitationsNum < item.num }">
								<view class="img"><image mode="widthFix" :src="imgHOST + '/invite/哩豆' + (index + 1) + '.png'" @click="checkRedpacket(index)" /></view>
								<view class="txt">达 {{ item.num }} 人得</view>
							</view>
						</block>
					</view>
				</view>
				<view
					style="text-align:center;color;background: #f9dfb6;border-radius:25px;height:25PX;
                       position: relative;margin: 0px 15px 0px 15px;box-sizing:border-box;"
				>
					<image
						mode="widthFix"
						:src="imgHOST + '/invite/火苗.png'"
						style="display:flex;float:left;width:5%;height:5%;margin-left:5px;margin-top:6rpx;margin-right:15px;"
					/>
					<view class="text-container">
						<view class="inner-container">
							<p class="text" v-for="(text, index) in showStepCouponList" :key="index">{{ text }}</p>
						</view>
					</view>
				</view>
				<button hover-class="none" open-type="share" style="position:relative;margin:60rpx auto 0;width:60%;">
					<image mode="widthFix" :src="imgHOST + '/invite/立即邀请.png'" style="display:block;position:relative;width:100%;margin:auto;" />
				</button>
				<image mode="widthFix" :src="imgHOST + '/invite/哩豆兑好礼.png'" style="display:block;position:relative;width:30%;margin:40rpx auto;" @click="toIntegralShop" />
			</view>
			<image :src="imgHOST + '/invite/协议.png'" mode="widthFix" class="footer-bg"></image>
		</view>
	</view>
</template>
<script>
const app = getApp();
const rpxRatio = uni.getSystemInfoSync()['screenWidth'] / 750;
import { imgHOST, Host, xhr, allowTypes, local, getUrlParam, shareContent, 
	request 
} from '@/common/util';
import { log } from 'util';
import loginVue from '../my/auth/login.vue';
export default {
	data() {
		return {
			imgHOST,
			statusBarHeight: app.globalData.statusBarHeight,
			navigationHeight: app.globalData.navigationHeight,
			user: local.get('user'),
			invitationsNum: local.get('user').campus_ref_count,
			redpacketListIndex: null,
			redpacketList: [
				{
					num: 1,
					redpacket: {
						title: '恭喜您获得哩豆100',
						integral: '100'
					}
				},
				{
					num: 3,
					redpacket: {
						title: '恭喜您获得哩豆500',
						integral: '500'
					}
				},
				{
					num: 6,
					redpacket: {
						title: '恭喜您获得哩豆1500',
						integral: '1500'
					}
				},
				{
					num: 9,
					redpacket: {
						title: '恭喜您获得哩豆3000',
						integral: '3000'
					}
				}
			],
			showStepCouponList: [
				'贺**, 刚邀请了1人，获得2元现金红包！',
				'华*, 刚邀请了1人，获得2元现金红包！',
				'康**, 刚邀请了2人，获得6元现金红包！',
				'水**, 刚邀请了1人，获得2元现金红包！',
				'汤*, 刚邀请了5人，获得20元现金红包！',
				'韩*, 刚邀请了2人，获得6元现金红包！',
				'褚**, 刚邀请了2人，获得6元现金红包！',
				'皮**, 刚邀请了3人，获得10元现金红包！',
				'凤*, 刚邀请了5人，获得20元现金红包！',
				'蓝**, 刚邀请了1人，获得2元现金红包！',
				'花**, 刚邀请了1人，获得2元现金红包！',
				'朱**, 刚邀请了3人，获得10元现金红包！',
				'彭*, 刚邀请了5人，获得20元现金红包！',
				'常**, 刚邀请了3人，获得10元现金红包！',
				'水*, 刚邀请了2人，获得6元现金红包！',
				'陈*, 刚邀请了1人，获得2元现金红包！'
			]
		};
	},
	methods: {
		checkRedpacket(index) {
			// 当前红包index <  红包列表长度
			if (index < this.redpacketList.length) {
				// 邀请人数 < 当前红包所需人数
				if (this.invitationsNum < this.redpacketList[index].num) {
					uni.showModal({
						title: '提示',
						content: `再邀请${this.redpacketList[index].num - this.invitationsNum}个好友，能获取${this.redpacketList[index].redpacket.integral}哩豆`,
						cancelText: '再去邀请',
						confirmText: `就得${this.redpacketList[index].redpacket.integral}哩豆`,
						success: res => {
							if (res.confirm) {
								uni.showModal({
									title: '提示',
									content: '请领取在邀请人数内的红包哦~',
									showCancel: false,
									confirmText: '知道了'
								});
							} else {
								return false;
							}
						}
					});
				} else {
					this.redpacketListIndex = index;
					// this.emitInvitePacket();
				}
			}
		},
		emitInvitePacket() {
			let integralNum = this.redpacketList[this.redpacketListIndex].num
			let dailyTask = local.get('dailyTask'),
				taskId = '';
			dailyTask.map((val, index) => {
				if (val.name == '邀请好友') {
					taskId = val.id;
				}
			});
			let url = '/mall-portal/member/task/add',
				data = {
					changeCount: integralNum,
					changeType: 0,
					platformType: 2,
					umsMemberTaskId: taskId
			};
			request.post( url,data, res => {
				if(res.code == 200){
					return
				}
			})
		},
		toIntegralShop() {}
	},
	onShareAppMessage(res){
		let userId = local.get("user").id;
		return {
			title: "舍哩邀请有好礼",
			path:`/pages/invite/invite?userId=${userId}`
		}
	},
	onload(options) {
		if (options.scene) {
			let scene = getUrlParam(
				decodeURIComponent(options.scene).replace(/^\?/, "")
			);
			options = scene;
		}
		//  微信邀请 ||  二维码邀请
		if ( options.userId && options.userId != this.user.id) {
			local.set("inviter", { id: options.userId });
    	}
	},
	onShow() {}
};
</script>
<style lang="scss" scoped>
.text-container {
	width: 500px;
	height: 15px;
	line-height: 30px;
	margin: 10px auto;
	overflow: hidden;
	white-space: nowrap;
	transform: translateX(-15%) translateY(-97%);
}
.text,
.text2 {
	margin: 0;
}
.inner-container {
	animation: myMove 20s linear infinite;
	animation-fill-mode: forwards;
	animation-fill-mode: both;
}
/*文字无缝滚动*/
@keyframes myMove {
	0% {
		transform: translateY(0);
	}
	100% {
		transform: translateY(-450px);
	}
}
.container {
	position: relative;
	height: 100%;
	background: #fff;
	.bg {
		position: absolute;
		width: 100%;
		height: 680px;
	}
	.introduction-content {
		position: relative;
		top: 650rpx;
		width: 100%;
		// height: 600rpx;
		background: #fff;
		z-index: 100;
		.ladder {
			position: relative;
			margin-bottom: 30rpx;
			padding: 20rpx 0;
			margin: 0px 15px 0px 15px;
			.head-content {
				display: flex;
				align-items: center;
				margin: 30rpx 0;
				.invitation-label {
					position: relative;
					padding: 8rpx 16rpx;
					font-size: 12px;
					font-weight: bold;
					color: #fff;
					background-color: #ff5046;
					border-top-left-radius: 16rpx;
					border-top-right-radius: 16rpx;
					border-bottom-right-radius: 16rpx;
					&::after {
						content: '';
						display: block;
						position: absolute;
						left: 0;
						width: 0;
						height: 0;
						border-left: 24rpx solid #ff5046;
						border-right: 24rpx solid transparent;
						border-top: 8rpx solid #ff5046;
						border-bottom: 8rpx solid transparent;
					}
				}
				.invitation-txt {
					margin-left: 10rpx;
					font-size: 24rpx;
					color: #fc665a;
				}
				.txt {
					margin-left: 20rpx;
					font-size: 12px;
					color: #ff5046;
				}
			}
			.line {
				width: 100%;
				height: 10rpx;
				background: #f9dfb6;
				border-radius: 6rpx;
			}

			.redpacket-list {
				display: flex;
				align-items: center;
				margin-top: -6rpx;
				.li {
					width: calc(100% / 4);
					.img {
						flex-shrink: 0;
						display: flex;
						justify-content: center;
						height: 200rpx;
						image {
							width: 80%;
							height: 0;
						}
					}
					.txt {
						text-align: center;
						color: #ca661e;
						font-size: 10px;
						line-height: 40px;
					}
					&.off {
						.img {
							image {
								filter: grayscale(0.9);
							}
							opacity: 0.5;
						}
					}
				}
			}
		}
	}
	.footer-bg {
		width: 100%;
		position: absolute;
		bottom: 0;
	}
}
</style>
