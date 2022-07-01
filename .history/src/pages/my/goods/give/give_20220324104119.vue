<template>
  <view
    :style="'position:relative;height:calc(100% - ' + (statusBarHeight + navigationHeight) +'px);'"
  >
    <gl-navbar back home text="我送出的"></gl-navbar>
    <scroll-view scroll-y enable-back-to-top @scrolltolower="getList" style="height:100%;">
      <view>
        <ad unit-id="adunit-6e64f42ba938fb72"></ad>
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
      <!--  -->
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
                  <view class="flx">
                  <block v-if="order.status == 54">
                    <view class="fcmain" style="font-size:10px;">买家取消订单,商品已重新上架</view>
                  </block>
                  <block v-if="order.status == 51 && itemIdList == false">
                    <view
                      class="btn-again"
                      @click.stop="rePutaway"
                      :data-item="goods"
                      style="margin-right:10rpx;"
                    >重新上架</view>
                  </block>
                  <block v-if="order.status == 52 && itemIdList == false">
                    <view
                      class="btn-again"
                      @click.stop="rePutaway"
                      :data-item="goods"
                      style="margin-right:10rpx;"
                    >重新上架</view>
                  </block>
                  <block v-if="order.status == 53 && itemIdList == false">
                    <view
                      class="btn-again"
                      @click.stop="rePutaway"
                      :data-item="goods"
                      style="margin-right:10rpx;"
                    >重新上架</view>
                  </block>
                </view>
              </view>
            </view>
          </view>
        </block>
        <block v-if="backOn">
          <view class="score-tip">
            <view class="bg"></view>
            <view class="content">
              <view class="head"></view>
              <scroll-view scroll-y class="txt">
                <view class="content flx">
                  <block v-for="(item,indexns) in order.items" :key="indexns">
                    <block v-if="indexns == 0">
                      <view class="img shrink0">
                        <image mode="aspectFill" :src="item.pic[0]" />
                      </view>
                      <view class="txt fx1 flx fx-column fx-justify">
                        <view class="title">{{item.title}}</view>
                        <view class="flx fx-justify fx-bot">
                          <view class="number">数量:1</view>
                          <view class="flx">
                            <view
                              class="btn-again"
                              @click.stop="rePutaway"
                              :data-item="item"
                              style="margin-right:10rpx;"
                            >重新上架</view>
                          </view>
                        </view>
                      </view>
                    </block>
                  </block>
                </view>
              </scroll-view>
              <view class="foot">
                <view class="accept-btn"></view>
              </view>
            </view>
            <view class="cancel">
              <image @click="cancel" mode="widthFix" :src="imgHOST+'/x.png'" />
            </view>
          </view>
        </block>
        <view class="content flx">
          <view class="txt fx1 flx fx-column fx-justify">
            <view class="flx fx-justify fx-bot">
              <view class="flx">
                  <block v-if="order.status == 2">
                    <view
                      class="btn-reject"
                      style="transform:translateX(338%);"
                      @click.stop="close"
                      :data-oid="order.id"
                      :data-index="index"
                    >取消订单</view>
                  </block>
                  <block v-if="order.status == 2">
                    <view class="btn-fill"
                          style="transform:translateX(415%);"
                          @click.stop="ship"
                          :data-oid="order.id"
                    >去发货</view>
                  </block>
                  <block v-else-if="order.status == 3">
                    <navigator
                      hover-class="none"
                      style="transform:translateX(4%);"
                      :url="'/pages/order/express?id='+order.items[0].id+'&oid='+order.id"
                      class="btn-accept"
                    >查看物流</navigator>
                  </block>
                  <block v-else-if="order.status == 4">
                    <view style="transform:translateX(333%);">
                      <view class="btn-reject" @click.stop="del" :data-id="order.id">删除订单</view>
                    </view>
                    <navigator
                      hover-class="none"
                      view style="transform:translateX(345%);"
                      :url="'/pages/order/express?id='+order.items[0].id+'&oid='+order.id"
                      class="btn-accept"
                    >查看物流</navigator>
                  </block>
                </view>
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
  </view>
