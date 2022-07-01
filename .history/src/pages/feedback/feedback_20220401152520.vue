<template>
  <view
    :style="'position:relative;height:calc(100% - ' + (statusBarHeight + navigationHeight) +'px);'"
  >
    <gl-navbar back home text="联系客服"></gl-navbar>
    <!-- <view
      class="container flx fx-middle fx-center"
      :style="'background-image:url(' + imgHOST + '/detail/bg.png);'"
    >
      <image mode="widthFix" :src="imgHOST+'/feedback.png'" @longtap="save" />
    </view> -->
    <button open-type="contact" bindcontact="handleContact"></button>
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
      navigationHeight: app.globalData.navigationHeight
    };
  },
  methods: {
     handleContact (e) {
        console.log(e.detail.path)
        console.log(e.detail.query)
    },
    save() {
      let src = imgHOST + "/feedback.png";
      uni.showActionSheet({
        itemList: ["保存图片"],
        success: res => {
          if (res.tapIndex == 0) {
            uni.showLoading();
            uni.getImageInfo({
              src: src,
              success: res => {
                uni.saveImageToPhotosAlbum({
                  filePath: res.path,
                  success: res => {
                    uni.showToast({
                      title: "保存成功"
                    });
                  },
                  fail: err => {
                    if (
                      err.errMsg == "saveImageToPhotosAlbum:fail auth deny" ||
                      err.errMsg ==
                        "saveImageToPhotosAlbum:fail authorize no response"
                    ) {
                      uni.showToast({
                        title: "获取授权保存图片",
                        icon: "none"
                      });
                      setTimeout(function() {
                        uni.navigateTo({
                          url: "/pages/my/auth/auth?scope=writePhotosAlbum"
                        });
                      }, 1300);
                    } else {
                      uni.showToast({
                        title: "保存失败",
                        icon: "none"
                      });
                    }
                  },
                  complete: () => {
                    uni.hideLoading();
                  }
                });
              },
              fail: err => {
                uni.showToast({
                  title: "获取保存图失败",
                  icon: "none"
                });
              }
            });
          }
        }
      });
    }
  },
  onLoad(options) {},
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
.container {
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
image {
  display: block;
  width: 100%;
}
</style>