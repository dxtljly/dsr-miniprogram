<template>
  <view
    :style="'position:relative;height:calc(100% - ' + (statusBarHeight + navigationHeight) +'px);'"
  >
    <gl-navbar back home text="消息中心"></gl-navbar>
    <scroll-view scroll-y enable-back-to-top @scrolltolower="getMessage" style="height:100%;">
      <view class="load" v-if="isLoading">
        <view>
          <image mode="widthFix" :src="imgHOST+'/icon/loadding.gif'" />
          <view>加载中···</view>
        </view>
      </view>
      <view class="load" v-else-if="noMessage">
        <view>
          <image mode="widthFix" :src="imgHOST+'/icon/null.png'" />
          <view>没有未读消息哩~</view>
        </view>
      </view>
      <block v-for="(item,index) in list" :key="index">
        <block v-if="item.if_read && item.type==3"></block>
        <block v-else>
          <navigator
            hover-class="none"
            :url="'/pages/goods/detail/detail?id='+item.item + (item.type!=4 ? '&makereadmsg=1' : '')"
            class="list flx"
            :class="{'off':item.if_read}"
            @click="readFlag(index)"
          >
            <view class="avatar">
              <image mode="aspectFill" :src="item.sender.avatarUrl" />
            </view>
            <view class="fx1">
              <view class="title">
                <view class="nickname">{{item.sender.nickName}}</view>
                <view class="tip on">
                  <text v-if="item.type == 1">给您留言了</text>
                  <text v-if="item.type == 2">给您回复了</text>
                  <text v-if="item.type == 3">下单了</text>
                </view>
              </view>
              <view class="txt">{{item.contents}}</view>
              <view class="flx fx-middle fx-justify">
                <view class="time">{{$common.util.formatDate(new Date(item.create_time),true)}}</view>
                <view v-if="item.type == 4" class="btn" @click.stop="copy(index)">复制手机号</view>
              </view>
            </view>
            <!-- <view class="img">
            <image mode="aspectFill" :src="imgHOST+'/logo.jpg'" />
            </view>-->
          </navigator>
        </block>
      </block>
      <!-- <view class="loadding">
        <image mode="widthFix" :src="imgHOST+'/icon/loadding-bubbles-grey.svg'" />
      </view>-->
      <view style="height:60rpx;"></view>
    </scroll-view>
  </view>
</template>
<script>
const app = getApp();
import { imgHOST, xhr, allowTypes, local, shareContent } from "@/common/util";
export default {
  data() {
    return {
      imgHOST,
      statusBarHeight: app.globalData.statusBarHeight,
      navigationHeight: app.globalData.navigationHeight,
      list: [],
      isLoading: true,
      page: 1,
      rows: 10,
      isLoadingEnd: true,
      isLastPage: false
    };
  },
  methods: {
    getMessage(e) {
      if (!this.isLoadingEnd || this.isLastPage) {
        return false;
      }
      if (e) {
        this.page++;
      }
      let url = "/messages/",
        data = {
          skip: this.rows * (this.page - 1)
        };

      this.isLoadingEnd = false;
      xhr.get(url, data, res => {
        this.isLoading = false;
        this.isLoadingEnd = true;
        if (String(res.statusCode)[0] == 2) {
          if (res.data.length < this.rows) {
            this.isLastPage = true;
          }
          this.list = this.list.concat(res.data);
        }
      });
    },
    readFlag(index) {
      this.makereadmsg(index);
    },
    makereadmsg(index) {
      if (this.list[index].if_read) return false;
      let url = "/item/makereadmsg/" + this.list[index].item,
        data = {};
      xhr.put(url, data, res => {
        if (String(res.statusCode)[0] == 2) {
          this.list[index].if_read = true;
        }
      });
    },
    copy(index) {
      let phone = this.list[index].contents.split("：").pop();
      uni.setClipboardData({
        data: phone,
        success: () => {
          uni.showToast({
            title: "复制成功"
          });
          this.makereadmsg(index);
        }
      });
    }
  },
  computed: {
    noMessage() {
      let noMessage = false;
      let message = [];
      this.list.forEach(v => {
        if (v.if_read && v.type == 3) {
        } else {
          message.push(v);
        }
      });
      if (!message.length) {
        noMessage = true;
      }
      return noMessage;
    }
  },
  onLoad(options) {
    this.getMessage();
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
.load {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 600rpx;
  color: #d8d8d8;
  font-size: 26rpx;
  text-align: center;
  image {
    display: block;
    width: 260rpx;
    height: 260rpx;
    margin-bottom: 20rpx;
  }
}
.list {
  padding: 40rpx 20rpx;
  background-color: #fff;
  border-bottom: 1px solid #f3f3f3;
  &.off {
    opacity: 0.7;
    .title {
      .tip {
        &.on {
          color: #666;
        }
      }
    }
  }
  .avatar {
    width: 80rpx;
    height: 80rpx;
    margin-right: 20rpx;
    image {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .title {
    display: flex;
    font-size: 30rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
    .nickname {
      max-width: 160rpx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 20rpx;
    }
    .tip {
      &.on {
        color: #ff5e41;
        font-weight: normal;
      }
    }
  }
  .txt {
    width: 560rpx;
    // white-space: nowrap;
    // overflow: hidden;
    // text-overflow: ellipsis;
    color: #666;
    font-size: 28rpx;
    margin-bottom: 40rpx;
  }
  .time {
    color: #bbb;
    font-size: 20rpx;
  }
  .img {
    width: 136rpx;
    height: 136rpx;
    border-radius: 8rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
}
.loadding {
  text-align: center;
  image {
    width: 100rpx;
    height: 100rpx;
  }
}

.btn {
  padding: 8rpx 16rpx;
  color: $main-color;
  border-radius: 28rpx;
  border: 1px solid $main-color;
  font-size: 12px;
}
</style>