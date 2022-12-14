<template>
  <view style="height:100%;">
    <gl-navbar back home text="订单信息"></gl-navbar>
    <block v-if="detail">
      <view class="status-content flx fx-middle fx-center">
        <block v-for="(item,index) in statusList" :key="index">
          <view class="status-list">
            <view
              class="point"
              :class="{'on':detail.status >=item.status || (detail.status == 2 && item.status == 1) || ([3,4].indexOf(detail.status) >= 0 && item.status == 2),'border':index < statusList.length-1}"
            >
              <block v-if="detail.status == 54">
                <image
                  v-if="detail.status >=item.status || (detail.status == 2 && item.status == 1) || ([3,4].indexOf(detail.status) >= 0 && item.status == 2)"
                  :src="imgHOST+'/icon/cancel.png'"
                />
              </block>
              <block v-else-if="detail.status == 53">
                <image
                  v-if="detail.status >=item.status || (detail.status == 2 && item.status == 1) || ([3,4].indexOf(detail.status) >= 0 && item.status == 2)"
                  :src="imgHOST+'/icon/cancel.png'"
                />
              </block>
              <block v-else>
                <image
                  v-if="detail.status >=item.status || (detail.status == 2 && item.status == 1) || ([3,4].indexOf(detail.status) >= 0 && item.status == 2)"
                  :src="imgHOST+'/icon/checked.png'"
                />
              </block>
            </view>
            <view class="txt">{{item.name}}</view>
          </view>
        </block>
      </view>
      <view class="content">
        <view class="address">
          <view
            v-if="detail.items[0].deliver_address.wx_account || detail.items[0].deliver_address.qq_account"
            class="contact"
          >
            <text v-if="detail.items[0].deliver_address.wx_account">微信号：{{detail.items[0].deliver_address.wx_account}}</text>
            <text v-if="detail.items[0].deliver_address.qq_account">QQ号：{{detail.items[0].deliver_address.qq_account}}</text>
          </view>
          <view class="flx fx-middle">
            <image mode="widthFix" :src="imgHOST+'/icon/location.png'" class="shrink0" />
            <view class="fx1 txt">
              <view
                class="name"
              >收件人：{{detail.items[0].deliver_address.name}} {{detail.items[0].deliver_address.telephone}}</view>
              <view class="info">{{detail.items[0].deliver_address.place}} {{detail.items[0].deliver_address.detail}}</view>
            </view>
            <view class="shrink0 fcmain" style="font-size:24rpx;padding:0 20rpx;" @click="copyAddress">
              <view>复</view>
              <view>制</view>
            </view>
            <!-- <image
            mode="widthFix"
            :src="imgHOST+'/icon/copy.png'"
            class="shrink0"
            @click="copyAddress"
            />-->
          </view>
        </view>
        <block v-for="(item,index) in detail.items" :key="index">
          <navigator
            hover-class="none"
            :url="'/pages/goods/detail/detail?id='+ item.id"
            class="goods flx"
          >
            <view class="img">
              <image mode="aspectFill" :src="item.pic[0]" />
            </view>
            <view class="fx1 flx fx-column">
              <view class="title">{{item.title}}</view>
              <view class="number">数量:1</view>
            </view>
          </navigator>
        </block>
        <view class="detail-info">
          <view class="li">
            <block v-if="isOwner">
              <view>领取者</view>
              <view style="max-width:500rpx;">{{detail.buyer.nickName}}</view>
            </block>
            <block v-else>
              <view>赠送者</view>
              <view style="max-width:500rpx;">{{detail.seller.nickName}}</view>
            </block>
          </view>
          <view class="li">
            <view>交易时间</view>
            <view>{{$common.util.formatDate(new Date(detail.items[0].order_time),true)}}</view>
          </view>
        </view>
      </view>
      <view style="height:120rpx;"></view>
      <block v-if="isOwner">
        <view v-if="detail.status == 2" class="bot-btns">
          <view style="font-size:12px;" class="btn reject" @click.stop="close">取消订单</view>
          <view style="font-size:12px;" class="btn submit" @click.stop="toExpress">
            预约快递
            <text>（快递费已由领取者支付）</text>
          </view>
        </view>
        <view v-if="detail.status == 3" class="bot-btns">
          <navigator
            hover-class="none"
            :url="'/pages/order/express?id='+detail.items[0].id+'&oid='+detail.id"
            class="btn accept"
            :data-id="item.id"
          >查看物流</navigator>
        </view>
      </block>
      <block v-else>
        <view v-if="detail.status == 2 || detail.status == 3" class="bot-btns">
          <block v-if="detail.status == 2">
            <view class="btn reject" style="margin-left:20rpx;" @click.stop="pushdelivery">催发货</view>
          </block>
          <block v-else>
            <navigator
              hover-class="none"
              :url="'/pages/order/express?id='+detail.items[0].id+'&oid='+detail.id"
              class="btn reject"
            >查看物流</navigator>
          </block>
          <view class="btn submit" @click="receive">确认收货</view>
        </view>
      </block>
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
  shareContent,
  request
} from "@/common/util";
export default {
  data() {
    return {
      imgHOST,
      statusBarHeight: app.globalData.statusBarHeight,
      navigationHeight: app.globalData.navigationHeight,
      statusList: [
        // { name: "待付款", status: 3 },
        // { name: "待发货", status: "3-5" },
        // { name: "已发货", status: 4 },
        // { name: "交易完成", status: 5 }
        { name: "待付款", status: 1 },
        { name: "待发货", status: 2 },
        { name: "已发货", status: 3 },
        { name: "交易完成", status: 4 }
      ],
      id: null,
      detail: null,
      isOwner: false,
      test: new Date(),
      user: local.get("user")
    };
  },
  methods: {
    copyAddress() {
      let data =
        `收件人： ${this.detail.items[0].deliver_address.name}   ${this.detail.items[0].deliver_address.telephone}\n` +
        `地址： ${this.detail.items[0].deliver_address.place +
          this.detail.items[0].deliver_address.detail}`;

      console.log(data);
      uni.setClipboardData({
        data: data,
        success: function() {
          uni.showToast({
            title: "复制成功"
          });
        }
      });
    },
    checkOwner() {
      if (local.get("user").id == this.detail.seller.id) {
        this.isOwner = true;
      } else {
        this.isOwner = false;
      }
    },
    // getName() {
    //   let url = "/item/" + this.id,
    //     data = {};
    //   uni.showLoading({
    //     mask: true
    //   });
    //   xhr.get(url, data, res => {
    //     uni.hideLoading();
    //     console.log(res);
    //     if (res.statusCode == 200) {
    //       this.detail = res.data;
    //       this.checkOwner();
    //     } else {
    //       uni.showToast({
    //         title: "网络错误",
    //         icon: "none"
    //       });
    //     }
    //   });
    // },
    getDetail() {
      let url = "/order/order_detail/" + this.id,
        data = {};
      uni.showLoading({
        mask: true
      });
      xhr.get(url, data, res => {
        uni.hideLoading();
        if (res.statusCode == 200) {
          this.detail = res.data;
          console.log(this.detail,'this.detail');
          this.checkOwner();
        } else {
          uni.showToast({
            title: "网络错误",
            icon: "none"
          });
        }
      });
    },
    receive() {
      uni.showModal({
        title: "提示",
        content: "确定已收到货物了吗？",
        cancelText: "还没有",
        confirmText: "已收到",
        success: res => {
          if (res.confirm) {
            console.log("用户点击确定");
            let url = "/item/receive/" + this.id,
              data = {};
            uni.showLoading({
              mask: true
            });
            xhr.put(url, data, res => {
              uni.hideLoading();
              if (String(res.statusCode)[0] == 2) {
                this.detail.status = 4;
                // this.emitOrederinTask()
                // // 首次
                // this.emitOnceSellerTask()
              }
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    /*
    emitOrederinTask(){
      let dailyTask = local.get("dailyTask"),
        taskId = "";
      dailyTask.map((val,index) => {
        if(val.name == "捐赠闲置物品"){
          taskId = val.id
        }
      })
      let sellerId = this.detail.seller.telephone,
        url = "/mall-portal/member/task/add",
        data = {
          "changeCount": 20,
          "changeType": 0,
          "platformType": 2,
          "umsMemberTaskId": taskId,
          "userName": sellerId
      }
      request.post( url,data, res => {
        console.log("emitOrederinTask res",res);
        if(res.code == 200 || res.code == 500){
          console.log("res code",res);
        }
      })
    },
    emitOnceSellerTask(){
      let newUserTask = local.get("newUserTask"),
        taskId = "";
      newUserTask.map((val,index) => {
        if(val.name == "首次捐赠商品"){
          taskId = val.id
        }
      })
      let sellerId = this.detail.seller.telephone,
        url = "/mall-portal/member/task/add",
        data = {
          "changeCount": 40,
          "changeType": 0,
          "platformType": 2,
          "umsMemberTaskId": 22,
          "userName": sellerId
      }
      request.post( url,data, res => {
        if(res.code == 200 || res.code == 500){
          console.log("已完成首次订单",res);
        }
      })
    },
    */
    close() {
      uni.showModal({
        title: "提示",
        content: "确认关闭订单吗？",
        success: res => {
          if (res.confirm) {
            console.log("用户点击确定");
            let url = "/order/close/" + this.id,
              data = {
                role: "seller"
              };
            uni.showLoading();
            xhr.put(url, data, res => {
              console.log(res);
              uni.hideLoading();
              if (String(res.statusCode)[0] == 2) {
                this.detail.status = 53;
                uni.showToast({
                  title: "取消成功"
                });
              } else {
                uni.showToast({
                  title: res.data.message || "未知错误",
                  icon: "none"
                });
              }
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    toExpress() {
      let url = "/pages/order/shipping?id=" + this.id;
      uni.showModal({
        title: "提示",
        content: "只能预约当天下午16:30以前的快递小哥哦~",
        confirmText: "马上预约",
        cancelText: "明天再来",
        success: res => {
          if (res.confirm) {
            console.log("用户点击确定");
            uni.navigateTo({ url });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    pushdelivery(e) {
      let url = "/order/pushdelivery/" + this.id,
        data = {};
      uni.showLoading();
      xhr.get(url, data, res => {
        uni.hideLoading();
        if (res.statusCode == 204) {
          uni.showToast({
            title: "催发货成功"
          });
        }
      });
    }
  },
  onLoad(options) {
    console.log(options,"options")
    if (!options.id) {
      return uni.redirectTo({
        url: "/pages/index/index"
      });
    }
    this.id = options.id;
    this.getDetail();
  },
  onShow() {
    this.user = local.get("user");
  },
  onShareAppMessage(res) {
    //res.from
    return {
      title: shareContent.title,
      imageUrl: shareContent.img,
      path: "/pages/order/detail?id=" + this.id
    };
  },
  onShareTimeline(res) {
    return {
      title: shareContent.title,
      imageUrl: shareContent.img,
      path: "/pages/order/detail?id=" + this.id
    };
  }
};
</script>
<style lang="scss" scoped>
.borbot {
  border-bottom: 1px solid #f3f3f3;
}
.status-content {
  display: flex;
  height: 200rpx;
  padding: 0 20rpx;
  box-sizing: border-box;
  background-color: #fff;
  font-size: 24rpx;
  text-align: center;
  .status-list {
    $w: 176rpx;
    $dis-color: #d8d8d8;
    width: $w;
    .point {
      position: relative;
      display: inline-block;
      width: 40rpx;
      height: 40rpx;
      image {
        width: 100%;
        height: 100%;
      }
      &::before {
        content: "";
        display: block;
        position: absolute;
        margin: auto;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: 20rpx;
        height: 20rpx;
        background-color: $dis-color;
        border-radius: 50%;
      }
      &.on::before {
        display: none;
      }
      &.border::after {
        content: "";
        display: block;
        position: absolute;
        margin: auto;
        top: 0;
        bottom: 0;
        left: 50%;
        width: $w;
        height: 0;
        border: 2rpx solid $dis-color;
      }
      &.on.border::after {
        width: $w - 20rpx;
        left: 100%;
      }
    }
  }
}
.content {
  margin-top: 20rpx;
  padding: 0 20rpx;
  background-color: #fff;
  .address {
    padding: 20rpx 0 40rpx;
    @extend .borbot;

    .contact {
      margin-bottom: 20rpx;
      color: #666;
      font-size: 24rpx;
      text {
        margin-right: 30rpx;
      }
    }
    .txt {
      margin: 0 20rpx;
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
    image {
      width: 36rpx;
      height: 36rpx;
    }
  }

  .goods {
    padding: 20rpx 0;
    @extend .borbot;
    .img {
      margin-right: 20rpx;
      width: 104rpx;
      height: 104rpx;
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
      font-size: 30rpx;
    }
    .number {
      font-size: 28rpx;
    }
  }
  .detail-info {
    padding: 20rpx 0;
    color: #666;
    font-size: 24rpx;
    .li {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10rpx;
    }
  }
}
.btn-submit {
  position: fixed;
  margin: auto;
  left: 0;
  right: 0;
  bottom: 36rpx;
  width: 668rpx;
  height: 88rpx;
  line-height: 88rpx;
  color: #fff;
  text-align: center;
  background-color: $main-color;
  border-radius: 44rpx;
}

.bot-btns {
  position: fixed;
  bottom: 0;
  padding: 0 20rpx;
  width: 100%;
  height: 112rpx;
  box-sizing: border-box;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .btn {
    margin-left: 30rpx;
    padding: 16rpx 38rpx;
    border-radius: 44rpx;
    &.reject {
      color: #666;
      border: 1px solid #bbb;
    }
    &.accept {
      color: $main-color;
      border: 1px solid $main-color;
    }
    &.submit {
      color: #fff;
      border: 1px solid $main-color;
      background: $main-color;
    }
  }
}
</style>


