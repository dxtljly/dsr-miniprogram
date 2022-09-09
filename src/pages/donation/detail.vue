<template>
	<view style="height: 100%;box-sizing: border-box; background-color:#f0f2f5;">
		<gl-navbar back home text="众筹详情"></gl-navbar>
		<view class="container">
			<view class="header">
				<view class="head-tab">
					<view class="head-img">
						<image :src="user.userImg" mode="widthFix"></image>
					</view>
				</view>
			</view>
			
			<view class="details">

			</view>

			<view class="footer">

			</view>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			// user: local.get('Details'),
			user:{
				userImg: `${imgHOST}/donation/header.png`,
				userName: '云南省永胜县XX乡XX中学',
				userTimes: '2022-01-20 12:34:43'
			}
		}
	},
	onload(){

	},
	onShow() {

	},
	methods: {
		
	},
}
</script>
<style lang="scss" scoped>
	.container{
		height: 100%;
		background: #fff;
		box-sizing: border-box;
		view{
			box-sizing: border-box;
		}
		.header{
			width: 100%;
			height: 130rpx;
			position: fixed;
			padding: 14rpx;
			.head-tab{
				width: 100%;
				height: 100%;
				display: flex;
				border: 1rpx solid red;
				.head-img{
					
				}
			}
		}
	}
</style>