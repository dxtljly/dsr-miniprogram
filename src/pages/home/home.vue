<template>
  <view style="height:100%;overflow:auto;">
    <gl-navbar full text="我的" white textStyle="color:#fff;" bg="transparent"></gl-navbar>
    <view class="container">
      <view class="bg" :style="'background-image:url('+imgHOST+'/home/bg.png);'"></view>
      <view class="userInfo z-depth-3">
        <navigator hover-class="none" url="/pages/my/auth/login" class="avatar">
          <image mode="widthFix" :src="user.avatarUrl ? user.avatarUrl : imgHOST+'/logo.jpg'" />
        </navigator>
        <view class="nickname">{{user.nickName}}</view>
        <view class="info">目前在售商品{{publishNumber>99?'99+':publishNumber}}件</view>
      </view>
    </view>
    <!-- <navigator
      hover-class="none"
      target="miniProgram"
      open-type="navigate"
      app-id="wxebadf544ddae62cb"
      path="pages/survey/index?sid=6850669&hash=771a"
    >
      <image
        mode="widthFix"
        :src="imgHOST+'/home/有奖小调查.jpg'"
        style="width:100%;height:0;margin-top:-20rpx;margin-bottom:20rpx;"
      />
    </navigator>-->
    <block v-if="tip">
      <!-- <navigator hover-class="none" :url="tip.url" style="z-index:99999;">
        <image
          mode="widthFix"
          :src="tip.img"
          style="width:100%;height:0;margin-top:-20rpx;margin-bottom:20rpx;"
        />
      </navigator> -->
    </block>
    <gl-li :list="navList1"></gl-li>
    <gl-li :list="navList2"></gl-li>
    <view class="spa z-depth-1">
      <view class="title">有奖活动</view>
      <view class="list">
        <view>
          <navigator hover-class="none" url="/pages/spa/qr/list">
            <image :src="imgHOST+'/icon/qr.png'" />
            <text>我的劵码</text>
          </navigator>
        </view>
        <view>
          <view @click="scanSpa">
            <image :src="imgHOST+'/icon/scan.png'" />
            <text>商家核销</text>
          </view>
        </view>
      </view>
    </view>
    <view class="tx-center">
      <image
        mode="widthFix"
        :src="imgHOST+'/home/让好物循环.png'"
        style="width:320rpx;height:0;margin:30rpx 0;"
      />
    </view>
    <view>
      <ad unit-id="adunit-ca4ae30b880d9a14"></ad>
    </view>
    <view style="height:400rpx;"></view>

    <tab-bar></tab-bar>
    <!-- <message-icon :messageNo="messageNo"></message-icon> -->
    <!-- 毕业季 -->
    <!-- <navigator hover-class="none" url="/pages/school/index" class="fixed-nav">
      <image mode="widthFix" :src="imgHOST+'/毕业季.png'" />
    </navigator>-->
  </view>
