<template>
	<view style="height: 100%;overflow:auto;background: #F2F2F2;">
		<gl-navbar back full text="哩豆任务" bg="#fff"></gl-navbar>
		<view class="container" :style="{ 'margin-top': statusBarHeight + navigationHeight + 'px' }">
			<view class="bg" :style="{ 'background-image': 'url(' + imgHOST + '/task/taskBg.png)' }">
				<!-- <view class="detailed" @click="toDetailed">明细</view> -->
				<view class="integration">{{ integration }}</view>
				<view class="toShopBtn" @click="toShopBtn">哩豆商城</view>
				<view class="register z-depth-1">
					<view class="registerTxt">
						<view class="greenLabel"></view>
						<view class="nowRegister">签到得哩豆</view>
						<!-- <view class="nowRegister">连续签到<span>{{nowRegister}}</span>天</view> -->
						<!-- <view class="tips">再签到{{RewardDay}}天，可获得额外奖励</view>
						<view class="tipsBtn" @click="tipsBtn"><image :src="imgHOST+'/task/tips.png'" mode="widthFix" /></view> -->
					</view>
					
					<ul class="registerImgs">
						<block v-for="item in timeData" :key="item.index">
							<li v-if="showSigned(item)" class="li">
								<view class="li-box" >
									<image :src="imgHOST + '/task/nowDayImg.png'" mode="widthFix"></image>
									<view class="dateList" :class="showSigned(item) ? 'on':''">{{item}}</view>
								</view>
							</li>
							<li v-else class="li">
								<view class="li-box">
									<view class="li-nextDay">
										<span>5</span>
									</view>
									<view class="dateList" :class="showSigned(item) ? 'on':''">{{item}}</view>
								</view>
							</li>
						</block>
					</ul>
				</view>
			</view>
		</view>

<!-- banner -->
		<block>
			<navigator hover-class="none" url="/pages/clock/clock">
				<image
				mode="widthFix"
				:src="imgHOST+'/task/积分兑好礼.png'"
				style="margin-left:15rpx;width:96%;border-radius: 10rpx;"
				/>
			</navigator>
		</block>

		<!-- 积分任务 -->
		<view class="dailyTask" @click="openDailyView">
			<tk-li :list="dailyList" title="日常任务" :showAll="showDailyAll"></tk-li>
			<viwe :class="showDailyAll?'off':'hidview'">
				<image
					:src="imgHOST + '/task/taskIcon/icon-bottom.png'"
					mode="widthFix"
				/> 更多
			</viwe>
		</view>

		<view class="newUserTask" @click="openUserView">
			<tk-li :list="newUserTask" title="新手任务" :showAll="showUserAll"></tk-li>
			<viwe :class="showUserAll?'off':'hidview'">
				<image
					:src="imgHOST + '/task/taskIcon/icon-bottom.png'"
					mode="widthFix"
				/> 更多
			</viwe>
		</view>

	</view>
