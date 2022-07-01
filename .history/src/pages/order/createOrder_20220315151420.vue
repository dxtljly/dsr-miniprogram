<template>
  <view>
    <gl-navbar back home text="确认订单"></gl-navbar>
    <block v-if="!address">
      <navigator
        hover-class="none"
        url="/pages/my/address/list/list"
        class="chooseAddress flx fx-middle"
      >
        <view>收货地址</view>
        <view class="fx1 input">添加收货地址</view>
        <image mode="widthFix" :src="imgHOST+'/icon/arrow.png'" class="shrink0" />
      </navigator>
    </block>
    <block v-else>
      <navigator hover-class="none" url="/pages/my/address/list/list" class="address">
        <view v-if="address.wx_account || address.qq_account" class="contact">
          <text v-if="address.wx_account">微信号：{{address.wx_account}}</text>
          <text v-if="address.qq_account">QQ号：{{address.qq_account}}</text>
        </view>
        <view class="flx fx-middle">
          <image mode="widthFix" :src="imgHOST+'/icon/location.png'" class="shrink0" />
          <view class="fx1 txt">
            <view class="name">收件人：{{address.name}} {{address.telephone}}</view>
            <view class="info">{{String(address ? address.place : '')}} {{address.detail}}</view>
          </view>
          <image mode="widthFix" :src="imgHOST+'/icon/arrow.png'" class="shrink0" />
        </view>
      </navigator>
    </block>
    <!-- <view class="content flx">
      <view class="img">
        <image mode="aspectFill" :src="goods.pic[0]" />
      </view>
      <view class="fx1 flx fx-column fx-justify">
        <view class="title">{{goods.title}}</view>
        <view class="price">
          ￥0
          <text class="origin">￥{{formatPrice(goods ? (0 || goods.original_price) : 0 )}}</text>
        </view>
      </view>
    </view> -->
    <block>
      <block v-for="(items,index) in goodsList" :key="index">
        <view class="content flx">
          <view class="img">
            <image class="images" mode="aspectFill" :src="items.pic[0]" />
          </view>
          <view class="fx1 flx fx-column fx-justify">
            <view class="title">{{items.title}}</view>
            <view class="price">
              ￥0
              <text class="origin">￥{{formatPrice(items ? (0 || items.original_price) : 0 )}}</text>
            </view>
          </view>
        </view>
      </block>
    </block>
    <view class="content">
      <view class="fee-list">
        <view class="li">
          <view v-if="this.goodsList.length != 0">商品总价</view>
          <view>￥0.00</view>
        </view>
        <view class="li">
          <view>运费(快递)</view>
          <view>
            <block v-if="postFee === null">计算中···</block>
            <block v-else>￥{{(postFee/100).toFixed(2)}}</block>
          </view>
        </view>
      </view>
      <view class="total">
        <view>订单总价</view>
          <view>
            <block v-if="postFee === null">计算中···</block>
            <block v-else>￥{{(postFee/100).toFixed(2)}}</block>
        </view>
      </view>
      <view class="fee">
        <view>需支付：</view>
        <view class="pay">
          <block v-if="postFee === null">需添加地址才能计算邮费</block>
          <block v-else>￥{{(postFee/100).toFixed(2)}}</block>
        </view>
      </view>
    </view>
    <view class="postfee-tip" @click="jumpFAQ">
      <image mode="widthFix" :src="imgHOST+'/order-txt.png'" style="width:100%;height:100%;" />
    </view>
    <block v-if="same.length != 0">
      <view class="same-goods">
        <view class="title">该用户在送的其它商品</view>
        <scroll-view scroll-x>
          <view class="content">
            <view style="width:30rpx;flex-shrink:0;"></view>
            <block v-for="(item,index) in same" :key="index">
              <navigator
                open-type="navigate"
                hover-class="none"
                class="li z-depth-1"
                @click="introduce(item.id)"
              >
                <image mode="aspectFill" :src="item.pic[0]" />
              </navigator>
              <block v-if="itemIdList.includes(item.id)">
                <view 
                  hover-class="none"
                  class="add"
                  @click="deletePerson(item.id)"
                >
                  <image
                    class="add-btn"
                    mode="widthFix"
                    :src="imgHOST+'/icon/delete-btn.png'" 
                  />
                </view>
              </block>
              <block v-else>
                <view
                  hover-class="none"
                  @click="joinGoods(item)" 
                  class="add"
                >
                  <image
                    mode="widthFix" 
                    class="add-btn"
                    :src="imgHOST+'/icon/gwc-btn.png'" 
                  />
                </view>
              </block>
            </block>
            <view style="width:10rpx;flex-shrink:0;"></view>
          </view>
        </scroll-view>
      </view>
    </block>
    <view style="height:100rpx;"></view>
    <block v-if="isShare">
      <view class="pay-nav">
        <view>
          <text>共 1 件，</text>合计：
          <text class="pay">
            <block v-if="postFee === null">计算中···</block>
            <block v-else>￥{{(postFee/100).toFixed(2)}}</block>
          </text>
        </view>
        <view class="btn-submit" @click="submit">提交订单</view>
      </view>
    </block>
    <block v-else>
      <button open-type="share" class="btn-share">分享后免费获取</button>
    </block>
  </view>
