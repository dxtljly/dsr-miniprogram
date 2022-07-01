<template>
  <view class="height: 100%">
    <gl-navbar back home text="商家自主上架"></gl-navbar>
    <view class="content">
      <view class="bg">
        <image mode="widthFix" class="bg-img" :src="imgHOST+'/content-商家自主上架.jpg'" />
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
      title: "商家自主上架",
      imageUrl: this.imgHOST + "/clock/head.jpg",
      path: "/pages/block/independentStores"
    };
  },
  onShareTimeline(res) {
    return {
      title: "商家自主上架",
      imageUrl: this.imgHOST + "/clock/head.jpg",
      path: "/pages/block/independentStores"
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