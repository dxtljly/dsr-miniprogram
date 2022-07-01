<template>
  <view class="height: 100%">
    <gl-navbar back home text="断舍li广告合作"></gl-navbar>
    <view class="content">
      <view class="bg">
        <image mode="widthFix" class="bg-img" :src="imgHOST+'/断舍哩广告合作 - detail.jpg'" />
      </view>
    </view>
  </view>
</template>
<script>
const app = getApp();
import {
  imgHOST,
  Host,
  xhr,
  allowTypes,
  local,
  getUrlParam,
  shareContent
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
      title: shareContent.title,
      imageUrl: shareContent.img,
      path: "/pages/clock/cooperation"
    };
  },
  onShareTimeline(res) {
    return {
      title: shareContent.title,
      imageUrl: shareContent.img,
      path: "/pages/clock/cooperation"
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
  }
</style>