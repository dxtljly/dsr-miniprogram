<template>
  <view
    :style="'position:relative;height:calc(100% - ' + (statusBarHeight + navigationHeight) +'px);'"
  >
    <gl-navbar back home text="我领到的"></gl-navbar>
    <scroll-view scroll-y enable-back-to-top @scrolltolower="getList" style="height:100%;">
      <view>
        <ad
          unit-id="adunit-7cf33056c6f1591f"
          ad-type="grid"
          grid-opacity="0.8"
          grid-count="5"
          ad-theme="white"
        ></ad>
      </view>
      <view style="height:20rpx;"></view>
      <view v-if="orderList.length == 0" class="null">
        <view>
          <image mode="widthFix" :src="imgHOST+'/icon/null.png'" />
          <view>未匹配到数据 ~</view>
        </view>
      </view>
      <view v-if="orderList.length == -1" class="null">
        <view>
          <image mode="widthFix" :src="imgHOST+'/icon/loadding.gif'" />
          <view>加载中 ···</view>
        </view>
      </view>
      <block v-for="(order,index) in orderList" :key="index">
        <view class="list" @click="toDetail(order)">
          <view class="flx fx-justify">
            <view class="avatar">
              <image
                mode="aspectFill"
                :src="user.avatarUrl ? user.avatarUrl : imgHOST+'/logo.jpg'"
              />
              <text>{{user.nickName}}</text>
            </view>
            <view class="status">
              <block v-for="status in statusList" :key="status">
                <text v-if="order.status == status.status">{{status.name}}</text>
              </block>
            </view>
          </view>
          <block v-for="(goods,indexs) in order.items" :key="indexs">
            <view class="content flx">
              <view class="img shrink0">
                <image mode="aspectFill" :src="goods.pic[0]" /> 
              </view>
              <view class="txt fx1 flx fx-column fx-justify">
                <view class="title">{{goods.title}}</view>
                <view class="flx fx-justify fx-bot">
                  <view class="number">数量:1</view>
                </view>
              </view>
            </view>
          </block>
          <view class="contents flx">
            <view class="txts fx1 flx fx-column fx-justify">
              <view class="flx fx-justify fx-bot">
                <block v-if="order.status == 1">
                  <view class="flx">
                    <view
                      class="btn-reject"
                      style="margin-left:20rpx;transform:translateX(360%);"
                      @click.stop="close"
                      :data-oid="order.id"
                      :data-index="index"
                    >取消订单</view>
                    <view
                      class="btn-accept"
                      style="transform:translateX(430%);"
                      @click.stop="toPay"
                      :data-oid="order.id"
                      :data-index="index"
                    >去付款</view>
                  </view>
                </block>
                <block v-if="order.status == 2">
                  <view class="flx">
                    <view
                      class="btn-reject"
                      style="transform:translateX(345%);"
                      @click.stop="close"
                      :data-oid="order.id"
                      :data-index="index"
                    >取消订单</view>
                    <view
                      class="btn-accept"
                      style="margin-left:20rpx;transform:translateX(415%);"
                      @click.stop="pushdelivery"
                      :data-oid="order.id"
                      :data-index="index"
                    >催发货</view>
                  </view> 
                </block>
                <block v-if="order.status == 3">
                  <view class="flx">
                    <navigator
                      hover-class="none"
                      :url="'/pages/order/express?id='+order.items[0].id+'&oid='+order.id"
                      class="btn-logistics"
                      style="transform:translateX(350%);"
                    >查看物流</navigator>
                    <view
                      class="btn-accept"
                      style="transform:translateX(360%);"
                      @click.stop="receive"
                      :data-id="order.id"
                    >确认收货</view>
                  </view>
                </block>
                <!-- <block v-if="order.status == 4">
                  <navigator
                    hover-class="none"
                    :url="'/pages/order/express?id='+order.items[0].id+'&oid='+order.id"
                    class="btn-accept"
                    style="margin-left:20rpx;transform:translateX(345%);"
                  >查看物流</navigator>
                </block> -->
                <!-- <block v-if="order.status == 54">
                  <view class="btn-reject" @click.stop="del" :data-id="order.id">删除订单</view>
                </block>
                <block v-if="order.status == 53">
                  <view class="btn-reject" @click.stop="del" :data-id="order.id">删除订单</view>
                </block> -->
              </view>
            </view>
          </view>      
        </view>
      </block>
      <!--  -->
      <view v-if="orderList.length">
        <view class="loadding">
          <text>没有更多数据哩 ~</text>
        </view>
      </view>
      <view style="height:60rpx;"></view>
    </scroll-view>
    <notification></notification>

    <!--  v-if="isShowOlay" -->
    <block v-if="isShowOlay">
      <view
        class="flx fx-middle fx-center"
        style="position:fixed;z-index:999;top:0;width:100%;height:100%;background:rgba(30,30,30,.4);"
      > 
        <view hover-class="none">
          <image mode="widthFix" :src="imgHOST+'/x.png'" @click="closeOlay" style="width:100rpx;height:100rpx;transform: translateX(575%) translateY(400%);z-index:2000;" />
          <image mode="widthFix" :src="imgHOST+'/guli-red.png'" style="width:800rpx;height:240rpx;" />
          <image mode="widthFix" :src="imgHOST+'/guli-red-btn.png'" @click="copyWX"
                style="width:360rpx;height:520rpx;transform: translateX(61%) translateY(-625%);" />
        </view>
      </view>
    </block>
  </view>
