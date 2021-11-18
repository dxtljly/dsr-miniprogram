<template>
  <view
    :style="'position:relative;height:calc(100% - ' + (statusBarHeight + navigationHeight) +'px);'"
  >
    <gl-navbar back home text="我的券码"></gl-navbar>
    <block v-if="config.banner">
      <view style="text-align:center;margin:20rpx 30rpx;">
        <swiper
          class="banner"
          autoplay
          :indicator-dots="config.banner.length > 1"
          circular
          :interval="4000"
        >
          <block v-for="(item,index) in config.banner" :key="index">
            <swiper-item>
              <navigator
                hover-class="none"
                v-if="item.url || item.path"
                :target="item.target ? 'miniProgram':'self'"
                :url="item.url"
                :open-type="item.openType || 'navigate' "
                :appId="item.appId"
                :path="item.path"
              >
                <image mode="widthFix" :src="item.img" />
              </navigator>
              <image v-else mode="widthFix" :src="item.img" />
            </swiper-item>
          </block>
        </swiper>
      </view>
    </block>
    <view v-if="!list.length">
      <view
        class="null flx fx-middle fx-center"
        :style="'height:calc(100% - '+(statusBarHeight+navigationHeight)+'px);'"
      >
        <view class="tx-center">
          <image
            mode="widthFix"
            :src="imgHOST+'/icon/null.png'"
            style="width:400rpx;height:400rpx;margin-bottom:30rpx;"
          />
          <view>暂无券码哩~</view>
        </view>
      </view>
      <!-- <image
        mode="widthFix"
        :src="imgHOST+'/日置名媛-detail.jpg'"
        style="display:block;width:100%;"
        @click="copyWeChat"
      />-->
    </view>
    <block v-else>
      <!-- <view
        class="tx-center fcmain"
        style="padding:10px;font-size:12px;"
        @click="previewImg"
      >查看活动详情 >></view>-->
      <block v-for="(item,index) in list" :key="index">
        <view class="qr-li">
          <view :style="item.coupon.status==2?'color:#bbb;':''" @click="previewImg(item.to_use)">
            <view>{{item.title}}</view>
            <view class="fcmain" style="font-size:10px;font-weight:400;padding:20rpx 0;">使用说明</view>
          </view>
          <view class="tx-center" @click="showQr(item)">
            <image mode="widthFix" :src="imgHOST+'/icon/qr.png'" />
            <view class="fcbbb" style="font-size:10px;">查看二维码</view>
          </view>
          <block v-if="!item.coupon">
            <view
              v-if="item.id==='600e9cc9d2bf08ce5795a0c9'"
              class="join"
              @click="toClaim(item.id)"
            >待领取</view>
            <view v-else class="join" @click="previewImg(item.to_join)">去领取</view>
          </block>
          <view v-if="item.coupon.status==2" class="used" @click="previewImg(item.to_join)">已核销</view>
        </view>
      </block>
      <view class="tx-center fcbbb" style="margin:15px;font-size:12px;">- 到底了 -</view>
    </block>

    <view class="qr-modal" :class="{'on':isShowQrModal}">
      <view class="bg" @click="closeQr"></view>
      <view class="canvas">
        <view
          v-if="qrTxt && qrTxt.title"
          class="tx-center"
          style="margin-bottom:20px;"
        >断舍哩 ✖️ {{qrTxt.title}}</view>
        <canvas canvas-id="qr"></canvas>
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
  Qr,
  shareContent
} from "@/common/util";

