<template>
  <view style="height:100%;">
    <gl-navbar back home></gl-navbar>
    <view
      class="flx fx-middle fx-center"
      :style="'height:calc(100% - '+(statusBarHeight+navigationHeight)+'px);background:#fff;'"
    >
      <view class="content">
        <image mode="widthFix" :src="imgHOST+'/logo.png'" class="logo" />
        <block v-if="user.role == 'noAuth'">
          <button @click="getUserProfile">
            <image mode="widthFix" :src="imgHOST+'/icon/wechat.png'" />获取头像、昵称
          </button>
        </block>
        <block v-if="user.role == 'authUser'">
          <button class="outline" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
            <image mode="widthFix" :src="imgHOST+'/icon/phone-on.png'" />授权手机登录
          </button>
        </block>
        <block v-if="user.role == 'telUser'">
          <button class="outline" @click="getUserProfile">
            <image mode="widthFix" :src="imgHOST+'/icon/wechat-on.png'" />更新头像、昵称
          </button>
        </block>
      </view>
    </view>
  </view>
</template>
<script>
const app = getApp();
import { Host, xhr, allowTypes, local, shareContent } from "@/common/util";
export default {
  data() {
    return {
      imgHOST: this.$common.util.imgHOST,
      statusBarHeight: app.globalData.statusBarHeight,
      navigationHeight: app.globalData.navigationHeight,
      user: local.get("user")
    };
  },
  methods: {
    checkUser() {
      let url = "/user/",
        data = {};
      xhr.get(url, data, res => {
        console.log(res);
        if (String(res.statusCode)[0] == 2) {
          local.set("user", res.data);
          this.user = res.data;
          if (local.get("user").role == "telUser") {
            uni.navigateBack();
          }
        }
      });
    },
    getUserProfile() {
      uni.getUserProfile({
        desc: "用于完善会员头像、昵称",
        complete: res => {
          console.log(res);
          let detail = res;
          if (res.errMsg === "getUserProfile:ok") {
            uni.getProvider({
              service: "oauth",
              success: res => {
                uni.login({
                  provider: res.provider[0],
                  success: res => {
                    let url = "/user/login/" + res.code,
                      data = {};
                    xhr.get(url, data, res => {
                      if (res.statusCode == 200) {
                        uni.setStorageSync(
                          "access_token",
                          res.data.access_token
                        );
                        local.set("user", res.data.user);
                        let url = "/user/auth",
                          data = {
                            encryptedData: detail.encryptedData,
                            iv: detail.iv
                          };
                        
                        // inviterId
                        if (local.get("user").role == "noAuth") {
                          if (local.get("inviter")) {
                            data.ref = local.get("inviter").id;
                          }
                        }

                        xhr.put(url, data, res => {
                          console.log(res);
                          if (String(res.statusCode)[0] == 2) {
                            this.checkUser();
                          }
                        });
                      }
                    });
                  },
                  fail: err => {
                    console.error(err);
                  }
                });
              }
            });
          }
        }
      });
    },
    getPhoneNumber(e) {
      if (e.detail.errMsg == "getPhoneNumber:ok") {
        console.log(e);
        uni.getProvider({
          service: "oauth",
          success: res => {
            uni.login({
              provider: res.provider[0],
              success: res => {
                let url = "/user/login/" + res.code,
                  data = {};
                xhr.get(url, data, res => {
                  if (res.statusCode == 200) {
                    uni.setStorageSync("access_token", res.data.access_token);
                    local.set("user", res.data.user);
                    let url = "/user/tel",
                      data = {
                        encryptedData: e.detail.encryptedData,
                        iv: e.detail.iv
                      };
                    console.log("login data",data);
                    xhr.put(url, data, res => {
                      console.log(res);
                      if (String(res.statusCode)[0] == 2) {
                        this.checkUser();
                      }
                    });
                  }
                });
              },
              fail: err => {
                console.error(err);
              }
            });
          }
        });
      }
    }
  },
  beforeMount() {},
  onLoad(options) {
    
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
.content {
  padding-bottom: 120rpx;
  text-align: center;
  .logo {
    margin-bottom: 80rpx;
    width: 164rpx;
    height: 164rpx;
  }
  button {
    width: 400rpx;
    height: 80rpx;
    line-height: 80rpx;
    font-size: 32rpx;
    font-weight: normal;
    color: #fff;
    background-color: $main-color;
    border-radius: 40rpx;
    &::after {
      border: none;
    }
    &.outline {
      background-color: #fff;
      color: $main-color;
      border: 1px solid $main-color;
    }
    image {
      width: 48rpx;
      height: 48rpx;
      vertical-align: middle;
      margin-right: 20rpx;
    }
  }
}
</style>