</template>
<script>
import { imgHOST, Host, xhr, allowTypes, local, shareContent, request } from '@/common/util';
const app = getApp();
export default {
	data() {
		return {
			imgHOST,
			user: local.get('user'),
			statusBarHeight: app.globalData.statusBarHeight,
			navigationHeight: app.globalData.navigationHeight,
			integration: 0,
			nowRegister: 1,
			RewardDay: 6,
			timeData:[],
			dailyList:[],
			newUserTask:[],
			showDailyAll: false,
			showUserAll: false
		};
	},
	computed:{
		showSigned(){
			return function(item){
				let a = item.split('-')
				if( parseInt(a[1]) <= parseInt(new Date().getDate()) 
				&& parseInt(a[0]) <= parseInt(new Date().getMonth()+1)
				){
					return true
				}else{
					return false
				}
			}
		}
	},
	methods: {
		fun_date(aa){
			this.timeData = []
			let date1 = new Date(),
			time1 = date1.getFullYear()+"-"+(date1.getMonth()+1)+"-"+date1.getDate();//time1表示当前时间
			for(let i=0;i<aa;i++){
				let date2 = new Date(date1);
				date2.setDate(date1.getDate()+i);
				let timeData = (date2.getMonth()+1)+"-"+date2.getDate();
				this.timeData.push(timeData)
			}
		},
		/*
		getUserInfo(){
			let url = "/mall-portal/sso/info",
				data = {}
			request.get(url,data, res => {
				console.log("积分商城信息",res);
				if(res.code == 200){
				this.integration = res.data.data.integration
				}
			})
		},
		getTaskList(){
			this.newUserTask = []
			this.dailyList = []
			let url = "/mall-portal/member/task/queryMemberTaskParamList",
				data = {
					"pageNum": 1,
					"pageSize": 20,
					"platformType": 2
				}
			request.get(url,data, res => {
				if(res.code == 200){
					console.log("res List",res);
					let list = res.data.data.list
					console.log("list",list);
					list.map((val,index) => {
						if(val.taskType == 0){
							this.newUserTask.push(val)
						} else {
							this.dailyList.push(val)
						}
					})
					console.log("this.dailyList",this.dailyList);
					console.log("this.newUserTask", this.newUserTask);
				}
			})
		},
		*/
		toDetailed() {
			uni.navigateTo({ url: '/pages/donation/index' });
		},
		toShopBtn(){
			uni.navigateTo({ url: '/pages/donation/index' });
		},
		tipsBtn(){
			return
		},
		openDailyView(){
			this.showDailyAll = true
		},
		openUserView(){
			this.showUserAll = true
		}

	},
	mounted() {},
	onload() {},
	onShow() {
		this.fun_date(7)
		this.getUserInfo()
		this.getTaskList()
	}
};
</script>
<style lang="scss" scoped>
.container {
	position: relative;
	border-top: 1px solid transparent;
	border-bottom: 1px solid transparent;
	.bg {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 510rpx;
		background-repeat: no-repeat;
		background-size: cover;
		.detailed {
			position: absolute;
			color: #fff;
			font-size: 32rpx;
			letter-spacing: 2rpx;
			right: 30rpx;
			top: 20rpx;
		}

		.integration {
			position: absolute;
			top: 90rpx;
			width: 100%;
			color: #fff;
			font-size: 50rpx;
			text-align: center;
			text-shadow: 4rpx 4rpx 4rpx rgba(0, 0, 0, 0.1);
		}
		.toShopBtn{
			position: absolute;
			top: 185rpx;
			line-height: 70rpx;
			font-size: 34rpx;
			letter-spacing: 1rpx;
			text-align: center;
			color: #fff;
			padding: 0 35rpx;
			border-radius: 35rpx;
			background: #FAAD14;
		}
		.register{
			height: 210rpx;
			width: 94%;
			margin: 0 auto 10rpx;
			padding: 20rpx 10rpx;
			box-sizing: border-box;
			position: absolute;
			bottom: 10rpx;
			background: #fff;
			border-radius: 20rpx;
			.registerTxt{
				width: 100%;
				height: 54rpx;
				display: flex;
				align-items: center;
				.greenLabel {
					margin-left: 10rpx;
					width: 6rpx;
					height: 28rpx;
					background: linear-gradient(to bottom, #60E1E2, #45DB82);
				}
				.nowRegister {
					margin-left: 10rpx;
					font-size: 34rpx;
					font-weight: 600;
					span{
						margin: 0 6rpx;
						color: #FAAD14;
					}
				}
				.tips {
					margin-top: 10rpx;
					margin-left: 6rpx;
					font-size: 24rpx;
					color: #808080;
				}
				.tipsBtn{
					margin: 14rpx 0 0 6rpx;
					image{
						max-width: 30rpx;
						max-height: 30rpx;
					}
				}
			}
			.registerImgs{
				width: 100%;
				height: 130rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				.li{
					display: flex;
					justify-content: center;
					flex-wrap: wrap;
					align-items: center;
					height: 90rpx;
					box-sizing: border-box;
					.li-box{
						height: 90rpx;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						image{
							width: 60rpx;
							height: 60rpx;
						}
						.dateList{
							font-size: 24rpx;
							color: #666666;
							&.on{
								color: #FFA141;
							}
						}
						.li-nextDay{
							width: 60rpx;
							height: 60rpx;
							border-radius: 50%;
							background-color: #cccccc;
							display: flex;
							justify-content: center;
							align-items: center;
							span{
								font-size: 34rpx;
								color: #fff;
							}
						}
					}
					&.li+li::before{
						content: "";
						display: block;
						width: 30rpx;
						height: 2rpx;
						margin: 0 4rpx 30rpx;
						background-color: #cccccc;
					}
				}
			}
		}
	}
}
.dailyTask, .newUserTask{
	z-index: 5;
	position: relative;
	box-sizing: border-box;
	margin: 10rpx auto 0;
	padding: 0 2%;
	.hidview{
        position: absolute;
        z-index: 666;
        bottom: 0;
        left: 0;
        padding-bottom: 20rpx;
		border-bottom-left-radius: 30rpx;
		border-bottom-right-radius: 30rpx;
        background: #fff;
        width: 96%;
        height: 60rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow:0 -20rpx 50rpx rgba(255, 255, 255, 1);
        image{
            height: 15rpx;
            width: 30rpx;
            margin-right: 6rpx;
            margin-top: 10rpx;
        }
    }
    .off{
        display: none;
    }
}
.newUserTask{
	margin-top: 20rpx;
	padding-bottom: 20rpx;
}
</style>
