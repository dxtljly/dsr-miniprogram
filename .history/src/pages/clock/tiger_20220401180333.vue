<template>
  <view class="height: 70%">
    <gl-navbar back home text="上海加油"></gl-navbar>
    <view class="content">
      <view class="bg">
        <image mode="widthFix" class="bg-img" :src="imgHOST+'/上海加油.jpg'" />
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
  },
  onShareAppMessage(res) {
    //res.from
    return {
      title: "上海加油",
      imageUrl: this.imgHOST + "/tiger-forwarding.jpg",
      path: "/pages/clock/tiger"
    };
  },
  onShareTimeline(res) {
    return {
      title: "上海加油",
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