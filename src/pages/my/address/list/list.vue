<template>
  <view style="height:100%;">
    <gl-navbar back home text="我的地址"></gl-navbar>
    <scroll-view
      scroll-y
      enable-back-to-top
      @scrolltolower="getList"
      :style="'height:calc(100% - '+(statusBarHeight+navigationHeight)+'px);'"
    >
      <!-- <view class="warning-tip">
        <image mode="widthFix" :src="imgHOST+'/icon/icon-warning.png'"/>
        <view>温馨提示：因不同地区运费金额不同，请确保该件商品的所在地区填写无误；如买家拍下该件商品，则所在地区将无法修改。</view>
      </view>-->

      <view class="load" v-if="isLoading">
        <view>
          <image mode="widthFix" :src="imgHOST+'/icon/loadding.gif'" />
          <view>加载中···</view>
        </view>
      </view>
      <view class="load" v-else-if="list.length==0">
        <view>
          <image mode="widthFix" :src="imgHOST+'/icon/null.png'" />
          <view>还未添加地址哩~</view>
        </view>
      </view>
      <block v-for="(item,index) in list" :key="index">
        <view class="address">
          <view
            class="address-header flx fx-justify fx-middle"
            @click="chooseAddress"
            :data-item="item"
          >
            <view>{{item.addresses.name}}</view>
            <view>{{item.addresses.telephone}}</view>
          </view>
          <view class="address-contact flx" @click="chooseAddress" :data-item="item">
            <view v-if="item.addresses.wx_account">微信号:{{item.addresses.wx_account}}</view>
            <view v-if="item.addresses.qq_account">QQ号:{{item.addresses.qq_account}}</view>
          </view>
          <view
            class="address-content"
            @click="chooseAddress"
            :data-item="item"
          >{{item.addresses.place[0]}} {{item.addresses.place[1]}} {{item.addresses.place[2]}} {{item.addresses.detail}}</view>
          <view class="address-footer flx fx-justify fx-middle">
            <view
              class="label"
              @click="addressDefault"
              :data-id="item.addresses.id"
              :data-default="item.default"
            >
              <image v-if="item.default" :src="imgHOST+'/icon/checked.png'" class="radio" />
              <text v-else class="radio"></text>
              <text>默认地址</text>
            </view>
            <view class="tool flx fx-justify fx-middle">
              <view @click="delAddress" :data-id="item.addresses.id">
                <image :src="imgHOST+'/icon/delete.png'" />
                <text>删除</text>
              </view>
              <view>
                <navigator
                  hover-class="none"
                  :url="'/pages/my/address/add/add?id='+item.addresses.id"
                >
                  <image :src="imgHOST+'/icon/edit.png'" />
                  <text>编辑</text>
                </navigator>
              </view>
            </view>
          </view>
        </view>
      </block>
      <view style="height:160rpx;"></view>
    </scroll-view>
    <navigator hover-class="none" url="/pages/my/address/add/add" class="add-btn">添加地址</navigator>
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
      isLoading: true
    };
  },
  methods: {
    chooseEditAddress() {
      if (!local.get("editAddress")) {
        return false;
      }
      let editAddressId = local.get("editAddress").id;
      this.list.map((v, i) => {
        if (v.addresses.id == editAddressId) {
          local.set("chooseAddress", v.addresses);
          uni.navigateBack();
        }
      });
    },
    getList() {
      let url = "/user/addresses",
        data = {};
      xhr.get(url, data, res => {
        this.isLoading = false;
        if (res.statusCode == 200) {
          this.list = res.data;
          this.checkDefaultAddress();
          this.chooseEditAddress();
        }
      });
    },
    checkDefaultAddress() {
      if (this.list.length) {
        local.set("defaultAddress", { ...this.list[0].addresses });
      }
      if (!this.list.length || this.list[0].default) {
        return false;
      }
      let url = "/user/address/default/" + this.list[0].addresses.id,
        data = {};
      xhr.put(url, data, res => {
        if (res.statusCode == 200) {
          this.list[0].default = true;
        }
      });
    },
    addressDefault(e) {
      if (e.currentTarget.dataset.default) {
        return false;
      }
      let id = e.currentTarget.dataset.id;
      let url = "/user/address/default/" + id,
        data = {};
      xhr.put(url, data, res => {
        if (res.statusCode == 200) {
          this.getList();
        }
      });
    },
    delAddress(e) {
      let id = e.currentTarget.dataset.id;
      let url = "/user/address",
        data = { id };
      xhr.delete(url, data, res => {
        console.log(res);
        if (res.statusCode == 200) {
          this.getList();
        }
      });
    },
    chooseAddress(e) {
      console.log(e);
      let item = e.currentTarget.dataset.item;
      local.set("chooseAddress", item.addresses);
      uni.navigateBack();
    }
  },
  onload(options) {},
  onShow() {
    local.clear("chooseAddress");
    this.getList();
  },
  onUnload() {
    local.clear("editAddress");
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
scroll-view {
  box-sizing: border-box;
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
.address {
  margin-bottom: 20rpx;
  padding: 40rpx;
  background-color: #fff;

  .address-header {
    font-size: 30rpx;
  }
  .address-contact {
    font-size: 24rpx;
    color: #4a4a4a;
    view {
      margin-top: 10rpx;
      margin-right: 40rpx;
    }
  }
  .address-content {
    font-size: 26rpx;
    color: #4a4a4a;
    padding: 20rpx 0;
  }
  .address-footer {
    padding-top: 20rpx;
    border-top: 1px solid #f3f3f3;
    font-size: 24rpx;

    .label {
      display: flex;
      align-items: center;
      .radio {
        width: 28rpx;
        height: 28rpx;
        margin-right: 10rpx;
        border-radius: 50%;
        border: 1px solid #cfcfcf;
      }
      image.radio {
        vertical-align: middle;
        border: none;
      }
    }
    .tool {
      view {
        margin-left: 40rpx;
        color: #9b9b9b;
        image {
          width: 28rpx;
          height: 28rpx;
          margin-right: 8rpx;
          vertical-align: middle;
        }
      }
    }
  }
}
.add-btn {
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
</style>