</template>
<script>
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
      navList1: [
        // {
        //   icon: imgHOST + "/home/love.png",
        //   title: "宠粉活动",
        //   url: "/pages/activity/olay"
        // },
        {
          icon: imgHOST + "/home/publish.png",
          title: "我的发布",
          url: "/pages/my/goods/publish/publish"
        },
        {
          icon: imgHOST + "/home/give.png",
          title: "我送出的",
          url: "/pages/my/goods/give/give",
          num: 0
        },
        {
          icon: imgHOST + "/home/get.png",
          title: "我领到的",
          url: "/pages/my/goods/get/get",
          num: 0
        },
        {
          icon: imgHOST + "/home/location.png",
          title: "收货地址",
          url: "/pages/my/address/list/list"
        },
        {
          icon: imgHOST + "/icon/myFav.png",
          title: "我的收藏",
          url: "/pages/my/goods/fav/fav"
        }
      ],
      navList2: [
        {
          icon: imgHOST + "/icon/icon-ad.png",
          title: "广告合作",
          url:
            "/pages/webviews/webviews?url=https://image.grecycle.com.cn/src/sli/images/断舍哩广告合作 - detail.jpg"
        },
        {
          icon: imgHOST + "/icon/icon-face.png",
          title: "专属表情",
          url:
            "/pages/webviews/webviews?url=https://w.url.cn/s/ATHVQ5t#wechat_redirect"
        },
        {
          icon: imgHOST + "/home/FAQ.png",
          title: "常见问题",
          url: "/pages/FAQ/FAQ"
        },
        {
          icon: imgHOST + "/home/feedback.png",
          title: "在线客服",
          url: "/pages/feedback/feedback"
        },
        {
          icon: imgHOST + "/home/setting.png",
          title: "权限设置",
          isBtn: true,
          openType: "openSetting"
        }
      ],
      user: local.get("user"),
      publishNumber: 0,
      messageNo: 0,
      tip: null
    };
  },
  methods: {
    getConfig() {
      let url =
          "https://image.grecycle.com.cn/src/sli/config/sli-home-config.json",
        data = {};

      xhr.get(url, data, res => {
        if (res.statusCode == 200) {
          this.tip = res.data.tip;
        }
      });
    },
    getPublishNumber() {
      let url = "/items/",
        data = {
          own: 2,
          status: "1"
        };
      xhr.get(url, data, res => {
        if (res.statusCode == 200) {
          this.publishNumber = res.data.count;
        }
      });
    },
    getMessageNum() {
      let url = "/messages/urcout",
        data = {};
      xhr.get(url, data, res => {
        console.log(res);
        if (res.statusCode == 200) {
          this.messageNo = res.data ? res.data : 0;
        }
      });
    },
    getMyTasks() {
      let url = "/item/mytasks",
        data = {};
      xhr.get(url, data, res => {
        console.log(res);
        if (res.statusCode === 200) {
          if (res.data.unreceived + res.data.unpaid) {
            this.navList1[3].num = res.data.unreceived + res.data.unpaid;
          }
          if (res.data.undelivered) {
            this.navList1[2].num = res.data.undelivered;
          }
        }
      });
    },
    scanSpa() {
      uni.scanCode({
        onlyFromCamera: true,
        success(res) {
          let coupon_id = res.result.replace(/^spa=/, "");
          let url = "/spa/check",
            data = {
              coupon_id
            };
          xhr.put(url, data, res => {
            console.log(res);
            if (String(res.statusCode)[0] == 2) {
              uni.showModal({
                title: "提示",
                content: "核销成功",
                showCancel: false,
                confirmText: "好哩~",
                success(res) {}
              });
            } else {
              uni.showToast({
                title: res.data.message,
                icon: "none"
              });
            }
          });
        }
      });
    }
  },
  mounted() {
    uni.hideTabBar();
  },
  onLoad(options) {
    this.getConfig();
  },
  onShow() {
    this.user = local.get("user");
    this.getPublishNumber();
    this.getMessageNum();
    this.getMyTasks();
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
  position: relative;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  .bg {
    position: absolute;
    width: 100%;
    height: 370rpx;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .userInfo {
    position: relative;
    margin: 220rpx $page-offset 40rpx;
    padding: 80rpx $content-offset 34rpx;
    border-radius: 16rpx;
    background-color: #fff;
    text-align: center;

    .avatar {
      position: absolute;
      top: -60rpx;
      left: 0;
      right: 0;
      margin: 0 auto 20rpx;
      width: 128rpx;
      height: 128rpx;
      padding: 6rpx;
      box-sizing: border-box;
      border-radius: 50%;
      background-color: #fff;
      image {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .nickname {
      font-size: 30rpx;
      margin-bottom: 4rpx;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .info {
      font-size: 26rpx;
      color: #666;
    }
  }
}
.fixed-nav {
  position: fixed;
  bottom: 8%;
  right: 0;
  width: 150rpx;
  height: 150rpx;
  image {
    width: 100%;
    height: 0;
  }
}
.spa {
  position: relative;
  margin: 0 auto 20px;
  // width: calc(100% - 40px);
  padding: 10px 20px;
  box-sizing: border-box;
  background: #fff;
  // border-radius: 10px;
  .title {
    padding: 10px 0;
    font-size: 14px;
    font-weight: bold;
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    color: #666;
    font-size: 12px;
    & > view {
      width: calc(100% / 4);
      text-align: center;
      margin-bottom: 10px;
      line-height: 1.5;
      image {
        display: block;
        position: relative;
        margin: 5px auto;
        width: 24px;
        height: 24px;
      }
    }
  }
}
</style>