</template>
<script>
import { Host, xhr, allowTypes, local, shareContent } from "@/common/util";
export default {
  data() {
    return {
      imgHOST: this.$common.util.imgHOST,
      address: null,
      goods: null,
      address: null,
      isShare: false,
      hasClickShare: false,
      postFee: null,
      same: [],
      goodsList:[],
      obj:{
        flag:false,
        goods:{}
      },
      itemIdList:[],
      length: 0
    };
  },
  methods: {
     buy() {
      if (local.get("user").role != "telUser") {
        return uni.showToast({
          title: "需绑定手机后购买",
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
      let url = "/item/checklimit",
        data = {};
      xhr.get(url, data, res => {
        if (String(res.statusCode)[0] == 2 && res.data) {
        } else {
          return uni.showToast({
            title: "每个账号每天限购一件",
            icon: "none"
          });
        }
          let id = this.id,
          img = this.goods.pic[0],
          title = this.goods.title,
          op = this.goods.original_price;
        local.set("orderGoods", this.detail);
        uni.navigateTo({
          url: "/pages/order/createOrder"
        });
      });
     },
     toBuy() {
      if (local.get("user").role != "telUser") {
        return uni.showToast({
          title: "请先登录",
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
      if (local.get("user").ad_level == 4 || local.get("user").ad_level >= 6) {
        return uni.showModal({
          title: "警告",
          content: "很抱歉，由于您存在违规操作，已被禁止申领/购买行为",
          showCancel: false,
          success: res => {}
        });
      }
      if (this.goods.only_pickup) {
        this.isShowAuditModal = true;
        // uni.showModal({
        //   title: '提示',
        //   content: `此商品仅限（${this.detail.place}）自提`,
        //   confirmText: '马上领',
        //   success: res => {
        //     if (res.confirm) {
        //       console.log('用户点击确定');
        //       this.isShowAuditModal = true;
        //     } else if (res.cancel) {
        //       console.log('用户点击取消');
        //     }
        //   }
        // });
      } else {
        this.buy();
      }
    },
    formatPrice(num) {
      return (num / 100).toFixed(2);
    },
    getPostFee() {
      console.log(this.goods.only_pickup,"goodsListonly_picup");
      let list = [];
      this.goodsList.forEach(v => {
        if(this.itemIdList.indexOf(v.id) < 0){
          this.itemIdList.push(v.id);
        }
        // this.itemIdList.split(",");
      });
      local.set("itemIdList",this.itemIdList);
      console.log(local.get("itemIdList"),"local.setlocal.set");
      console.log(this.itemIdList,"itemIdList");
      if (this.goods.only_pickup) {
        this.postFee = 0;
        return false;
      }
      if (!this.address) {
        if (this.isShare) {
          return uni.showModal({
            title: "提示",
            content: "需添加地址才能计算邮费",
            showCancel: false,
            success: res => {
              if (res.confirm) {
                uni.navigateTo({
                  url: "/pages/my/address/list/list"
                });
              }
            }
          });
        }
        return false;
      }
      let url = "/tools/postfee",
        data = {
          o: `${this.goodsList[0].place[0]}-${this.goodsList[0].place[1]}-${this.goodsList[0].place[2]}`,
          d: `${this.address.place[0]}-${this.address.place[1]}-${this.address.place[2]}`,
          i: this.itemIdList.join(',')
        };
      xhr.get(url, data, res => {
        if (res.statusCode == 200) {
          this.postFee = res.data;
          console.log( this.postFee,'this.postFee');
          return this.postFee
          
        }
      });
    },
    submit() {
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
      if (!this.address) {
        return uni.showToast({
          title: "请选择地址",
          icon: "none"
        });
      }
      if (this.postFee === null) {
        return uni.showToast({
          title: "运费计算失败，请重新选择地址",
          icon: "none"
        });
      }
      console.log(this.address,"this.address");
      console.log(this.postFee,"this.postFee");

      let url = "/item/order/" + this.itemIdList.join(','),
        data = {
          deliver_address: this.address, 
          post_fee: this.postFee
        };

        console.log(this.itemIdList,"this.goods.ids");
      uni.showModal({
        title: "提示",
        content: "若卖家120小时内不发货，系统会自动原路退回邮费",
        confirmText: "马上领",
        success: res => {
          if (res.confirm) {
            console.log("用户点击确定");
            uni.showLoading({
              mask: true
            });
            xhr.put(url, data, res => {
              console.log("createA");
              console.log(res);
              if (this.goods.only_pickup) {
                return uni.redirectTo({
                  url: "/pages/my/goods/get/get"
                });
              }
              if (String(res.statusCode)[0] == 2 && res.data) {
                let url = "/order/pay/" + res.data,
                  data = {};

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
                        uni.requestSubscribeMessage({
                          tmplIds: [
                            "T-oK_ZZwFttqX3P4XvdSv7w6ogIDdXkyItjapiabdRE",
                            "VcBdvKNx5vdxvKEiWFC1jolgxUHYT1nVQR8iWDDcxeY",
                            "3AwhmPvayfUBKSteBBucRseXPsq7mlS7pdh9R-DJugM"
                          ],
                          success (res) { 
                            console.log(res,"res")
                          },
                          complete() {
                            uni.redirectTo({
                              url: "/pages/my/goods/get/get?isShowOlay=1"
                            });
                          }
                        });
                      },
                      fail(err) {
                        uni.redirectTo({
                          url: "/pages/my/goods/get/get"
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
    sameAddress() {
     let url = "/item/items_same_address/" + this.goods.id,
        data = {};
      uni.showLoading({
        mask: true
      });
      xhr.get(url, data, res => {
        uni.hideLoading();
        console.log(res);
        if (res.statusCode == 200) {
          this.same = res.data;
          console.log(this.same,"this.sameAddress");
        }
      });
    },
    joinGoods(item) {
      if(this.goodsList.includes(item)) {
        uni.showToast({
          title: '请勿重复添加',
          icon: 'success',
          duration: 2000
        });
      }else{
         this.goodsList.push(item);
      }
      console.log(this.goodsList,"this.goodsList");
      this.getPostFee();
    },
    introduce(id) {
      uni.navigateTo({
         url:'/pages/goods/detail/detail?id=' + id
      });
    },
    deletePerson(id){
    var index = this.goodsList.findIndex(goods =>{
  　　if(goods.id==id){
　　　　  return true
  　　}
  　})
    if(index ===-1){
      uni.showToast({
          title: '取消成功',
          icon: 'success',
          duration: 2000
        });
        return;
    }
    this.goodsList.splice(index,1)
    this.itemIdList.splice(index,1);
    this.getPostFee();
    },
    jumpFAQ(){
      uni.navigateTo({
        url:'/pages/FAQ/FAQ?q=10'
      })
    }
  },
  computed(){
    this.postFee = this.getPostFee()
  },
  onLoad(options) {
    if (!local.get("orderGoods")) {
      return uni.redirectTo({
        url: "/pages/index/index"
      });
    }
    this.id = options.id;
    this.goods = local.get("orderGoods");
    this.goodsList = local.get("orderGoods");
    let tempList = [];
    tempList.push(local.get("orderGoods"));
    this.goodsList=tempList;

    console.log(this.goods, "this.goods");
    if (local.get("defaultAddress")) {
      this.address = local.get("defaultAddress");
    }
    uni.showModal({
      title: "惊喜",
      content: "分享给3个好友/群，即可免费领",
      showCancel: false,
      confirmText: "好哩",
      success: res => {
        console.log(res);
      }
    });
  },
  onShow() {
    console.log(this.goodsList.length,"this.goodsList.lenght");
    if (local.get("chooseAddress")) {
      this.address = local.get("chooseAddress");
    } else if (local.get("defaultAddress")) {
      this.address = local.get("defaultAddress");
    }
    this.isShare = this.hasClickShare;
    this.getPostFee();
    this.sameAddress();
  },
  onUnload() {
    local.clear("orderGoods");
    local.clear("sameAddress")
  },
  onShareAppMessage(res) {
    this.hasClickShare = true;
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
.content {
  padding: 20rpx;
  background-color: #fff;
  .img {
    width: 180rpx;
    height: 180rpx;
    border-radius: 8rpx;
    overflow: hidden;
    margin-right: 30rpx;
    .images {
      width: 100%;
      height: 100%;
    }
  }
  .title {
    width: 330rpx;
    font-size: 36rpx;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .price {
    font-size: 40rpx;
    font-weight: bold;
    .origin {
      margin-left: 20rpx;
      color: #bbb;
      font-size: 28rpx;
      text-decoration: line-through;
    }
  }
  .deleteBtn{
      transform: translateY(260%);
      height: 50rpx;
      width: 116rpx;
    .cancel{
      height: 100%;
      width: 100%;
    }
  }
}
.chooseAddress {
  margin-bottom: 20rpx;
  padding: 40rpx 20rpx;
  background-color: #fff;
  font-size: 30rpx;
  .input {
    margin: 0 20rpx;
    color: #bbb;
    text-align: right;
  }
  image {
    width: 36rpx;
    height: 36rpx;
  }
}
.address {
  margin-bottom: 20rpx;
  padding: 20rpx 20rpx 40rpx;
  background-color: #fff;
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
.same-goods {
  background-color: #fff;
  .title {
    margin: 20rpx 30rpx;
    padding-top: 10rpx;
    font-size: 13px;
    font-weight: 500;
  }
  scroll-view {
    height: 300rpx;
  }
  .content {
    display: flex;
    margin-bottom: 20rpx;
    .li {
      flex-shrink: 0;
      position: relative;
      width: 200rpx;
      height: 200rpx;
      border-radius: 12rpx;
      overflow: hidden;
      &:not(:last-child) {
        margin-right: 20rpx;
      }
      &.more {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: #bbb;
      }
      image {
        width: 100%;
        height: 100%;
      }
    }
    .add {
      .add-btn {
        width: 40rpx;
        height: 40rpx;
        transform: translateX(-350%) translateY(540%);
      }
    }
  }
}
.pay-nav {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20rpx;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 112rpx;
  box-sizing: border-box;
  background-color: #fff;
  color: #333;
  font-size: 26rpx;

  text {
    color: #666;
    font-size: 22rpx;
  }

  .pay {
    color: #ff5e41;
    font-size: 30rpx;
  }
  .btn-submit {
    padding: 0 38rpx;
    height: 88rpx;
    line-height: 88rpx;
    color: #fff;
    text-align: center;
    background-color: $main-color;
    border-radius: 44rpx;
    font-size: 32rpx;
    margin-left: 20rpx;
  }
}
.btn-share {
  position: fixed;
  bottom: 30rpx;
  left: 0;
  right: 0;
  margin: auto;
  padding: 0 38rpx;
  width: 668rpx;
  height: 88rpx;
  line-height: 88rpx;
  color: #fff;
  text-align: center;
  background-color: $main-color;
  border-radius: 44rpx;
  font-size: 32rpx;
}

.fee-list {
  padding-bottom: 20rpx;
  border-bottom: 1px solid #f3f3f3;

  .li {
    display: flex;
    justify-content: space-between;
    align-content: middle;
    padding-top: 20rpx;
    color: #666;
    font-size: 24rpx;
  }
}
.total {
  display: flex;
  justify-content: space-between;
  align-content: middle;
  padding-top: 20rpx;
  color: #333;
  font-size: 28rpx;
}
.fee {
  display: flex;
  justify-content: space-between;
  align-content: middle;
  font-size: 28rpx;
  padding-top: 20rpx;
  .pay {
    color: #ff5e41;
  }
}

.postfee-tip {
  margin: 20rpx;
  border-radius: 16rpx;
  font-size: 24rpx;
  line-height: 1.6;
}
</style>