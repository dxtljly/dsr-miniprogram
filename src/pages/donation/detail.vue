<template>
	<view style="height: 100%;box-sizing: border-box; background-color:#f0f2f5;">
		<gl-navbar back home text="众筹详情"></gl-navbar>
		<block v-if="tipIime && presendId">
			<!-- #A9E6D4 color:#24775F; -->
			<view id="top-tip">
				<view class="tip">
					<span>倒计时</span>{{tipIime}}
				</view>
			</view>
		</block>
		<view class="container">
			<view class="header">
				<view class="head-tab flx">
					<view class="head-img"><image :src="detailMsg.userImg" mode="aspectFill"></image></view>
					<view class="head-title flx fx-column fx-around">
						<view class="head-user">{{ detailMsg.userName }}</view>
						<view class="head-time">{{ detailMsg.userTimes }}</view>
					</view>
					<view v-if="!presendId" class="seeDetail" >查看详情>></view>
				</view>
			</view>
			<view class="content">
				<view v-if="presendId" class="prices flx fx-center fx-middle">
					<view class="price-lft flx fx-column fx-center fx-middle">
						500
						<view class="price-txt">急需快递费(元)</view>
					</view>
					<view style="height:100rpx;border-left: 1rpx solid #ccc;"></view>
					<view class="price-ght flx fx-column fx-center fx-middle">
						200
						<view class="price-txt">已筹到快递费(元)</view>
					</view>
				</view>
				<view class="details flx fx-column">
					<view class="txt-title">{{ detailMsg.title }}</view>
					<view class="txt-details">
						<text user-select="true">{{ text }}</text>
						<block v-if="detailMsg.imgs">
							<view v-for="(itmImg,idx) in detailMsg.imgs" :key="idx" class="detail-img">
								<image
									:src="itmImg[idx]"
									mode="width"
								/>
							</view>
						</block>
					</view>
				</view>
				<view class="material">
					<viwe style="display: block;;width: 100%;line-height: 70rpx;font-size: 38rpx;font-weight: bold;text-align: center;letter-spacing: 2rpx;margin-bottom: 10rpx;">
						{{presendId?"帮助记录":"拟捐物资"}}
					</viwe>
					<block v-if="!presendId">
						<block v-if="list.length">
							<view style="width: 100%;;min-height:500px;margin-top: 6rpx;">
								<dona-list :list="list" :isLastPage="isLastPage" />
							</view>
						</block>
						<block v-else>
							<view
								style="width: 100%;min-height:300rpx;background: #fafafa;color: #ccc;
								font-size: 40rpx;text-align: center;line-height: 100rpx;"
							>
								暂无捐赠信息
							</view>
						</block>
					</block>
					<block v-else>
						<view class="presend-li" v-for="(itm2,idx2) in presendList" :key="idx2">
							<view class="presend-tab flx">
								<view class="presend-img"><image :src="itm2.userImg" mode="aspectFill"></image></view>
								<view class="presend-title flx fx-column fx-around">
									<view class="presend-user">{{ itm2.userName }}</view>
									<view class="presend-time">{{ itm2.userTimes }}</view>
								</view>
								<view class="presend-money">捐赠了<span>{{itm2.money}}</span>元</view>
							</view>
						</view>
					</block>
				</view>
				<view style="width:100%;height:110rpx;background: #fff;"></view>
			</view>
		</view>
		<view class="footer z-depth-1">
			<block v-if="!presendId">
				<block v-if="false"><view class="btn-emit" @click="toEmit">编辑资料</view></block>
				<block v-else><view class="btn-give" @click="toSendGoods">捐赠物资</view></block>
			</block>
			<block v-else>
				<view class="btn-give" @click="toGiveMoney">捐快递费</view>
			</block>
		</view>
	</view>
