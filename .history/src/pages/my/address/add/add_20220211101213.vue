<template>
  <view>
    <gl-navbar back home :text="id?'修改地址':'添加地址'"></gl-navbar>
    <view class="container">
      <view class="content">
        <view class="li">
          <view class="label">收货人</view>
          <view class="input">
            <input v-model="name" type="text" placeholder="请输入姓名" placeholder-style="color:#bbb;" />
          </view>
          <image
            v-if="name"
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
              v-model="telephone"
              type="text"
              placeholder="请输入手机号"
              placeholder-style="color:#bbb;"
            />
          </view>
          <image
            v-if="telephone"
            class="clean"
            mode="widthFix"
            :src="imgHOST+'/icon/clean.png'"
            @click="clean"
            data-key="telephone"
          />
        </view>
        <!-- <view class="li">
          <view class="label">
            微信号
            <text>(选填)</text>
          </view>
          <view class="input">
            <input
              v-model="wx_account"
              type="text"
              placeholder="方便卖家主动联系您"
              placeholder-style="color:#bbb;"
            />
          </view>
          <image
            v-if="wx_account"
            class="clean"
            mode="widthFix"
            :src="imgHOST+'/icon/clean.png'"
            @click="clean"
            data-key="wx_account"
          />
        </view> -->
        <!-- <view class="li">
          <view class="label">
            QQ号
            <text>(选填)</text>
          </view>
          <view class="input">
            <input
              v-model="qq_account"
              type="text"
              placeholder="可与微信号二选一"
              placeholder-style="color:#bbb;"
            />
          </view>
          <image
            v-if="qq_account"
            class="clean"
            mode="widthFix"
            :src="imgHOST+'/icon/clean.png'"
            @click="clean"
            data-key="qq_account"
          />
        </view> -->
        <view class="li">
          <view class="label">所在地区</view>
          <picker mode="region" class="input" @change="bindPickerCity" :value="place">
            <view class="flx fx-middle">
              <view class="fx1">
                <view v-if="place.length">{{String(place)}}</view>
                <view v-else style="color:#bbb;">选择城市</view>
              </view>
              <image mode="widthFix" class="arrow" :src="imgHOST+'/icon/arrow.png'" />
            </view>
          </picker>
        </view>
        <view class="li noborder">
          <view class="label">详细地址</view>
          <view class="input">
            <textarea
              v-model="detail"
              maxlength="100"
              placeholder="请输入地址"
              placeholder-style="color:#bbb;"
              style="width:100%;height:200rpx;line-height:1.4;"
            />
          </view>
          <image
            v-if="detail"
            class="clean"
            mode="widthFix"
            :src="imgHOST+'/icon/clean.png'"
            @click="clean"
            data-key="detail"
          />
        </view>
      </view>
      <!-- <view class="warning-tip">
        <image mode="widthFix" :src="imgHOST+'/icon/icon-warning.png'"/>
        <view>温馨提示：因不同地区运费金额不同，请确保该件商品的所在地区填写无误；如买家拍下该件商品，则所在地区将无法修改。</view>
      </view>-->
    </view>
    <view class="save-btn" @click="submit">{{id?'更新':'保存'}}</view>
  </view>
</template>
<script>
import { xhr, allowTypes, local, shareContent } from "@/common/util";
export default {
  data() {
    return {
      imgHOST: this.$common.util.imgHOST,
      id: null,
      name: "",
      telephone: local.get("user").telephone ? local.get("user").telephone : "",
      wx_account: "",
      qq_account: "",
      place: "",
      detail: ""
    };
  },
  methods: {
    clean(e) {
      let key = e.currentTarget.dataset.key;
      this[key] = "";
    },
    bindPickerCity(e) {
      this.place = [...e.detail.value];
    },
    getDetail() {
      let url = "/user/address/" + this.id,
        data = {};
      uni.showLoading({
        mask: true
      });
      xhr.get(url, data, res => {
        uni.hideLoading();
        if (res.statusCode == 200) {
          this.name = res.data.name;
          this.telephone = res.data.telephone;
          this.wx_account = res.data.wx_account;
          this.qq_account = res.data.qq_account;
          this.place = res.data.place;
          this.detail = res.data.detail;
        }
      });
    },
    submit() {
      let url = "/user/address",
        data = {
          name: this.name,
          telephone: this.telephone,
          wx_account: this.wx_account,
          qq_account: this.qq_account,
          place: [...this.place],
          detail: this.detail
        };
      if (!data.name) {
        return uni.showToast({
          title: "缺少收件人",
          icon: "none"
        });
      }
      if (!data.telephone) {
        return uni.showToast({
          title: "缺少联系电话",
          icon: "none"
        });
      }
      if (!data.place.length) {
        return uni.showToast({
          title: "缺少所在地区",
          icon: "none"
        });
      }
      if (!data.detail) {
        return uni.showToast({
          title: "缺少详细地址",
          icon: "none"
        });
      }
      uni.showLoading({
        mask: true
      });
      if (!this.id) {
        xhr.post(url, data, res => {
          uni.hideLoading();
          console.log(res);
          if (String(res.statusCode)[0] == 2) {
            uni.navigateBack();
            local.set("editAddress", { id: res.data });
          }
        });
      } else {
        data.id = this.id;
        xhr.put(url, data, res => {
          uni.hideLoading();
          console.log(res);
          if (String(res.statusCode)[0] == 2) {
            uni.navigateBack();
            local.set("editAddress", { id: this.id });
          }
        });
      }
    }
  },
  onLoad(options) {
    if (options.id) {
      this.id = options.id;
      this.getDetail();
      local.get("itemIdList");
    }
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
.container {
  padding: 20rpx 0 160rpx;
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
.content {
  padding: 0 40rpx 20rpx;
  background-color: #fff;
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
}
.save-btn {
  position: fixed;
  margin: auto;
  left: 0;
  right: 0;
  bottom: 36rpx;
  width: 668rpx;
  height: 88rpx;
  line-height: 88rpx;
  color: #fff;
  background-color: $main-color;
  border-radius: 44rpx;
  text-align: center;
}
</style>