</template>
<script>
const app = getApp();
import { imgHOST, xhr, allowTypes, local, shareContent, request } from "@/common/util";
export default {
  data() {
    return {
      imgHOST,
      statusBarHeight: app.globalData.statusBarHeight,
      navigationHeight: app.globalData.navigationHeight,
      statusList: [
        // { name: "已卖出，取消订单", status:"2-1" },
        // { name: "卖家取消", status:"2-2" },
        // { name: "买家取消", status:"2-3" },
        // { name: "待付款", status:3 },
        // { name: "待发货", status:"3-5" },
        // { name: "已发货", status:4 },
        // { name: "交易完成", status:5 }
        { name: "下单未付款", status:1 },
        { name: "已付款", status:2 },
        { name: "已发货", status:3 },
        { name: "已签收", status:4 },
        { name: "付款超时,订单关闭", status:51 },
        { name: "超时未发货,订单关闭", status:52 },
        { name: "卖家关闭订单", status:53 },
        { name: "买家关闭订单", status:54 },
        { name: "自提订单", status:6 }
      ],
      rows: 10,
      skip: 0,
      list: [],
      listTotal: -1,
      isLoadEnd: true,
      isShowOlay: false,
      orderList: [],
      user: local.get("user")
    };
  },
  methods: {
    toDetail(order) {
      if (["53","54"].indexOf(order.status) >= 0) {
        return false;
      }
      let url =
        (order.items[0].only_pickup
          ? "/pages/goods/detail/detail?id="
          : "/pages/order/detail?id=") + order.id;
      uni.navigateTo({ url });
    },
    initList() {
      this.skip = 0;
      this.list = [];
      this.orderList = [];
      this.listTotal = -1;
    },
    copyWX() {
      uni.setClipboardData({
        data: "salmonisaboy",
        success: () => {
          uni.showToast({
            title: "已复制微信号"
          });
        }
      });
    },
    getList(e) {
      if (!this.isLoadEnd || this.list.length == this.listTotal) {
        return false;
      }
      if (e) {
        if (e.type == "scrolltolower") {
          this.skip += this.rows;
        }
      }
      this.isLoadEnd = false;
      let url = "/items/",
        data = {
          skip: this.skip,
          own: 1,
          status: "2-1,2-2,2-3,3,4,5,3-5"
        };

      xhr.get(url, data, res => {
        this.isLoadEnd = true;
        if (res.statusCode == 200) {
          this.list = [...this.list].concat(res.data.items);
          this.listTotal = res.data.count;
          console.log(this.list,"this.list");
          console.log(this.listTotal,"this.listTotal");
          console.log(this.list.status);
        }
      });
    },
    myorderin(v) {
      let url = "/order/myorderin",
        data = {
        };
      xhr.get(url, data, res => {
        if (res.statusCode == 200) {
          this.orderList = res.data;
          console.log(this.orderList,"this.orderList");
          let itemList = [];
          this.orderList.forEach(v => {
              itemList.push(v);
          });
          this.itemList = itemList;
          console.log(this.itemList,"this.itemList");
          console.log(this.orderList,"this.itemList");
        }
      });
    },
    receive(v) {
      let id = v.currentTarget.dataset.id;
      let buyerPh = v.currentTarget.dataset.buyer.telephone
      uni.showModal({
        title: "提示",
        content: "确定已收到货物了吗？",
        cancelText: "还没有",
        confirmText: "已收到",
        success: res => {
          if (res.confirm) {
            console.log("用户点击确定");
            let url = "/order/receive/" + id,
              data = {};
            uni.showLoading({
              mask: true
            });
            xhr.put(url, data, res => {
              uni.hideLoading();
              if (res.statusCode == 200) {
                this.initList();
                this.getList();
                this.myorderin();
                uni.redirectTo({
                  url: '/pages/my/goods/get/get'
                });
              }
            });
            // 卖家得积分
            // this.emitBuyerTask(buyerPh);
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    emitBuyerTask(userName){
      let url = "/mall-portal/member/task/add",
        data = {
          "changeCount": 20,
          "changeType": 0,
          "platformType": 2,
          "umsMemberTaskId": 0,
          "userName": userName
        }
    },
    del(v) {
      let id = v.currentTarget.dataset.id;
      uni.showModal({
        title: "提示",
        content: "确定要删除该订单吗？",
        success: res => {
          if (res.confirm) {
            console.log("用户点击确定");
            let url = "/item/receive/" + id,
              data = {};
            uni.showLoading({
              mask: true
            });
            xhr.delete(url, data, res => {
              uni.hideLoading();
              if (res.statusCode == 200) {
                this.initList();
                this.myorderin();
              }
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    toPay(v) {
      let oid = v.currentTarget.dataset.oid,
        index = v.currentTarget.dataset.index;

      let url = "/order/pay/" + oid,
        data = {};
      uni.showModal({
        title: "提示",
        content: "若卖家72小时内不发货，系统会自动原路退回邮费",
        confirmText: "马上领",
        success: res => {
          if (res.confirm) {
            console.log("用户点击确定");
            uni.showLoading();
            xhr.get(url, data, res => {
              uni.hideLoading();
              if (String(res.statusCode)[0] == 2) {
                let orderInfo = res.data;
                uni.requestPayment({
                  provider: "weixin",
                  orderInfo: "",
                  timeStamp: String(orderInfo.time_stamp),
                  nonceStr: orderInfo.nonce_str,
                  package: "prepay_id=" + orderInfo.prepay_id,
                  signType: "MD5",
                  paySign: orderInfo.sign,
                  success(res) {
                    console.log(res);
                    this.list[index].status = "3-5";
                    uni.requestSubscribeMessage({
                      tmplIds: ["T-oK_ZZwFttqX3P4XvdSv7w6ogIDdXkyItjapiabdRE"],
                      complete() {}
                    });
                  },
                  fail(err) {
                    console.log(err);
                  }
                });
              } else if (String(res.statusCode)[0] == 4) {
                uni.showToast({
                  title: res.data.message ? res.data.message : "未知错误",
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
    close(v) {
      let oid = v.currentTarget.dataset.oid,
        index = v.currentTarget.dataset.index;
      console.log(oid,"oid");
      console.log(index,"index");
      uni.showModal({
        title: "提示",
        content: "确认关闭订单吗？",
        success: res => {
          if (res.confirm) {
            console.log("用户点击确定");
            let url = "/order/close/" + oid,
              data = {
                role: "buyer"
              };

            xhr.put(url, data, res => {
              console.log(res);
              if (String(res.statusCode)[0] == 2) {
                //关闭订单成功
                this.list.splice(index, 1);
                this.listTotal--;
                uni.showToast({
                  title: '关闭成功',
                  duration: 2000
                });
                uni.redirectTo({
                  url: '/pages/my/goods/get/get'
                });
              }
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    pushdelivery(v) {
      let oid = v.currentTarget.dataset.oid;
      let url = "/order/pushdelivery/" + oid,
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
    },
    checkShowOlay() {
      let url = "/spa/mymechs",
        data = {};
      xhr.get(url, data, res => {
        console.log(res.data);
        if (res.statusCode == 200) {
          let olayId = "6013903543baae664095a129"; //coupon
          let isShowOlay = true;

          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].id == olayId && res.data[i].coupon) {
              isShowOlay = false;
              break;
            }
          }
          this.isShowOlay = isShowOlay;
        }
      });
    },
    closeOlay() {
      this.isShowOlay = false;
    }
  },
  onLoad(options) {
    if (options.isShowOlay) {
      this.checkShowOlay();
    }
    this.getList();
    this.myorderin();
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
    return {
      title: shareContent.title,
      imageUrl: shareContent.img,
      path: "/pages/index/index"
    };
  }
};
</script>
<style lang="scss" scoped>
.list {
  padding: 20rpx;
  margin-bottom: 20rpx;
  background-color: #fff;
  .avatar {
    font-size: 26rpx;
    image {
      width: 50rpx;
      height: 50rpx;
      vertical-align: middle;
      margin-right: 20rpx;
      border-radius: 50%;
    }
  }
  .status {
    font-size: 26rpx;
    color: $main-color;
  }
  .content {
    position: relative;
    padding: 20rpx 0;

    .img {
      margin-right: 20rpx;
      width: 140rpx;
      height: 140rpx;
      border-radius: 8rpx;
      overflow: hidden;
      image {
        width: 100%;
        height: 100%;
      }
    }

    .txt {
      .title {
        width: 476rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 34rpx;
      }
      .number {
        font-size: 28rpx;
      }

      .btn {
        padding: 8rpx 22rpx;
        font-size: 10px;
        border-radius: 22rpx;
        white-space: nowrap;
      }

      .btn-accept {
        @extend .btn;
        color: #fff;
        border: 1px solid $main-color;
        background-color: $main-color;
      }
      .btn-logistics{
        @extend .btn;
        color: $main-color;
        border: 1px solid $main-color;
      }
      .btn-reject {
        @extend .btn;
        color: rgb(180, 177, 177);
        border: 1px solid rgb(180, 177, 177);
      }
    }
  }
  .contents {
    position: relative;
    padding: 20rpx 0;

    .img {
      margin-right: 20rpx;
      width: 140rpx;
      height: 140rpx;
      border-radius: 8rpx;
      overflow: hidden;
      image {
        width: 100%;
        height: 100%;
      }
    }

    .txts {
      .title {
        width: 476rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 34rpx;
      }
      .number {
        font-size: 28rpx;
      }

      .btn {
        padding: 8rpx 22rpx;
        font-size: 10px;
        border-radius: 22rpx;
        white-space: nowrap;
      }

      .btn-accept {
        @extend .btn;
        color: #fff;
        border: 1px solid $main-color;
        background-color: $main-color;
      }
      .btn-logistics{
        @extend .btn;
        color: $main-color;
        border: 1px solid $main-color;
      }
      .btn-reject {
        @extend .btn;
        color: rgb(180, 177, 177);
        border: 1px solid rgb(180, 177, 177);
      }
    }
  }
}
.loadding {
  height: 100rpx;
  color: #d8d8d8;
  font-size: 24rpx;
  text-align: center;
  image {
    display: block;
    position: relative;
    margin: auto;
    width: 100rpx;
    height: 100rpx;
  }
}
.null {
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
</style>