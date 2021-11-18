<template>
  <view class="message-icon">
    <view class="content z-depth-1">
      <navigator hover-class="none" url="/pages/my/message/message">
        <image class="img" :src="imgHOST+'/icon/message-icon.png'" />
      </navigator>
    </view>
    <view v-if="messageNo" class="number">
      <view>{{messageNo > 9 ? '9+' : messageNo}}</view>
    </view>
  </view>
</template>
<script>
const app = getApp();
import { imgHOST, Host, xhr, allowTypes, local } from '@/common/util';
let animation = uni.createAnimation({
  duration: 100,
  timingFunction: 'ease'
});
export default {
  name: 'message-icon',
  props: {
    messageNo: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      imgHOST,
      bottom: 100,
      animationData: {}
    };
  },
  methods: {
    init(y) {
      animation.bottom(this.bottom).step();
      this.animationData = animation.export();
    },
    touchmove(e) {
      e.stopPropagation();
      let y = e.touches[0].pageY,
        screenHeight = uni.getSystemInfoSync()['screenHeight'],
        bottom = screenHeight - y - 20;
      bottom = bottom < 500 ? bottom : 500;
      bottom = bottom > 20 ? bottom : 20;
      this.bottom = bottom;
      this.init();
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="scss" scoped>
.message-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 220rpx;
  right: 0;
  width: 124rpx;
  height: 124rpx;
  .content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 104rpx;
    height: 104rpx;
    border-radius: 50%;
    background-color: #fff;

    .img {
      width: 56rpx;
      height: 50rpx;
    }
  }
  .number {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 20rpx;
    right: 20rpx;
    width: 30rpx;
    height: 30rpx;
    font-size: 14rpx;
    color: #fff;
    background-color: #ff5e41;
    border-radius: 50%;
  }
}
</style>