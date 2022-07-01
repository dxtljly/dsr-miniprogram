<template>
  <view class="height: 70%">
    <gl-navbar back home text="上海"></gl-navbar>
    <view class="content">
      <view class="bg">
        <image mode="widthFix" class="bg-img" :src="imgHOST+'/tiger-year.jpg'" />
      </view>
      <view class="btn" @click="copyWX">
        <image mode="widthFix" class="btn-img" :src="imgHOST+'/tiger-year-btn.png'" />
      </view>
    </view>
  </view>
</template>
<script>
const app = getApp();
import {
  imgHOST
} from "@/common/util";
export default {
  data() {
    return {
      imgHOST,
      statusBarHeight: app.globalData.statusBarHeight,
      navigationHeight: app.globalData.navigationHeight
    };
  },
  methods: {
    copyWX() {
      uni.setClipboardData({
        data: "15026808450",
        success: () => {
          uni.showToast({
            title: "复制成功"
          });
        }
      });
    }
  },
  onShareAppMessage(res) {
    //res.from
    return {
      title: "断舍哩 - 虎年福利",
      imageUrl: this.imgHOST + "/tiger-forwarding.jpg",
      path: "/pages/clock/tiger"
    };
  },
  onShareTimeline(res) {
    return {
      title: "断舍哩 - 虎年福利",
      imageUrl: this.imgHOST + "/tiger-forwarding.jpg",
      path: "/pages/clock/tiger"
    };
  }
};
</script>
<style lang="scss" scoped>
  .content{
    .bg{
      .bg-img{
        height:100%;
        width:100%;
      }
    }
    .btn{
      .btn-img{
        height:30%;
        width:90%;
        transform: translateY(-190%) translateX(6%);
      }
    }
  }
</style>