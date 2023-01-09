<template>
  <view>
    <view v-if="!full" :style="'height:' + (statusBarHeight + navigationHeight)+'px'"></view>
    <view
      class="navbar"
      :style="'height:' +(statusBarHeight + navigationHeight) +'px;background:'+bg+';'"
    >
      <view :style="'height:'+(statusBarHeight)+'px;'"></view>
      <view class="title-container" :style="'height:'+navigationHeight+'px;'">
        <view v-if="back || home" class="capsule">
          <view v-if="back" @click="toBack" class="container">
            <image
              mode="widthFix"
              class="img"
              :src="imgHOST+(whiteIcon?'/icon/nav-back-white.png':'/icon/nav-back.png')"
            />
          </view>
          <block v-if="home">
            <view class="split-line" :class="[whiteIcon?'border-white':'border']"></view>
            <view @click="backHome" class="container">
              <image
                mode="widthFix"
                class="img"
                :src="imgHOST+(whiteIcon?'/icon/nav-home-white.png':'/icon/nav-home.png')"
              />
            </view>
          </block>
        </view>
        <block v-if="isMessage">
          <view class="capsule">
            <navigator hover-class="none" url="/pages/my/message/message" class="message">
              <image mode="widthFix" :src="imgHOST+'/icon/message-icon.png'" />
              <view v-if="messageNo" class="number">
                <view>{{messageNo > 9 ? '9+' : messageNo}}</view>
              </view>
            </navigator>
          </view>
        </block>
        <view class="title" :style="textStyle">
          <block v-if="titleImg">
            <image mode="widthFix" class="img" :src="titleImg" :style="'width:'+titleImgW+';'" />
          </block>
          <block v-else>
            <slot name="title">{{text}}</slot>
          </block>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
const app = getApp();
export default {
  name: "gl-navbar",
  props: {
    isMessage: {
      type: Boolean,
      default: false
    },
    messageNo: {
      type: Number,
      default: 0
    },
    whiteIcon: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: "断舍哩"
    },
    titleImg: {
      type: String,
      default: ""
    },
    titleImgW: {
      type: String,
      default: "160rpx"
    },
    textStyle: {
      type: String,
      default: ""
    },
    backUrl: {
      type: String,
      default: ""
    },
    back: {
      type: Boolean,
      default: false
    },
    backFn: {
      type: Boolean,
      default: false
    },
    home: {
      type: Boolean,
      default: false
    },
    full: {
      type: Boolean,
      default: false
    },
    bg: {
      type: String,
      default: "#fff"
    }
  },
  data() {
    return {
      imgHOST: this.$common.util.imgHOST,
      statusBarHeight: app.globalData
        ? app.globalData.statusBarHeight
        : uni.getSystemInfoSync()["statusBarHeight"],
      navigationHeight: app.globalData
        ? app.globalData.navigationHeight
        : uni
            .getSystemInfoSync()
            .system.toLowerCase()
            .match("ios")
        ? 44
        : 48
    };
  },
  methods: {
    toBack() {
      if (this.backFn) {
        uni.$emit("backFn", {});
        return false;
      }
      if (getCurrentPages().length == 1) {
        if (this.backUrl) {
          return uni.redirectTo({
            url: this.backUrl
          });
        }
        uni.reLaunch({
          url: "/pages/index/index?isHome=true"
        });
      } else {
        uni.navigateBack({
          delta: 1
        });
      }
    },
    backHome() {
      uni.reLaunch({
        url: "/pages/index/index?isHome=true"
      });
    }
  },
  beforeMount() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
.navbar {
  width: 100%;
  position: fixed;
  z-index: 999;
  top: 0;

  .title-container {
    display: flex;
    align-items: center;
    position: relative;
    transition: 0.1s;

    .capsule {
      margin-left: 20rpx;
      height: 100%;
      display: flex;
      align-items: center;
      .split-line {
        height: 40rpx;
        &.border {
          border-left: 1px solid #777;
        }
        &.border-white {
          border-left: 1px solid #fff;
        }
      }
      .container {
        width: 80rpx;
        height: 100%;
        position: relative;
      }
      .img {
        width: 32rpx;
        height: 32rpx;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #000;
      position: absolute;
      left: 200rpx;
      right: 200rpx;
      font-size: 36rpx;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      .img {
        width: 160rpx;
        height: 30rpx;
      }
    }
    .message {
      display: flex;
      align-items: center;
      position: relative;
      text-align: center;
      color: $main-color;
      font-size: 20rpx;
      image {
        width: 50rpx;
        height: 50rpx;
      }
      .number {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: -6rpx;
        right: -6rpx;
        width: 32rpx;
        height: 32rpx;
        font-size: 10px;
        color: #fff;
        background-color: #ff5e41;
        border-radius: 50%;
      }
    }
  }
}
</style>