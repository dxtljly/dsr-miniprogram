<template>
  <view class="bg">
    <gl-navbar back home text="领奖记录"></gl-navbar>
    <view class="wechat-container" @click="copyWechat">
      <view class="wechat">salmonisaboy</view>
      <view class="info">(点击复制)请添加断舍哩客服微信，备注“校园活动”领奖</view>
    </view>
    <block v-for="(item,i) in awards" :key="i">
      <view class="award-li">
        <image :src="item.name.img" />
        <view class="content">
          <view class="title">{{item.name.name}}</view>
          <view>
            <view v-if="item.is_approved" class="status">已完成</view>
            <view v-else class="status on">审核中</view>
            <view class="point">
              邀请
              <text>{{item.point}}</text>位好友
            </view>
            <view class="time">{{item.create_time}}</view>
          </view>
        </view>
      </view>
    </block>
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
    },
    getAwards() {
      let url = "/campus_admin/apply",
        data = {};
      uni.showLoading();
      xhr.get(url, data, res => {
        console.log(res);
        uni.hideLoading();
        if (res.statusCode == 200) {
          this.awards = res.data.map(v => {
            v.name = JSON.parse(v.name);
            return v;
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
  onShow() {
    this.getAwards();
  },
  onShareAppMessage(res) {
    //res.from
    let inviterId = local.get("user").id;
    return {
      title: shareContent.schoolTitle,
      imageUrl: shareContent.schoolImg,
      path: "/pages/school/index?inviterId=" + inviterId
    };
  },
  onShareTimeline(res) {
    let inviterId = local.get("user").id;
    return {
      title: shareContent.schoolTitle,
      imageUrl: shareContent.schoolImg,
      path: "/pages/school/index?inviterId=" + inviterId
    };
  }
};
</script>

<style lang="scss" scoped>
.wechat-container {
  margin: 20rpx 0;
  text-align: center;
  .wechat {
    color: #5669f7;
  }
  .info {
    font-size: 10px;
    color: #bbb;
  }
}
.award-li {
  display: flex;
  margin: 0 30rpx 30rpx;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;
  image {
    width: 240rpx;
    height: 160rpx;
  }
  .content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0 20rpx;

    .title {
      max-width: 300rpx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 500;
    }
    .point {
      font-size: 10px;
      color: #bbb;
      text {
        color: #ffbd57;
      }
    }
    .status {
      margin-bottom: 10rpx;
      font-size: 13px;
      color: #ffbd57;
      &.on {
        font-weight: 500;
        color: $school-main-color;
      }
    }
    .time {
      font-size: 10px;
      color: #bbb;
    }
  }
}
</style>
