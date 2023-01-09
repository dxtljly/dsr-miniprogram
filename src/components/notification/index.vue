<template>
  <view>
    <image
      class="icon-attention"
      mode="widthFix"
      :src="imgHOST+'/icon/icon-attention.png'"
      @click="()=>this.isShowModal=true"
    />
    <!-- <view class="icon-notification z-depth-2" @click="()=>this.isShowModal=true">
      <view>
        <image mode="widthFix" :src="imgHOST+'/icon/notification.png'" />
        <view>通知</view>
      </view>
    </view>-->
    <block v-if="isShowModal">
      <view class="modal">
        <view class="bg" @click="()=>this.isShowModal=false"></view>
        <image mode="widthFix" :src="imgHOST+'/detail/wechat.png'" @longtap="saveWeChat" />
      </view>
    </block>
  </view>
</template>
<script>
const app = getApp();
import { imgHOST, xhr, allowTypes, local } from '@/common/util';
export default {
  name: 'notification',
  props: {},
  data() {
    return {
      imgHOST,
      statusBarHeight: app.globalData.statusBarHeight,
      navigationHeight: app.globalData.navigationHeight,
      isShowModal: false,
    };
  },
  methods: {
    saveWeChat() {
      uni.showLoading({ title: '保存中···' });
      uni.getImageInfo({
        src: this.imgHOST + '/detail/保存下来图.png',
        success: (res) => {
          console.log(res);
          uni.hideLoading();
          uni.saveImageToPhotosAlbum({
            filePath: res.path,
            success: (res) => {
              uni.showToast({
                title: '保存成功',
              });
              setTimeout(function () {
                this.isShowModal = false;
              }, 1300);
            },
            fail: (err) => {
              if (
                err.errMsg == 'saveImageToPhotosAlbum:fail auth deny' ||
                err.errMsg ==
                  'saveImageToPhotosAlbum:fail authorize no response'
              ) {
                uni.showToast({
                  title: '获取授权保存图片',
                  icon: 'none',
                });
                setTimeout(function () {
                  uni.navigateTo({
                    url: '/pages/my/auth/auth?scope=writePhotosAlbum',
                  });
                }, 1300);
              }
            },
          });
        },
      });
    },
  },
};
</script>
<style lang="scss">
.icon-attention {
  position: fixed;
  z-index: 99;
  right: 0;
  bottom: 16%;
  width: 100rpx;
  height: 100rpx;
}
.icon-notification {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 99;
  right: 0;
  bottom: 16%;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: $main-color-1;
  text-align: center;
  color: #fff;
  font-size: 8px;
  image {
    width: 40rpx;
    height: 40rpx;
  }
}
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(30, 30, 30, 0.3);
  }
  image {
    width: 60%;
    z-index: 9;
    border-radius: 18rpx;
  }
}
</style>