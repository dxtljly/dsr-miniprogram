<template>
  <view style="height:100%;">
    <gl-navbar back home></gl-navbar>
    <web-view :src="url" text="推广大使"></web-view>
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
  shareContent
} from "@/common/util";
export default {
  data() {
    return {
      imgHOST: this.$common.util.imgHOST,
      statusBarHeight: app.globalData.statusBarHeight,
      navigationHeight: app.globalData.navigationHeight,
      url: "",
      isRedirect: false
    };
  },
  methods: {},
  onLoad(options) {
    if (options.url) {
      let url = options.url;
      url = url
        .replace(/\|\|\|/, "?")
        .replace(/###/g, "&")
        .replace(/---/g, "=");
      this.url = url;
    }
  },
  onShow() {
    if (this.url == "https://w.url.cn/s/ATHVQ5t#wechat_redirect") {
      if (!this.isRedirect) {
        this.isRedirect = true;
      } else {
        uni.navigateBack();
      }
    }
  },
  onShareAppMessage(res) {
    //res.from
    return {
      title: shareContent.title,
      imageUrl: shareContent.img,
      path: "/pages/webviews/webviews?url=" + this.url
    };
  },
  onShareTimeline(res) {
    return {
      title: shareContent.title,
      imageUrl: shareContent.img,
      path: "/pages/webviews/webviews?url=" + this.url
    };
  }
};
</script>
<style lang="scss" scoped>
</style>