<template>
  <view style="height:100%;">
    <gl-navbar back home :titleImg="imgHOST+'/clock/排行榜.png'"></gl-navbar>
    <scroll-view
      scroll-y
      :style="'height:calc(100% - ' + ( statusBarHeight + navigationHeight ) + 'px);'"
    >
      <view class="container" style="min-height:100%;">
        <view class="card">
          <view class="border"></view>
          <block v-for="(item,index) in topList" :key="index">
            <view class="rank flx fx-middle fx-justify" :class="{'me':user.id==item.user.id}">
              <view class="flx fx-middle">
                <view class="medal flx fx-middle">
                  <image v-if="index==0" mode="widthFix" :src="imgHOST+'/clock/No.1.png'" />
                  <image v-if="index==1" mode="widthFix" :src="imgHOST+'/clock/No.2.png'" />
                  <image v-if="index==2" mode="widthFix" :src="imgHOST+'/clock/No.3.png'" />
                </view>
                <image mode="aspectFill" :src="item.user.avatarUrl" class="avatar" />
                <view class="nickName">{{item.user.nickName}}</view>
              </view>
              <view class="integral">{{item.total_point || 0}}积分</view>
            </view>
          </block>
        </view>
      </view>
    </scroll-view>
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
      user: local.get("user"),
      topList: []
    };
  },
  methods: {
    getTopList() {
      let url = "/assistprom/toplist",
        data = {};
      xhr.get(url, data, res => {
        if (res.statusCode == 200) {
          this.topList = res.data;
        }
      });
    }
  },
  mounted() {},
  onLoad(options) {
    this.getTopList();
  },
  onShow() {
    this.user = local.get("user");
  },
  onShareAppMessage(res) {
    //res.from
    return {
      title: shareContent.title,
      path: "/pages/clock/clock",
      imageUrl: this.imgHOST + "/share.png"
    };
  },
  onShareTimeline(res) {
    //res.from
    return {
      title: shareContent.title,
      imageUrl: this.imgHOST + "/clock/head.jpg",
      path: "/pages/clock/clock"
    };
  }
};
</script>
<style lang="scss" scoped>
.container {
  padding: 50rpx 30rpx;
  box-sizing: border-box;
  background: linear-gradient(#dd3e5e, #da3443);
  .card {
    position: relative;
    margin-bottom: 50rpx;
    padding: 40rpx;
    border-radius: 24rpx;
    background: linear-gradient(to right, #fffffe, #fceee1);
    .border {
      position: absolute;
      margin: auto;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: calc(100% - 80rpx);
      height: calc(100% - 80rpx);
      border-style: solid;
      border-width: 20rpx;
      border-image: url($imgHOST+"/clock/border.png") 30 30 round;
      //   background: url($imgHOST+"/clock/fireworks.png") top center no-repeat;
      //   background-size: 100%;
    }
  }
}
.rank {
  margin: 10rpx 30rpx;
  &.me {
    background: #fceee1;
  }
  .medal {
    flex-shrink: 0;
    width: 20rpx;
    image {
      width: 100%;
    }
  }
  .avatar {
    flex-shrink: 0;
    margin: 10rpx 12rpx 10rpx 18rpx;
    width: 50rpx;
    height: 50rpx;
    border-radius: 100%;
  }
  .nickName {
    flex-shrink: 0;
    width: 220rpx;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    color: #909399;
  }
  .integral {
    font-size: 12px;
    color: #da3443;
  }
}
</style>