</template>
<script>
import { imgHOST, Host, xhr, allowTypes, local, shareContent } from '@/common/util';
export default {
	data() {
		return {
			imgHOST,
			user: local.get('user'),
			tipIime:"12天34时42分21秒",
			searchId: null,
			detailMsg: {
				id: 'adacaw8584waedacaw52',
				userImg: `${imgHOST}/donation/header.png`,
				userName: '云南省永胜县XX乡XX中学',
				userTimes: '2022-01-20 12:34:43',
				title: 'XX中学急需爱心物资捐赠'
			},
			rows: 10,
			skip: 0,
			isLastPage: false,
			isLoadEnd: true,
			list: [],
			itemIdList: [],
			text: [
				'HBuilder，500万开发者选择的IDE \n',
				'MUI，轻巧、漂亮的前端开源框架',
				'wap2app，M站快速转换原生体验的App',
				'5+Runtime，为HTML5插上原生的翅膀',
				'HBuilderX，轻巧、极速，极客编辑器',
				'uni-app，终极跨平台方案',
				'HBuilder，500万开发者选择的IDE',
				'MUI，轻巧、漂亮的前端开源框架',
				'wap2app，M站快速转换原生体验的App',
				'5+Runtime，为HTML5插上原生的翅膀',
				'HBuilderX，轻巧、极速，极客编辑器',
				'uni-app，终极跨平台方案',
				'......'
			],
			// presendId:null,
			presendId:'wadaw5413wadavwad5',
			presendList:[
				{
					id: 'adacaw8584waedacaw52',
					userImg: `${imgHOST}/donation/header.png`,
					userName: '爱心人士',
					userTimes: '2022-10-13 12:34:43',
					money: '5.00'
				},
				{
					id: 'adacaw8584waedacaw52',
					userImg: `${imgHOST}/donation/header.png`,
					userName: '王老五',
					userTimes: '2022-08-20 12:34:43',
					money: '20.00'
				},
				{
					id: 'adacaw8584waedacaw52',
					userImg: `${imgHOST}/donation/header.png`,
					userName: '思路清晰',
					userTimes: '2022-01-16 12:34:43',
					money: '10000.00'
				}
			]
		};
	},
	methods: {
		countTime(date) {
			let countTime = date;

			try {
				let subTime = Date.now() - new Date(date).getTime();
				if (subTime < 60 * 1000) {
				countTime = "刚刚";
				} else if (subTime < 60 * 60 * 1000) {
				countTime = Math.ceil(subTime / (60 * 1000)) + "分钟前";
				} else if (subTime <= 24 * 60 * 60 * 1000) {
				countTime = Math.ceil(subTime / (60 * 60 * 1000)) + "小时前";
				} else if (subTime < 7 * 24 * 60 * 60 * 1000) {
				countTime = Math.ceil(subTime / (24 * 60 * 60 * 1000)) + "天前";
				} else {
				countTime = date.replace(/\s+/, " ").split(" ")[0];
				}
			} catch (err) {
				countTime = date.replace(/\s+/, " ").split(" ")[0];
			}
			return countTime;
		},
		getList(e) {
			if (!this.isLoadEnd || this.isLastPage) {
				return false;
			}
			if (e) {
				if (e.type == 'scrolltolower') {
					this.skip += this.rows;
				}
			}
			this.isLoadEnd = false;
			let url = '/items/',
				data = {
					skip: this.skip,
					waterfall: 1,
					sp: 0
				};
			if (this.searchId) {
				data.id = this.searchId;
			}
			console.log('data', data);
			xhr.get(url, data, res => {
				this.isLoadEnd = true;
				console.log('res', res);
				if (res.statusCode == 200) {
					res.data.items.forEach(v => {
						if (this.itemIdList.indexOf(v.id) < 0) {
							this.list.push(v);
							this.itemIdList.push(v.id);
						}
					});
					console.log(this.list);
					if (res.data.items.length < 10) {
						this.isLastPage = true;
					}
				}
			});
		}
	},
	onload(options) {
		if (options.scene) {
			let scene = getUrlParam(decodeURIComponent(options.scene).replace(/^\?/, ''));
			options = scene;
		}
		if (options.detailId) {
			this.searchId = options.detailId;
		}

		if( options.presendId){
			this.presendId = options.presendId
		}

		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		});
	},
	onShow() {
		this.getList();
	},
	onShareAppMessage(res) {
		//res.from
		let path = `/pages/donation/detail?detailId=${this.detailMsg.id}`;
		let title = this.detailMsg.title;
		console.log(path);
		return {
			title,
			imageUrl: this.imgHOST + '/clock/share.jpg',
			path
		};
	},
	onShareTimeline(res) {
		//res.from
		let path = `/pages/donation/detail?detailId=${this.detailMsg.id}`;
		let title = this.detailMsg.title;
		return {
			title,
			imageUrl: this.imgHOST + '/clock/share.jpg',
			path
		};
	}
};
</script>
<style lang="scss" scoped>
view {
	box-sizing: border-box !important;
}
.tip {
	position: relative;
	background: rgba(255, 111, 106, 0.15);
	padding: 16rpx 40rpx;
	color: #ff6f6a;
	font-size: 12px;
	text-align: center;
	font-weight: bold;
	span{
		margin-right: 14rpx;
	}
}
.container {
	min-height: 715rpx;
	background: #fff;
	.header, .presend-li {
		width: 100%;
		height: 140rpx;
		position: relative;
		padding: 15rpx;
		border-bottom: 1rpx solid #ccc;
		.head-tab, .presend-tab {
			width: 100%;
			height: 100%;
			padding: 10rpx;
			position: relative;
			.head-img, .presend-img {
				width: 100%;
				height: 100%;
				max-width: 90rpx;
				border-radius: 50%;
				overflow: hidden;
				margin-right: 10rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.head-title, .presend-title {
				max-width: 410rpx;
				overflow: hidden;
				height: 100%;
				.head-user, .head-time, .presend-user {
					line-height: 40rpx;
					font-size: 30rpx;
					font-weight: bold;
					letter-spacing: 1rpx;
					text-overflow: ellipsis;
					white-space: nowrap;
					color: #ff674c;
				}
				.head-time, .presend-time {
					font-size: 24rpx;
					color: #c0c0c0;
				}
			}
			.seeDetail {
				position: absolute;
				top: calc((100% - 44rpx) / 2);
				right: 20rpx;
				line-height: 44rpx;
				height: 44rpx;
				font-size: 28rpx;
				padding: 0 8rpx;
				background: #ccc;
				color: #fff;
			}
		}
	}
	.content {
		width: 100%;
		height: 100%;
		padding: 0 15rpx;
		background: #fafafa;
		.prices{
			width: 100%;
			height: 160rpx;
			.price-lft, .price-ght{
				width: 49%;
				height: 100%;
				box-sizing: border-box;
				color: #FF5E41;
				font-size: 54rpx;
				letter-spacing: 4rpx;
				.price-txt{
					color: #000;
					font-size: 34rpx;
					letter-spacing: 0;
				}
			}
		}
		.details {
			width: 100%;
			margin-top: 10rpx;
			background: #fff;
			.txt-title {
				width: 100%;
				line-height: 70rpx;
				min-height: 70rpx;
				font-size: 36rpx;
				font-weight: bold;
				padding: 0 12rpx;
			}
			.txt-details {
				width: 100%;
				padding: 0 12rpx 10rpx;
				min-height: 50rpx;
				.detail-img{
					width: 100%;
				}
			}
		}
		.material {
			width: 100%;
			margin-top: 30rpx;
			background: #fff;
			border-bottom: 1rpx solid #f0f0f0;
			.presend-li{
				height: 130rpx;
				border-bottom: none;
				padding: 10rpx 0;
				.presend-img{
					margin-right: 20rpx;
				}
				.presend-title{
					max-width: 250rpx;
					text-overflow: ellipsis;
					white-space: nowrap;
					.presend-user{
						color: #000;
						line-height: 36rpx;
						font-size: 30rpx;
						letter-spacing: 0;
					}
					.presend-time{
						color: #808080;
					}
				}
				.presend-money{
					max-width: 300rpx;
					line-height: 40rpx;
					position: absolute;
					right: 20rpx;
					top: calc( (100% - 40rpx) / 2 );
					span{
						color: #FF5E41;
						padding: 0 8rpx;
					}
				}
			}
		}
	}
	
}
.footer {
	width: 100%;
	height: 110rpx;
	position: fixed;
	background: #fff;
	bottom: 0;
	padding: 10rpx 20rpx;
	z-index: 999;
	display: flex;
	flex-direction: row-reverse;
	.btn-emit,
	.btn-give {
		color: #fff;
		background: #ff5e41;
		border-radius: 45rpx;
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
	}
	.btn-emit {
		width: fit-content;
		padding: 0 40rpx;
		margin-right: 0;
	}
	.btn-give {
		width: 100%;
		letter-spacing: 2rpx;
	}
}
</style>
