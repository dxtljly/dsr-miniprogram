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
      <view v-if="listTotal == 0" class="null">
        <view>
          <image mode="widthFix" :src="imgHOST+'/icon/null.png'" />
          <view>未匹配到数据 ~</view>
        </view>
      </view>
      <view v-if="listTotal == -1" class="null">
        <view>
          <image mode="widthFix" :src="imgHOST+'/icon/loadding.gif'" />
          <view>加载中 ···</view>
        </view>
      </view>
      <!--  -->
      <block v-for="(item,index) in list" :key="index">
        <view class="list" @click="toDetail(item)">
          <view class="flx fx-justify">
            <view class="avatar">
              <image
                mode="aspectFill"
                :src="item.buyer.avatarUrl ? item.buyer.avatarUrl : imgHOST+'/logo.jpg'"
              />
              <text>{{item.buyer.nickName}}</text>
            </view>
            <view class="status">
              <block v-for="status in statusList" :key="status">
                <text v-if="item.status == status.status">{{status.name}}</text>
              </block>
            </view>
          </view>
          <view class="content flx">
            <view class="img shrink0">
              <image mode="aspectFill" :src="item.pic[0]" />
            </view>
            <view class="txt fx1 flx fx-column fx-justify">
              <view class="title">{{item.title}}</view>
              <view class="flx fx-justify fx-bot">
                <view class="number">数量:1</view>
                <view class="flx">
                  <block v-if="item.status == '2-3'">
                    <view class="fcmain" style="font-size:10px;">买家取消订单，商品已重新上架</view>
                  </block>
                  <block v-else>
                    <view
                      class="btn-again"
                      @click.stop="rePutaway"
                      :data-item="item"
                      style="margin-right:10rpx;"
                    >重新上架</view>
                  </block>

                  <block v-if="item.status == '3-5'">
                    <view
                      class="btn-reject"
                      @click.stop="close"
                      :data-oid="item.order_id"
                      :data-index="index"
                      style="margin-right:10rpx;"
                    >取消订单</view>
                  </block>
                  <block v-if="item.status == '3-5'">
                    <view class="btn-fill">去发货</view>
                  </block>
                  <block v-else-if="item.status == 4">
                    <navigator
                      hover-class="none"
                      :url="'/pages/order/express?id='+item.id+'&oid='+item.order_id"
                      class="btn-accept"
                      :data-id="item.id"
                    >查看物流</navigator>
                  </block>
                  <block v-else-if="item.status == 5">
                    <view style="transform:translateX(-3%);">
                      <view class="btn-reject" @click.stop="del" :data-id="item.id">删除订单</view>
                    </view>
                    <navigator
                          hover-class="none"
                          :url="'/pages/order/express?id='+item.id+'&oid='+item.order_id"
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
      <view v-if="list.length">
        <block v-if="list.length == listTotal">
          <view class="loadding">
            <text>没有更多数据哩 ~</text>
          </view>
        </block>
        <block v-else>
          <view class="loadding">
            <image mode="widthFix" :src="imgHOST+'/icon/loadding-bubbles-grey.svg'" />
          </view>
        </block>
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
        { name: "已卖出", status: "2-1" },
        { name: "不想卖了", status: "2-2" },
        { name: "买家取消", status: "2-3" },
        { name: "待付款", status: 3 },
        { name: "待发货", status: "3-5" },
        { name: "已发货", status: 4 },
        { name: "交易完成", status: 5 }
      ],
      rows: 10,
      skip: 0,
      list: [],
      listTotal: -1,
      isLoadEnd: true
    };
  },
  methods: {
    toDetail(item) {
      if (["2-1", "2-2"].indexOf(item.status) >= 0) {
        return false;
      }
      let url =
        (item.only_pickup
          ? "/pages/goods/detail/detail?id="
          : "/pages/order/detail?id=") + item.id;
      uni.navigateTo({ url });
    },
    initList() {
      this.skip = 0;
      this.list = [];
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
    ship(e) {
      let id = e.currentTarget.dataset.id;
      uni.showModal({
        title: "提示",
        content: "确定已发出货物了吗？",
        cancelText: "还没有",
        confirmText: "已发货",
        success: res => {
          if (res.confirm) {
            console.log("用户点击确定");
            let url = "/item/ship/" + id,
              data = {};
            uni.showLoading({
              mask: true
            });
            xhr.put(url, data, res => {
              uni.hideLoading();
              if (res.statusCode == 200) {
                this.initList();
                this.getList();
              }
            });
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
                this.getList();
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
          upload: v
        });
      });
      goodsAddData.rePutaway = true;
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
      uni.navigateTo({
        url: "/pages/goods/add/add?if_readd=1"
      });
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
              console.log(res);
              if (String(res.statusCode)[0] == 2) {
                //关闭订单成功
                this.initList();
                this.getList();
              }
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    }
  },
  onLoad(options) {
    this.getList();
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
        color: rgb(180, 177, 177);
        border: 1px solid rgb(180, 177, 177);
      }
      .btn-fill {
        @extend .btn;
        color: #fff;
        border: 1px solid $main-color;
        background-color: $main-color;
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