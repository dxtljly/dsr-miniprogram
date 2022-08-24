<template>
    <view style="height: 100%;">
        <gl-navbar back home text="公益捐赠"></gl-navbar>
		<view class="container">
			<!-- title head -->
			<view class="title-top">
				<view class="title-txt">捐赠项目</view>
				<navigator class="title-more">更多 >
				</navigator>
			</view>

			<scroll-view scroll-y enable-flex>
				
			</scroll-view>
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
		border-bottom: 1rpx solid #d9d9d9;
		.title-txt{
			width: 30%;
			line-height: 80rpx;
			position: absolute;
			left: 30rpx;
			font-size: 40rpx;
			font-weight: 600;
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
}
</style>