</template>
<script>
const app = getApp();
import { xhr, allowTypes, local, shareContent } from "@/common/util";
export default {
  data() {
    return {
      imgHOST: this.$common.util.imgHOST,
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
      itemIdList:[],
      rows: 10,
      skip: 0,
      list: [],
      listTotal: -1,
      isLoadEnd: true,
      orderList: [],
      user: local.get("user"),
      goodsAddData: local.get("goodsAddData"),
      backOn: false
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
          own: 2,
          status: "2-1,2-2，2-3,3,4,5,3-5"
        };

      xhr.get(url, data, res => {
        this.isLoadEnd = true;
        if (res.statusCode == 200) {
          this.list = [...this.list].concat(res.data.items);
          this.listTotal = res.data.count;
        }
      });
    },
    myorderout(n){
      let url = "/order/myorderout",
        data = {
        };
      xhr.get(url, data, res => {
        if (res.statusCode == 200) {
          this.orderList = res.data;
          console.log(this.orderList,"this.orderList");
          let itemList = [];
          this.orderList.forEach(s => {
              itemList.push(s);
          });
          this.itemList = itemList;
          console.log(this.itemList,"this.itemList");
          console.log(this.orderList,"this.itemList");
        }
      });
    },
    ship(e) {
      let oid = e.currentTarget.dataset.oid;
      uni.showModal({
        title: "提示",
        content: "只能预约当天下午16:30以前的快递小哥哦~",
        cancelText: "明天再来",
        confirmText: "马上预约",
        success: res => {
          if (res.confirm) {
            let url = "/pages/order/shipping?id=" + oid;
            console.log("用户点击确定");
            uni.navigateTo({ url });
            this.initList(),
            this.myorderout();
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    del(e) {
      let id = e.currentTarget.dataset.id;
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
              }
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    rePutaway(e) {
      let item = e.currentTarget.dataset.item;
      console.log(item);
      let goodsAddData = {};
      goodsAddData.uploadImgs = [];
      item.pic.map((v, i) => {
        goodsAddData.uploadImgs.push({
          flag: true,
          temp: "",
          upload: v,
          isshow: false
        });
      });
      goodsAddData.title = item.title;
      goodsAddData.detail = item.detail;
      goodsAddData.brand_new = item.brand_new;
      goodsAddData.only_pickup = item.only_pickup;
      goodsAddData.original_price = Math.round(item.original_price / 100);
      goodsAddData.weight = item.weight;
      goodsAddData.category = item.category;
      goodsAddData.place = [...item.place];
      goodsAddData.if_readd = true;
      local.set("goodsAddData", goodsAddData);
      console.log(goodsAddData.isshow,"goodsAddData.isshow");
      uni.navigateTo({
        url: "/pages/goods/add/add?if_readd=1"
      });
      this.goodsAddData.uploadImgs.forEach(v => {
        if(this.itemIdList.indexOf(v.isshow) < 0){
          this.itemIdList.push(v.isshow);
        }
      });
      console.log(this.itemIdList,"this.itemIdListthis.itemIdListthis.itemIdList");
    },
    close(e) {
      let oid = e.currentTarget.dataset.oid,
        index = e.currentTarget.dataset.index;

      uni.showModal({
        title: "提示",
        content: "确认关闭订单吗？",
        success: res => {
          if (res.confirm) {
            console.log("用户点击确定");
            let url = "/order/close/" + oid,
              data = {
                role: "seller"
              };
            xhr.put(url, data, res => {
              if (String(res.statusCode)[0] == 2) {
                //关闭订单成功
                this.list.splice(index, 1);
                this.listTotal--;
                uni.showToast({
                  title: '关闭成功',
                  duration: 2000
                });
                this.backOn = true;
              }
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    cancel() {
      this.backOn = false;
    }
  },
  onLoad(options) {
    this.myorderout();
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
        color: $main-color;
        border: 1px solid $main-color;
      }
      .btn-reject {
        @extend .btn;
        color: rgb(180, 177, 177);
        border: 1px solid rgb(180, 177, 177);
      }
      .btn-again {
        @extend .btn;
        color: rgb(0, 114, 15);
        border: 1px solid rgb(0, 114, 15);
      }
      .btn-fill {
        @extend .btn;
        color: #fff;
        border: 1px solid $main-color;
        background-color: $main-color;
      }
    }
  }
  .score-tip {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 9999;
    width: 100%;
    height: 100%;
    top: 0;
    .bg {
      position: absolute;
      width: 100%;
      height: 100%;
      transform: translateX(-2.5%);
      top: 0;
      background: rgba(156, 156, 156, 0.3);
    }
    .content {
      position: relative;
      width: 70%;
      transform: translateX(2.5%);
      overflow: hidden;
      .head {
        padding: 20rpx 0;
        text-align: center;
        color: #fff;
        font-weight: 400;
        border-top-left-radius: 25rpx;
        border-top-right-radius: 25rpx;
        background: #fff;
      }
      .txt {
        padding: 0 20rpx;
        height: 520rpx;
        width: 600rpx;
        line-height: 1.6;
        box-sizing: border-box;
        background-color: #fff;
        font-size: 12px;
        text-align: justify;
        .content {
          position: relative;
          padding: 20rpx 0;
          height: 130rpx;
          .img {
            margin-right: 20rpx;
            width: 120rpx;
            height: 120rpx;
            border-radius: 8rpx;
            overflow: hidden;
            image {
              width: 100%;
              height: 100%;
            }
          }
          .txt {
            .title {
              width: 200rpx;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-size: 28rpx;
              transform: translateY(-20%);
            }
            .number {
              font-size: 28rpx;
              white-space: nowrap;
              transform: translateY(-900%);
            }
            .btn {
              padding: 8rpx 22rpx;
              font-size: 10px;
              border-radius: 22rpx;
              z-index: 10000;
              white-space: nowrap;
              transform: translateY(-900%) translateY(70%);
            }
            .btn-again {
              @extend .btn;
              color: rgb(0, 114, 15);
              border: 1px solid rgb(0, 114, 15);
            }
          }
        }
      }
      .foot {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40rpx;
        border-bottom-left-radius: 25rpx;
        border-bottom-right-radius: 25rpx;
        background-color: #fff;
      }
    }
    .cancel{
      transform:translateX(-88%) translateY(-470%);
      width: 75rpx;
      height: 75rpx;
      image{
        width: 100%;
        height: 100%;
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