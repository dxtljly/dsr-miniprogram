<template>
  <view class="height: 100%;">
    <gl-navbar back home :text="text"></gl-navbar>
    <view class="content">
      <block v-for="(item, index) in detail.items" :key="index">
        <view class="goods flx">
          <view class="img">
            <image mode="aspectFill" :src="item.pic[0]" />
          </view>
          <view class="fx1 flx fx-column fx-justify">
            <view class="title">{{ item.title }}</view>
            <view class="number">数量:1</view>
          </view>
        </view>
      </block>
      <view class="detail-info">
        <view class="li">
          <view>商品总价</view>
          <view><span style="margin-right: 6rpx;">¥</span>0.00</view>
        </view>
        <view class="li">
          <view>运费（快递）</view>
          <view
            ><span style="margin-right: 6rpx;">¥</span
            >{{ (detail.actual_pay / 100).toFixed(2) }}</view
          >
        </view>
        <view class="li on">
          <view>订单总价</view>
          <view
            ><span style="margin-right: 6rpx;">¥</span
            >{{ (detail.actual_pay / 100).toFixed(2) }}</view
          >
        </view>
        <view class="li">
          <view>已支付</view>
          <view
            ><span style="margin-right: 6rpx;">¥</span
            >{{ (detail.pre_pay / 100).toFixed(2) }}</view
          >
        </view>
        <view class="li on">
          <view>需支付</view>
          <view style="color: #ff5e41;"
            ><span style="margin-right: 6rpx;">¥</span
            >{{ ((detail.actual_pay - detail.pre_pay) / 100).toFixed(2) }}</view
          >
        </view>
        <view class="li" style="font-size: 26rpx;">
          <view>订单编号</view>
          <view>{{ id }}</view>
        </view>
        <view class="li" style="font-size: 26rpx;">
          <view>交易时间</view>
          <view>{{
            $common.util.formatDate(new Date(detail.items[0].order_time), true)
          }}</view>
        </view>
      </view>

      <view class="showPay">
        共{{ detail.items.length }}件，
        <view style="font-size: 28rpx;color: black;margin-right: 10rpx;">
          合计：
          <span style="color: #ff5e41;font-size: 34rpx;">¥ {{((detail.actual_pay - detail.pre_pay) / 100).toFixed(2) }}</span>
        </view>
        <view class="payBtn flx fx-center fx-middle" @click.stop="payOrder">
          补交运费
        </view>
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
  getUrlParam,
  shareContent,
} from '@/common/util';
export default {
  data() {
    return {
      imgHOST,
      statusBarHeight: app.globalData.statusBarHeight,
      navigationHeight: app.globalData.navigationHeight,
      text: '补交运费',
      detail: null,
      id: null,
      user: local.get('user'),
    };
  },
  methods: {
    getDetail() {
      let url = '/order/order_detail/' + this.id,
        data = {};
      uni.showLoading({
        mask: true,
      });
      xhr.get(url, data, (res) => {
        uni.hideLoading();
        if (res.statusCode == 200) {
          this.detail = res.data;
          console.log(this.detail, 'this.detail');
        } else {
          uni.showToast({
            title: '网络错误',
            icon: 'none',
          });
        }
      });
    },
    payOrder() {
      if (local.get("user").role != "telUser") {
        return uni.showToast({
          title: "无权限领取好物，请先授权手机登录",
          icon: "none",
          success: res => {
            setTimeout(() => {
              uni.navigateTo({
                url: "/pages/my/auth/login"
              });
            }, 1500);
          }
        });
      }
      let url = "/order/post_pay/" + this.id,
        data = {};
      xhr.get(url, data, res => {
        uni.hideLoading();
        if (String(res.statusCode)[0] == 2) {
          let orderInfo = res.data;
          uni.requestPayment({
            provider: "weixin",
            orderInfo: "",
            timeStamp: String(orderInfo.time_stamp),//时间戳
            nonceStr: orderInfo.nonce_str,//随机字符串
            package: "prepay_id=" + orderInfo.prepay_id,
            signType: "MD5",//默认值
            paySign: orderInfo.sign,//签名
            success(res) {
              uni.redirectTo({
                url: "/pages/my/goods/get/get"
              });
            },
            fail(err) {
              uni.showToast({
                title: res.data.message ? res.data.message : "支付失败",
                icon: "none"
              });
            }
          });
        } else if (String(res.statusCode)[0] == 4) {
          uni.showToast({
            title: res.data.message ? res.data.message : "未知错误",
            icon: "none"
          });
        }
      });
    }
  },
  onLoad(options) {
    this.id = options.id;
    console.log('this.id>>>>>', this.id);
    this.getDetail();
  },
  onShow() {
    this.user = local.get('user');
  },
};
</script>
<style lang="scss" scoped>
.content {
  padding: 20rpx 20rpx 0;
  background-color: #fff;
  position: relative;
  .goods {
    padding: 20rpx 0;
    .img {
      margin-right: 20rpx;
      width: 134rpx;
      height: 134rpx;
      border-radius: 8rpx;
      overflow: hidden;
      image {
        width: 100%;
        height: 100%;
      }
    }
    .title {
      width: 440rpx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 32rpx;
    }
    .number {
      font-size: 28rpx;
    }
  }
  .detail-info {
    padding: 20rpx 0;
    color: #666;
    .li {
      min-height: 46rpx;
      display: flex;
      justify-content: space-between;
      font-size: 30rpx;
      margin: 10rpx 0;
      padding-right: 10rpx;
      &.on {
        color: black;
        font-size: 34rpx;
      }
    }
  }

  .showPay {
    width: 100%;
    height: 100rpx;
    box-sizing: border-box;
    position: fixed;
    z-index: 100;
    background: #fff;
    bottom: 0;
    left: 0;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-end;
    align-items: center;
    color: #666;
    font-size: 26rpx;
    
    .payBtn {
      height: 90%;
      padding: 0 26rpx;
      margin-right: 20rpx;
      background-color: #24775f;
      color: #fff;
      font-size: 32rpx;
      letter-spacing: 2rpx;
      border-radius: 50rpx;
    }
  }
}
</style>