export default {
  data() {
    return {
      imgHOST,
      Host,
      statusBarHeight: app.globalData.statusBarHeight,
      navigationHeight: app.globalData.navigationHeight,
      imgHOST,
      list: [],
      qrTxt: {
        title: ""
      },
      isShowQrModal: false,
      user: local.get("user"),
      config: {}
    };
  },
  methods: {
    previewImg(imgs) {
      uni.previewImage({
        current: "", // 当前显示图片的http链接
        urls: imgs // 需要预览的图片http链接列表
      });
    },
    showQr(item) {
      this.qrTxt = {
        title: item.title
      };
      this.isShowQrModal = true;
      let id = item.coupon.id;
      Qr({
        canvasId: "qr",
        text: "spa=" + id,
        width: 120,
        height: 120,
        callback: res => {
          // 安卓机上不准确，生成的二维码无法扫描，加延时解决
          setTimeout(() => {
            uni.canvasToTempFilePath({
              canvasId: "qr",
              success: res => {
                console.log(res);
              }
            });
          }, 500);
        }
      });
    },
    closeQr() {
      this.qrTxt = {
        title: ""
      };
      this.isShowQrModal = false;
    },
    getList() {
      let url = "/spa/mymechs",
        data = {};
      uni.showLoading();
      xhr.get(url, data, res => {
        uni.hideLoading();
        console.log(res);
        if (res.statusCode == 200) {
          this.list = res.data;
        }
      });
    },
    toClaim(mech_id) {
      if (!this.user || this.user.role != "telUser") {
        return uni.navigateTo({
          url: "/pages/my/auth/login"
        });
      }
      let url = "/spa/claim",
        data = {
          mech_id
        };
      uni.showLoading();
      xhr.post(url, data, res => {
        uni.hideLoading();
        if (res.statusCode == 200) {
          uni.showToast({
            title: "领取成功"
          });
          this.getList();
        }
      });
    },
    getConfig() {
      let url = "https://image.grecycle.com.cn/src/sli/config/wx-qr-config.json",
        data = {};

      xhr.get(url, data, res => {
        console.log(res);
        if (res.statusCode == 200) {
          this.config = res.data;
        }
      });
    }
  },
  mounted() {},
  onLoad(options) {
    this.getConfig();
    this.getList();
  },
  onShow() {
    this.user = local.get("user");
  },
  onShareAppMessage(res) {
    //res.from
    return {
      title: shareContent.title,
      imageUrl: shareContent.img,
      path: "/pages/index/index"
    };
  },
  onShareTimeline(res) {
    //res.from
    return {
      title: shareContent.title,
      imageUrl: shareContent.img,
      path: "/pages/index/index"
    };
  }
};
</script>

<style lang="scss" scoped>
.null {
  color: #666;
}
.qr-li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  margin: 10px 15px;
  padding: 30px;
  border-radius: 6px;
  background-color: #fff;
  font-size: 18px;
  font-weight: bold;
  word-wrap: break-all;
  image {
    width: 30px;
    height: 30px;
  }
  .used,
  .join {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: #fff;
    border-radius: 6px;
    background-color: rgba(30, 30, 30, 0.3);
  }
  .join {
    background-color: rgba(36, 119, 95, 0.3);
  }
}

.qr-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 99999999999;
  bottom: 0;
  width: 0;
  height: 0;
  box-sizing: border-box;
  overflow: hidden;

  transition-delay: 0.3s;
  &.on {
    width: 100%;
    height: 100%;
    overflow: auto;
    transition-delay: 0s;
    .bg {
      opacity: 1;
      transform: translate(0, 0);
    }
    .canvas {
      transform: translate(0, 0);

      canvas {
        position: relative;
        margin: auto;
        width: 120px;
        height: 120px;
      }
    }
  }
  .bg {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(30, 30, 30, 0.3);
    transform: translate(100%, 0);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .canvas {
    z-index: 9;
    width: 260px;
    padding: 30px 20px 40px;
    border-radius: 8px;
    background-color: #fff;
    transform: translate(750rpx, 0);
    transition: 0.2s;

    canvas {
      width: 0;
      height: 0;
    }
  }
}

.banner {
  position: relative;
  height: 166rpx;
  navigator {
    width: 100%;
  }
  image {
    width: 100%;
  }
}
</style>
