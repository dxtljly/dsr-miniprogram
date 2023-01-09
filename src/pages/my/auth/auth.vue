<template>
  <view style="height:100%;">
    <gl-navbar back home></gl-navbar>
    <view
      class="flx fx-middle fx-center"
      :style="'height:calc(100% - '+(statusBarHeight+navigationHeight)+'px);background:#fff;'"
    >
      <view class="content">
        <image mode="widthFix" :src="imgHOST+'/logo.png'" class="logo" />
        <button
          class="outline"
          open-type="openSetting"
          @opensetting="bindOpenSetting"
          :data-scope="scope"
        >
          <image mode="widthFix" :src="imgHOST+'/icon/wechat-on.png'" />获取授权
        </button>
      </view>
    </view>
  </view>
</template>
<script>
const app = getApp();
import { Host, xhr, allowTypes, local, shareContent } from "@/common/util";
export default {
  data() {
    return {
      imgHOST: this.$common.util.imgHOST,
      statusBarHeight: app.globalData.statusBarHeight,
      navigationHeight: app.globalData.navigationHeight,
      scope: ""
    };
  },
  methods: {
    bindOpenSetting(e) {
      console.log(e);
      let scope = e.currentTarget.dataset.scope;
      let authSetting = e.detail.authSetting;
      let key = "scope." + scope;
      console.log(key);
      if (authSetting[key]) uni.navigateBack({ delta: 1 });
    }
  },
  onLoad(options) {
    this.scope = options.scope;
  },
  onShow() {},
  onShareAppMessage(res) {
    //res.from
    return {
      title: shareContent.title,
      imageUrl: shareContent.img,
      path: "/pages/index/index"
    };
  },
  onShareTimeline(res) {
    return {
      title: shareContent.title,
      imageUrl: shareContent.img,
      path: "/pages/index/index"
    };
  }
};
</script>
<style lang="scss" scoped>
.content {
  padding-bottom: 120rpx;
  text-align: center;
  .logo {
    margin-bottom: 80rpx;
    width: 164rpx;
    height: 164rpx;
  }
  button {
    width: 400rpx;
    height: 80rpx;
    line-height: 80rpx;
    font-size: 32rpx;
    font-weight: normal;
    color: #fff;
    background-color: $main-color;
    border-radius: 40rpx;
    &::after {
      border: none;
    }
    &.outline {
      background-color: #fff;
      color: $main-color;
      border: 1px solid $main-color;
    }
    image {
      width: 48rpx;
      height: 48rpx;
      vertical-align: middle;
      margin-right: 20rpx;
    }
  }
}
</style>