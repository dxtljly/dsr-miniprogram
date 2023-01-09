<template>
  <view style="height:100%;">
    <gl-navbar back home text="宠粉活动"></gl-navbar>
    <image mode="widthFix" :src="imgHOST+'/宠粉活动/olay/head.jpg'" style="display:block;width:100%;" />
    <image
      mode="widthFix"
      :src="imgHOST+'/宠粉活动/olay/copy-wechat.jpg'"
      style="display:block;width:100%;height:0;"
      @click="copyWX"
    />
    <image
      mode="widthFix"
      :src="imgHOST+'/宠粉活动/olay/detail.jpg'"
      style="display:block;width:100%;height:0;"
      @click="toQr"
    />
    <button hover-class="none" open-type="share">
      <image
        mode="widthFix"
        :src="imgHOST+'/宠粉活动/olay/invite.jpg'"
        style="display:block;width:100%;height:0;"
      />
    </button>
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
      imgHOST,
      statusBarHeight: app.globalData.statusBarHeight,
      navigationHeight: app.globalData.navigationHeight,
      user: local.get("user")
    };
  },
  methods: {
    copyWX() {
      uni.setClipboardData({
        data: "salmonisaboy",
        success: () => {
          uni.showToast({
            title: "复制成功"
          });
        }
      });
    },
    toQr() {
      uni.navigateTo({
        url: "/pages/spa/qr/list"
      });
    }
  },
  mounted() {},
  onLoad(options) {},
  onShow() {
    this.user = local.get("user");
  },
  onShareAppMessage(res) {
    //res.from
    return {
      title: shareContent.title,
      imageUrl: this.imgHOST + "/宠粉活动/olay/share.jpg",
      path: "/pages/activity/olay"
    };
  },
  onShareTimeline(res) {
    return {
      title: shareContent.title,
      imageUrl: this.imgHOST + "/宠粉活动/olay/share.jpg",
      path: "/pages/activity/olay"
    };
  }
};
</script>
<style lang="scss" scoped>
</style>