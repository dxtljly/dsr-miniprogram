<template>
  <view class="bg">
    <gl-navbar back home :titleImg="imgHOST+'/icon/毕业季-title.png'"></gl-navbar>
    <image
      mode="widthFix"
      :src="imgHOST+'/上架书籍活动.png'"
      style="display:block;width:100%;"
      @click="copyWechat"
    />
    <view style="height:140rpx;"></view>
    <navigator
      hover-class="none"
      url="/pages/goods/add/add?school=1&book=1"
      class="btn z-depth-1"
    >立即上架</navigator>
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
      navigationHeight: app.globalData.navigationHeight,
      awards: []
    };
  },
  methods: {
    copyWechat() {
      uni.setClipboardData({
        data: "salmonisaboy",
        success: res => {
          uni.showToast({
            title: "复制微信号成功"
          });
        }
      });
    }
  },
  computed: {},
  mounted() {},
  onLoad(options) {
    if (options.scene) {
      let scene = getUrlParam(
        decodeURIComponent(options.scene).replace(/^\?/, "")
      );
      options = scene;
    }
  },
  onShow() {},
  onShareAppMessage(res) {
    //res.from
    return {
      title: shareContent.title,
      imageUrl: this.imgHOST + "/share-上架书籍活动.png",
      path: "/pages/school/book"
    };
  },
  onShareTimeline(res) {
    return {
      title: shareContent.title,
      imageUrl: this.imgHOST + "/share-上架书籍活动.png",
      path: "/pages/school/book"
    };
  }
};
</script>

<style lang="scss" scoped>
.bg {
  background-color: #f3746f;
}
.btn {
  position: fixed;
  bottom: 60rpx;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 600rpx;
  height: 100rpx;
  font-size: 20px;
  font-weight: bold;
  color: #f3746f;
  border-radius: 50rpx;
  background-color: #fed577;
}
</style>
