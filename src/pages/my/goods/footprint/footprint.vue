<template>
  <view
    class="home"
    :style="'position:relative;height:calc(100% - ' + (statusBarHeight + navigationHeight) +'px);'"
  >
    <gl-navbar back home text="送出足迹"></gl-navbar>
    <view class="statistical-text">
      <text class="head">您已点亮<text class="num">10{{}}</text>个城市和地区</text>
    </view>
  </view>
</template>
<script>
  export default{
    data() {
      return {
      };
    }
  }
</script>
<style lang="scss" scoped>
  .home{
    width: 100%;
    height: 100%;
    background-color: #b9dabf;
    .statistical-text{
      width: 700rpx;
      height: 270rpx;
      background-color: #24775f;
      border-radius: 50rpx;
      transform: translateX(3.5%) translateY(326%);
      .head{
        letter-spacing: 4rpx;
        font-weight: 500;
        margin-left: 60rpx;
        margin-top: 60rpx;
        font-size: 36rpx;
        color: #fff;
        .num{
          font-size: 50rpx;
        }
      }
    }
  }
</style>
