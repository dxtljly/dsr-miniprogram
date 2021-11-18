<template>
  <view>
    <gl-navbar back home text="物流信息"></gl-navbar>
    <block>
      <view class="address">
        <view class="flx fx-middle">
          <image
            mode="widthFix"
            :src="imgHOST+'/icon/location.png'"
            style="width:46rpx;height:46rpx;margin-right:20rpx;"
          />
          <view v-if="address" class="fx1 txt">
            <view class="name">收件人：{{address.name}} {{address.telephone}}</view>
            <view class="info">{{address.place}} {{address.detail}}</view>
          </view>
        </view>
      </view>
    </block>

    <block v-if="shipping">
      <view class="shipping">
        <view class="mailNo" @click="copy(shipping.mailNo)">
          德邦快递单号：{{shipping.mailNo}}
          <view style="margin-left:20rpx;font-size:8px;">复制</view>
          <image mode="widthFix" :src="imgHOST+'/icon/copy.png'" />
        </view>
        <view class="status">{{shipping.status}}</view>
        <view v-if="shipping.trace_list" class="trace">
          <block v-for="(item,index) in shipping.trace_list" :key="index">
            <view class="li" :class="{'on':index==0}">
              <view
                class="time"
              >{{shipping.trace_list[shipping.trace_list.length - 1 - index].time}}</view>
              <view class="point" :class="{'noline':index == shipping.trace_list.length - 1}"></view>
              <view class="info" @click="checkPhone(shipping.trace_list.length -1 - index)">
                <view
                  class="fbold"
                >{{shipping.trace_list[shipping.trace_list.length-1 - index].status}}</view>
                <view>【{{shipping.trace_list[shipping.trace_list.length-1 - index].city}}】{{shipping.trace_list[shipping.trace_list.length-1 - index].site}}</view>
                <view>{{shipping.trace_list[shipping.trace_list.length-1 - index].description}}</view>
              </view>
            </view>
          </block>
        </view>
      </view>
    </block>
    <block v-else>
      <view class="shipping null">暂无物流信息</view>
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
  shareContent
} from "@/common/util";
export default {
  data() {
    return {
      id: null,
      oid: null,
      address: null,
      shipping: null,
      imgHOST,
      statusBarHeight: app.globalData.statusBarHeight,
      navigationHeight: app.globalData.navigationHeight
    };
  },
  methods: {
    getAddress() {
      let url = "/item/" + this.id,
        data = {};
      xhr.get(url, data, res => {
        console.log(res);
        if (res.statusCode == 200) {
          this.address = res.data.deliver_address;
        } else {
          uni.showToast({
            title: "网络错误",
            icon: "none"
          });
        }
      });
    },
    getExpress() {
      let url = "/order/express/" + this.oid,
        data = {};
      xhr.get(url, data, res => {
        console.log(res);
        if (res.statusCode == 200) {
          this.shipping = res.data;
        }
      });
    },
    copy(txt) {
      uni.setClipboardData({
        data: txt,
        success: () => {
          uni.showToast({
            title: "复制成功"
          });
        }
      });
    },
    checkPhone(index) {
      let txt = this.shipping.trace_list[index].description;
      let hasPhone = txt.match(/1\d{10}/);
      if (hasPhone) {
        uni.makePhoneCall({
          phoneNumber: hasPhone[0]
        });
      }
    }
  },
  onLoad(options) {
    this.id = options.id;
    this.oid = options.oid;
    this.getAddress();
    this.getExpress();
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
.address {
  margin-bottom: 20rpx;
  padding: 30rpx 20rpx;
  background-color: #fff;
  font-size: 24rpx;
  .name {
    margin-bottom: 10rpx;
    font-size: 28rpx;
    font-weight: bold;
  }
  .info {
    color: #666;
    font-size: 24rpx;
  }
}
.shipping {
  padding: 40rpx 20rpx;
  background-color: #fff;
  &.null {
    text-align: center;
    color: #bbb;
    background: none;
  }
  .mailNo {
    display: flex;
    align-items: center;
    font-size: 24rpx;
    color: #9b9b9b;
    image {
      width: 24rpx;
      height: 24rpx;
      margin-left: 10rpx;
    }
  }
  .status {
    padding: 16rpx;
    font-weight: 400;
    text-align: center;
    border-bottom: 1px solid #f3f3f3;
  }
  .trace {
    padding: 30rpx 0;
    .li {
      display: flex;
      position: relative;
      padding-bottom: 60rpx;
      font-size: 24rpx;
      color: #9b9b9b;
      .time {
        flex-shrink: 0;
        width: 160rpx;
        text-align: center;
      }
      .info {
        flex-grow: 1;
        line-height: 1.5;
      }
      .point {
        flex-shrink: 0;
        position: relative;
        width: 20rpx;
        margin: 10rpx 30rpx 0;
        &::before {
          content: "";
          display: block;
          width: 20rpx;
          height: 20rpx;
          border-radius: 100%;
          background-color: #d8d8d8;
        }
        &::after {
          content: "";
          display: block;
          position: absolute;
          height: calc(100% + 60rpx);
          width: 0;
          margin: auto;
          top: 20rpx;
          left: 0;
          right: 0;
          border: 1px solid #ddd;
        }
        &.noline {
          &::after {
            display: none;
          }
        }
      }
      &.on {
        color: $main-color;
        .point::before {
          background: $main-color;
          box-shadow: 0 0 4px 1px rgba(36, 119, 95, 0.4);
        }
      }
    }
  }
}
</style>