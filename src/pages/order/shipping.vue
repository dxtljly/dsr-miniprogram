<template>
  <view style="height:100%;">
    <gl-navbar back home text="预约快递"></gl-navbar>
    <block v-if="detail">
      <view class="content">
        <view class="address">
          <view
            v-if="detail.seller_address.wx_account || detail.seller_address.qq_account"
            class="contact"
          >
            <!-- <text v-if="detail.seller_address.wx_account">微信号：{{detail.seller_address.wx_account}}</text>
            <text v-if="detail.seller_address.qq_account">QQ号：{{detail.seller_address.qq_account}}</text>-->
          </view>
          <view class="flx fx-middle">
            <view class="icon seller">寄</view>
            <view class="fx1 txt">
              <view
                class="name"
              >寄件人：{{detail.seller_address.name}} {{detail.seller_address.telephone}}</view>
              <view
                class="info"
              >{{String(detail.seller_address.place)}} {{detail.seller_address.detail}}</view>
            </view>
            <view class="edit-address" @click="showEditAddress">
              <view>修改</view>
              <view>地址</view>
            </view>
          </view>
        </view>
        <view class="address">
          <view
            v-if="detail.deliver_address.wx_account || detail.deliver_address.qq_account"
            class="contact"
          >
            <text v-if="detail.deliver_address.wx_account">微信号：{{detail.deliver_address.wx_account}}</text>
            <text v-if="detail.deliver_address.qq_account">QQ号：{{detail.deliver_address.qq_account}}</text>
          </view>
          <view class="flx fx-middle">
            <view class="icon buyer">收</view>
            <view class="fx1 txt">
              <view
                class="name"
              >收件人：{{detail.deliver_address.name}} {{detail.deliver_address.telephone}}</view>
              <view class="info">{{detail.deliver_address.place}} {{detail.deliver_address.detail}}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="content">
        <block v-for="(item,index) in detail.items" :key="index">
          <navigator
            hover-class="none"
            :url="'/pages/goods/detail/detail?id='+item.id"
            class="goods flx"
          >
            <view class="img">
              <image mode="aspectFill" :src="item.pic[0]" />
            </view>
            <view class="fx1 flx fx-column fx-justify">
              <view class="title">{{item.title}}</view>
              <view class="number">数量:1</view>
            </view>
          </navigator>
        </block>
        <view class="detail-info">
          <view class="li">
            <block v-if="isOwner">
              <view>领取者昵称</view>
              <view style="max-width:500rpx;">{{detail.buyer.nickName}}</view>
            </block>
            <block v-else>
              <view>赠送者昵称</view>
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
        <!-- v-if="detail.status == '3-5'" -->
        <view class="bot-btns">
          <view class="btn submit" @click="ship">下单</view>
        </view>
      </block>
      <block v-else>
        <view
          v-if="detail.status == 2 || detail.status == 3"
          class="btn-submit"
          @click="receive"
        >确认收货</view>
      </block>
    </block>

    <block v-if="isShowAddressModal">
      <view class="shipping-modal">
        <view class="input-content">
          <view class="li">
            <view class="label">寄件人</view>
            <view class="input">
              <input
                v-model="address.name"
                type="text"
                placeholder="请输入姓名"
                placeholder-style="color:#bbb;"
              />
            </view>
            <image
              v-if="address.name"
              class="clean"
              mode="widthFix"
              :src="imgHOST+'/icon/clean.png'"
              @click="clean"
              data-key="name"
            />
          </view>
          <view class="li">
            <view class="label">联系电话</view>
            <view class="input">
              <input
                v-model="address.telephone"
                type="text"
                placeholder="请输入手机号"
                placeholder-style="color:#bbb;"
              />
            </view>
            <image
              v-if="address.telephone"
              class="clean"
              mode="widthFix"
              :src="imgHOST+'/icon/clean.png'"
              @click="clean"
              data-key="telephone"
            />
          </view>
          <view class="li">
            <view class="label">所在省市</view>
            <view class="input">
              <view class="flx fx-middle fcbbb">
                <view class="fx1">
                  <view>{{address.place}}</view>
                </view>
                <image mode="widthFix" class="arrow" :src="imgHOST+'/icon/arrow.png'" />
              </view>
            </view>
          </view>
          <view class="li">
            <view class="label">所在地区</view>
            <view class="input">
              <input
                v-model="address.editArea"
                type="text"
                placeholder="地区必填"
                placeholder-style="color:#bbb;"
              />
            </view>
            <image
              v-if="address.editArea"
              class="clean"
              mode="widthFix"
              :src="imgHOST+'/icon/clean.png'"
              @click="clean"
              data-key="editArea"
            />
          </view>
          <view class="li noborder">
            <view class="label">详细地址</view>
            <view class="input">
              <textarea
                v-model="address.detail"
                maxlength="100"
                placeholder="请输入地址"
                placeholder-style="color:#bbb;"
                style="width:100%;height:200rpx;line-height:1.4;"
              />
            </view>
            <image
              v-if="address.detail"
              class="clean"
              mode="widthFix"
              :src="imgHOST+'/icon/clean.png'"
              @click="clean"
              data-key="detail"
            />
          </view>
          <view class="warning-tip">
            <image mode="widthFix" :src="imgHOST+'/icon/icon-warning.png'" />
            <view>温馨提示：因涉及到运费计算，所在省市无法修改。</view>
          </view>
          <view class="btn-list">
            <view class="btn reject" @click="closeEditAddress">取消</view>
            <view class="btn submit" @click="editAddress">修改</view>
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
  shareContent
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
      isShowAddressModal: false,
      address: {
        name: "",
        telephone: "",
        place: "",
        detail: "",
        wx_account: "",
        qq_account: "",
        editArea: ""
      }
    };
  },
  methods: {
    copyAddress() {
      let data =
        `收件人： ${this.detail.deliver_address.name}   ${this.detail.deliver_address.telephone}\n` +
        `地址： ${this.detail.deliver_address.place +
          this.detail.deliver_address.detail}`;

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
    getDetail() {
      let url = "/item/" + this.id,
        data = {};
      uni.showLoading({
        mask: true
      });
      xhr.get(url, data, res => {
        uni.hideLoading();
        console.log(res);
        if (res.statusCode == 200) {
          this.detail = res.data;
          this.checkOwner();
        } else {
          uni.showToast({
            title: "网络错误",
            icon: "none"
          });
        }
      });
    },
    getDetail() {
      let url = "/order/order_detail/" + this.id,
        data = {};
      uni.showLoading({
        mask: true
      });
      xhr.get(url, data, res => {
        uni.hideLoading();
        console.log(res);
        if (res.statusCode == 200) {
          this.detail = res.data;
          this.checkOwner();
        } else {
          uni.showToast({
            title: "网络错误",
            icon: "none"
          });
        }
      });
    },
    ship() {
      uni.showModal({
        title: "提示",
        content: "确定现在预约快递吗？",
        cancelText: "取消",
        confirmText: "确定",
        success: res => {
          if (res.confirm) {
            console.log("用户点击确定");
            let url = "/order/ship/" + this.id,
              data = {};
            uni.showLoading({
              mask: true
            });
            xhr.put(url, data, res => {
              uni.hideLoading();
              if (String(res.statusCode)[0] == 2) {
                uni.showModal({
                  title: "预约成功",
                  content: "快递小哥会尽快联系您！",
                  showCancel: false,
                  confirmText: "好哩",
                  success: res => {
                    uni.redirectTo({
                      url: "/pages/order/detail?id=" + this.id
                    });
                  }
                });
              }
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    showEditAddress() {
      this.address = this.detail.seller_address
        ? {
            name: this.detail.seller_address.name,
            telephone: this.detail.seller_address.telephone,
            place: this.detail.seller_address.place,
            detail: this.detail.seller_address.detail,
            wx_account: this.detail.seller_address.wx_account,
            qq_account: this.detail.seller_address.qq_account,
            editArea: this.detail.seller_address.place[2]
          }
        : {
            name: "",
            telephone: "",
            place: this.detail.seller_address.place,
            detail: "",
            wx_account: "",
            qq_account: "",
            editArea: this.detail.seller_address.place[2]
          };
      this.isShowAddressModal = true;
    },
    closeEditAddress() {
      this.isShowAddressModal = false;
    },
    clean(e) {
      let key = e.currentTarget.dataset.key;
      this.address[key] = "";
    },
    editAddress() {
      let url = "/item/sellerAddr/" + this.id,
        data = this.address;

      if (!data.editArea) {
        return uni.showToast({
          title: "地区必填",
          icon: "none"
        });
      }
      data.place[2] = data.editArea;
      delete data.editArea;

      xhr.put(url, data, res => {
        if (res.statusCode == 200) {
          this.detail.seller_address = JSON.parse(JSON.stringify(this.address));
          this.closeEditAddress();
        }
      });
    }
  },
  onLoad(options) {
    if (!options.id) {
      return uni.redirectTo({
        url: "/pages/index/index"
      });
    }
    this.id = options.id;
    console.log(this.id,"options.idoptions.id");
    this.getDetail();
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
.borbot {
  border-bottom: 1px solid #f3f3f3;
}
.content {
  margin-top: 20rpx;
  padding: 0 20rpx;
  background-color: #fff;
  .address {
    padding: 40rpx 0;
    @extend .borbot;

    .icon {
      flex-shrink: 0;
      margin: 10rpx;
      width: 38rpx;
      height: 38rpx;
      line-height: 38rpx;
      border-radius: 50%;
      text-align: center;
      color: #fff;
      font-size: 24rpx;

      &.seller {
        background: $main-color;
      }
      &.buyer {
        background: $main-color-1;
      }
    }
    .edit-address {
      flex-shrink: 0;
      color: $main-color-1;
      font-size: 24rpx;
      padding: 30rpx 50rpx;
      border-left: 1px solid #f3f3f3;
    }

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
    padding: 20rpx 60rpx;
    border-radius: 44rpx;
    &.reject {
      color: #666;
      border: 1px solid #bbb;
    }
    &.submit {
      color: #fff;
      border: 1px solid $main-color;
      background: $main-color;
    }
  }
}
.shipping-modal {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(30, 30, 30, 0.4);
  .input-content {
    margin: 200rpx 40rpx 0;
    padding: 40rpx;
    border-radius: 16rpx;
    background: #fff;
    .li {
      display: flex;
      padding: 20rpx 0;
      font-size: 28rpx;
      border-bottom: 1px solid #f9f9f9;

      &.noborder {
        border: none;
      }

      .label {
        flex-shrink: 0;
        width: 140rpx;
        margin-right: 40rpx;
        font-weight: bold;
        text {
          color: #bbb;
          font-size: 20rpx;
          font-weight: normal;
        }
      }
      .input {
        flex-grow: 1;
        align-self: center;
        color: #4a4a4a;
      }
      .clean {
        align-self: center;
        width: 26rpx;
        height: 26rpx;
        margin-left: 20rpx;
        vertical-align: middle;
      }
      .arrow {
        margin-left: 20rpx;
        width: 24rpx;
        height: 24rpx;
      }
    }
    .btn-list {
      display: flex;
      align-items: center;
      justify-content: center;

      .btn {
        margin-right: 30rpx;
        padding: 20rpx 60rpx;
        border-radius: 44rpx;
        &.reject {
          color: #666;
          border: 1px solid #bbb;
        }
        &.submit {
          color: #fff;
          border: 1px solid $main-color;
          background: $main-color;
        }
      }
    }
    .warning-tip {
      display: flex;
      color: $main-color;
      font-size: 20rpx;
      padding: 20rpx 40rpx;
      image {
        flex-shrink: 0;
        width: 24rpx;
        height: 24rpx;
        margin-right: 8rpx;
        margin-top: 4rpx;
      }
    }
  }
}
</style>


