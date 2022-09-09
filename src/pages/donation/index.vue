<template>
    <view style="height: 100%;">
        <gl-navbar back home text="公益捐赠"></gl-navbar>
		<view class="container">
			<!-- title head -->
			<view class="title-top">
				<view class="title-txt">捐赠项目</view>
				<navigator class="title-more" hover-class="none">
					更多 >
				</navigator>
			</view>

			<view class="scroll-box fx" style="height: 80%">
				<view v-for="(item,index) in List" :key="index" class="detail-index z-depth-2">
					<view class="detail-li" hover-class="none" @click="toDetails(item)">
					<!-- <navigator class="detail-li" hover-class="none" :url="item.url"> -->
						<view class="detail-lft flx fx-column fx-center">
							<image :src="item.img" mode="widthFix" lazy-load />
						</view>
						<view class="detail-ght">
							<view class="detail-title">
								{{item.title}}
							</view>
							<view class="details">
								{{item.details}}
							</view>
							<view class="detail-type">
								{{item.types}}
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="footer-btn">
				<view class="btn flx fx-center fx-middle" @click="addObject">
					发起项目
				</view>
			</view>
		</view>
    </view>
</template>
<script>
import {
  imgHOST,
  Host,
  xhr,
  allowTypes, 
  local,
  shareContent
} from "@/common/util";
export default {
    data() {
		return {
			List:[
				{
					img:`${imgHOST}/donation/demo.jpg`,
					title:'XX山区小学急需爱心捐助',
					details:'xxx小学位于广西边远山区，当地交通不便，教育资源匮乏，急需社会瓦达瓦达瓦大',
					types:"筹集中"
				},
				{
					img:`${imgHOST}/donation/demo.jpg`,
					title:'XX山区小学急需爱心捐助',
					details:'xxx小学位于广西边远山区，当地交通不便，教育资源匮乏，急需社会瓦达瓦达瓦大',
					types:"筹集中"
				},
				{
					img:`${imgHOST}/donation/demo.jpg`,
					title:'XX山区小学急需爱心捐助',
					details:'xxx小学位于广西边远山区，当地交通不便，教育资源匮乏，急需社会瓦达瓦达瓦大',
					types:"筹集中"
				},
				{
					img:`${imgHOST}/donation/demo.jpg`,
					title:'XX山区小学急需爱心捐助',
					details:'xxx小学位于广西边远山区，当地交通不便，教育资源匮乏，急需社会瓦达瓦达瓦大',
					types:"筹集中"
				},
			]
		}
	},
	onLoad() {
		
	},
	methods:{
		addObject(){
			return
		},
		toDetails(item){
			let Details = item
			local.set('Details',Details);
			uni.navigateTo({ url: "/pages/donation/detail" })
		}
	}
}
</script>
<style lang="scss" scoped>
.container{
	width: 100%;
	margin-top: 10rpx;
	background: #fff;
	.title-top{
		width: 100%;
		height: 80rpx;
		position: relative;
		border-bottom: 1rpx solid #ccc;
		.title-txt{
			width: 30%;
			line-height: 80rpx;
			position: absolute;
			left: 30rpx;
			font-size: 40rpx;
			font-weight: 600;
			color: black;
		}
		.title-more{
			line-height: 80rpx;
			position: absolute;
			right: 30rpx;
			color: '#7f5e49';
			font-size: 28rpx;
			font-weight: 600;
		}
	}
	
	.scroll-box{
		box-sizing: border-box;
		width: 100%;
		padding: 15rpx 20rpx;
		.detail-index{
			box-sizing: border-box;
			width: 100%;
			padding: 22rpx 22rpx 18rpx;
			margin: 10rpx 0 20rpx;
			border: 1rpx solid #ccc;
			border-radius: 25rpx;
			.detail-li{
				display: flex;
				width: 100%;
				height: 180rpx;
				// border: 1rpx solid #f1eff2;
				.detail-lft{
					width: 35%;
					// border: 1rpx solid blue;
					image{
						width: 100%;
					}
				}
				.detail-ght{
					position: relative;
					width: 60%;
					margin-left: 20rpx;
					.detail-title{
						line-height: 62rpx;
						font-size: 32rpx;
						letter-spacing: 2rpx;
						font-weight: 600;
						color: black;
						overflow:hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					.details{
						height: 75rpx;
						line-height: 38rpx;
						font-size: 24rpx;
						color: #8a878a;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					.detail-type{
						right: 0;
						bottom: 0;
						padding: 0 16rpx;
						line-height: 36rpx;
						font-size: 24rpx;
						position: absolute;
						color: #fff;
						background-color: #fa6c55;
						border-radius: 25rpx;
					}
				}
			}
		}
	}
	
	.footer-btn{
		width: 100%;
		height: 150rpx;
		background-color: #fff;
		position: fixed;
		box-sizing: border-box;
		padding: 20rpx 36rpx 30rpx;
		bottom: 0;
		z-index: 66;
		.btn{
			width: 100%;
			height: 100%;
			background-color: #f7703e;
			color: #fff;
			font-size: 34rpx;
			letter-spacing: 4rpx;
		}
	}
}
</style>