<template>
  <view>
    <gl-navbar back home text="打卡赢好礼"></gl-navbar>
    <image mode="widthFix" :src="imgHOST+'/clock/head.jpg'" style="display:block;width:100%;" />
    <view class="container">
      <view class="card">
        <view class="border"></view>
        <image
          mode="widthFix"
          :src="imgHOST+'/clock/活动介绍.png'"
          style="display:block;position:relative;margin:40rpx auto 0;width:90%;"
        />
        <block v-if="isSignup">
          <view>
            <view class="tx-center" style="margin:40rpx;">
              <text style="color:#909399;">我的积分：</text>
              <text style="color:#da3443;font-size:20px;">{{myPoints || 0}}</text>
            </view>
            <view class="assist_by" :class="{'fx-center':myAssist.length<5}">
              <block v-for="(item,index) in myAssist" :key="index">
                <view style="flex-shrink:0;margin-right: 20rpx;">
                  <view class="user">
                    <image mode="aspectFill" :src="item.assist_by.avatarUrl" class="avatar" />
                    <view class="nickName">{{item.assist_by.nickName}}</view>
                  </view>
                  <view class="tx-center" style="margin-top:6rpx;font-size:10px;color:#909399;">
                    助力了
                    <text style="color:#da3443;">{{item.count}}</text>次
                  </view>
                </view>
              </block>
            </view>
          </view>
        </block>
        <block v-else>
          <button
            hover-class="none"
            :open-type="user.role == 'noAuth' ? '' :( user.role == 'authUser' ? 'getPhoneNumber' :'')"
            @getphonenumber="getPhoneNumber"
            @click="signup"
          >
            <image
              mode="widthFix"
              :src="imgHOST+'/clock/报名.png'"
              style="display:block;position:relative;margin:30rpx auto 10rpx;width:90%;"
            />
          </button>
        </block>
        <button
          hover-class="none"
          :open-type="user.role == 'noAuth' ? '' :( user.role == 'authUser' ? 'getPhoneNumber' : '' )"
          @getphonenumber="getPhoneNumber"
          @click="toInvite"
        >
          <image
            mode="widthFix"
            :src="imgHOST+'/clock/邀好友.png'"
            style="display:block;position:relative;margin:0 auto 30rpx;width:90%;"
          />
        </button>
        <block v-if="isSignup">
          <navigator hover-class="none" url="/pages/goods/add/add">
            <image
              mode="widthFix"
              :src="imgHOST+'/clock/上架闲置.png'"
              style="display:block;position:relative;margin:0 auto 30rpx;width:90%;"
            />
          </navigator>
        </block>
      </view>
      <view class="card">
        <view class="border"></view>
        <image
          mode="widthFix"
          :src="imgHOST+'/clock/排行榜.png'"
          style="display:block;position:relative;margin:40rpx auto 30rpx;width:160px;"
        />
        <block v-for="(item,index) in topList" :key="index">
          <block v-if="index<10">
            <view class="rank flx fx-middle fx-justify" :class="{'me':user.id==item.user.id}">
              <view class="flx fx-middle">
                <view class="medal flx fx-middle">
                  <image v-if="index==0" mode="widthFix" :src="imgHOST+'/clock/No.1.png'" />
                  <image v-if="index==1" mode="widthFix" :src="imgHOST+'/clock/No.2.png'" />
                  <image v-if="index==2" mode="widthFix" :src="imgHOST+'/clock/No.3.png'" />
                </view>
                <image mode="aspectFill" :src="item.user.avatarUrl" class="avatar" />
                <view class="nickName">{{item.user.nickName}}</view>
              </view>
              <view class="integral">{{item.total_point || 0}}积分</view>
            </view>
          </block>
        </block>

        <block v-if="topList.length>10">
          <navigator
            hover-class="none"
            url="/pages/clock/rank"
            style="margin:20rpx 0;text-align:center;font-size:12px;color:#673f22;text-decoration:underline;opacity:.7;"
          >查看全部排名>></navigator>
        </block>
      </view>
      <navigator
        hover-class="none"
        url="/pages/webviews/webviews?url=https://mp.weixin.qq.com/s/cXPGNvuBQz0Xpn_CmOJvfQ"
      >
        <image mode="widthFix" :src="imgHOST+'/clock/奖品.png'" style="width:100%;" />
      </navigator>
    </view>

    <!-- share -->
    <action-sheet :isSchool="isSchool" share :on="isShowShare"></action-sheet>

    <!-- canvas -->
    <view
      class="save-container"
      :class="{'on':isShowSaveContainer}"
      :style="'height:calc(100% - ' +(statusBarHeight+navigationHeight)+ 'px);'"
    >
      <view class="bg" @click="closeSaveContainer"></view>
      <view>
        <canvas
          canvas-id="show-card"
          class="show-card"
          :style="'width:'+canvasW+'px;height:'+canvasH+'px;'"
        ></canvas>
        <canvas
          canvas-id="save-card"
          class="save-card"
          :style="'width:'+(canvasW*canvasScale)+'px;height:'+(canvasH*canvasScale)+'px;'"
        ></canvas>
        <view class="btn" @click="saveImg">保存图片分享</view>
      </view>
    </view>

    <!-- 助力 -->
    <block v-if="isShowModal && target_user">
      <view class="modal">
        <view class="bg" @click="()=>isShowModal=false"></view>
        <view class="card z-depth-3">
          <view class="border"></view>
          <view class="content">
            <image mode="aspectFill" :src="target_user.avatarUrl" class="avatar" />
            <view>{{target_user.nickName}}</view>
            <view style="margin-bottom:30rpx;color:#673f22;font-size:12px;">快来帮我助力赢大奖</view>
            <button
              hover-class="none"
              class="btn"
              :open-type="user.role == 'noAuth' ? '' :( user.role == 'authUser' ? 'getPhoneNumber' :'')"
              @getphonenumber="getPhoneNumber"
              @click="toAssist"
            >
              <image
                mode="widthFix"
                :src="imgHOST+'/clock/助力.png'"
                style="display:block;width:100%;"
              />
            </button>
          </view>
        </view>
      </view>
    </block>
  </view>
</template>
<script>
const app = getApp();
const rpxRatio = uni.getSystemInfoSync()["screenWidth"] / 750;
import {
  imgHOST,
  Host,
  xhr,
  allowTypes,
  local,
  getUrlParam,
  shareContent
} from "@/common/util";
export default {
  data() {
    return {
      imgHOST,
      statusBarHeight: app.globalData.statusBarHeight,
      navigationHeight: app.globalData.navigationHeight,
      user: local.get("user"),
      isSignup: false,
      isShowModal: false,
      target_user: null,
      myPoints: 0,
      myAssist: [],
      topList: [],
      isShowShare: false,
      isShowSaveContainer: false,
      finishCanvas: false,
      canvasW: (900 / 2) * rpxRatio,
      canvasH: (1864 / 2) * rpxRatio,
      canvasScale: 3,
      loadImgs: {
        bg: imgHOST + "/clock/share-post.jpg",
        avatarUrl: local.get("user").avatarUrl,
        qr: ""
      },
      tempImgs: {}
    };
  },
  methods: {
    checkUser() {
      let url = "/user/",
        data = {};
      xhr.get(url, data, res => {
        if (String(res.statusCode)[0] == 2) {
          local.set("user", res.data);
          this.user = res.data;
        }
      });
    },
    getPhoneNumber(e) {
      console.log("getPhoneNumber");
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
    },
    checkSignup() {
      let url = "/assistprom/signup",
        data = {};
      xhr.get(url, data, res => {
        if (res.statusCode == 200) {
          this.isSignup = res.data;
        }
      });
    },
    signup() {
      if (!this.user) {
        return uni.navigateTo({
          url: "/pages/my/auth/login"
        });
      }
      if (this.user && this.user.role === "noAuth") {
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
      }
      if (this.user && this.user.role !== "telUser") {
        return false;
      }
      let url = "/assistprom/signup",
        data = {};
      uni.showLoading();
      xhr.post(url, data, res => {
        uni.hideLoading();
        this.checkSignup();
        if (res.statusCode == 200) {
          this.isSignup = true;
        }
      });
    },
    toInvite() {
      if (this.user.role != "telUser") {
        return false;
      }
      if (!this.isSignup) {
        return uni.showToast({
          title: "请先报名哦~",
          icon: "none"
        });
      }
      this.isShowShare = true;
      uni.$on("chooseActionSheet", data => {
        if (data.index == "save") {
          if (!this.finishCanvas) {
            this.getSaveImgPath();
          }

          this.showSaveContainer();
        }
        this.isShowShare = false;
      });
    },
    toAssist() {
      if (!this.user) {
        return uni.navigateTo({
          url: "/pages/my/auth/login"
        });
      }
      if (this.user && this.user.role === "noAuth") {
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
      }
      if (this.user && this.user.role !== "telUser") {
        return false;
      }
      let url = "/assistprom/assist",
        data = {
          target_user: this.target_user.userId
        };
      console.log(data);
      uni.showLoading();
      xhr.post(url, data, res => {
        uni.hideLoading();
        console.log(res);
        if (res.statusCode == 200) {
          this.isShowModal = false;
          uni.showToast({
            title: "助力成功"
          });
        }
      });
    },
    getMyAssist() {
      let url = "/assistprom/myassist",
        data = {};
      xhr.get(url, data, res => {
        if (res.statusCode == 200) {
          this.myAssist = res.data;
        }
      });
    },
    getTopList() {
      let url = "/assistprom/toplist",
        data = {};
      xhr.get(url, data, res => {
        if (res.statusCode == 200) {
          this.topList = res.data;

          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].user.id === this.user.id) {
              this.myPoints = res.data[i].total_point;
              break;
            }
          }
        }
      });
    },
    getUserById(userId) {
      let url = "/user/",
        data = {
          user: userId
        };
      xhr.post(url, data, res => {
        console.log(res);
        if (res.statusCode == 200) {
          this.isShowModal = true;
          this.target_user = {
            userId: res.data.id,
            nickName: res.data.nickName,
            avatarUrl: res.data.avatarUrl
          };
        }
      });
    },
    getSaveImgPath() {
      let _this = this;
      let getQr = new Promise(function(resolve, reject) {
        let url = Host + "/tools/qrgen",
          data = {
            scene: `userId=${_this.user.id}`,
            page: "pages/clock/clock"
          };

        xhr.post(url, data, res => {
          if (res.statusCode == 200) {
            let fsm = uni.getFileSystemManager();
            let filePath = wx.env.USER_DATA_PATH + "/" + Date.now() + ".jpg";
            fsm.writeFile({
              filePath,
              data: res.data,
              encoding: "base64",
              success: res => {
                _this.loadImgs.qr = filePath;
                resolve(filePath);
              },
              fail: err => {
                console.error(err);
                reject(res);
              }
            });
          } else {
            reject(res);
          }
        });
      });
      this.loadImgs.avatarUrl = this.user.avatarUrl || imgHOST + "/logo.jpg";

      function getTempImgs() {
        let tempImgs = {},
          keys = [],
          promiseFn = [];
        for (let k in _this.loadImgs) {
          keys.push(k);
          let fn = new Promise(function(resolve, reject) {
            uni.getImageInfo({
              src: _this.loadImgs[k],
              success(res) {
                resolve(res);
              },
              fail(err) {
                console.log(_this.loadImgs[k]);
                reject(err);
              }
            });
          });
          promiseFn.push(fn);
        }
        Promise.all(promiseFn)
          .then(res => {
            res.map((val, index) => {
              tempImgs[keys[index]] = val;
            });

            _this.tempImgs = tempImgs;
            _this.drawCanvas();
            _this.drawCanvas("save-card", _this.canvasScale);
          })
          .catch(err => {
            console.error(err);
          });
      }

      getQr
        .then(res => {
          getTempImgs();
        })
        .catch(err => {
          console.log(err);
          _this.failLoadQr = true;
          getTempImgs();
        });
    },
    drawCanvas(canvas, scale) {
      canvas = canvas ? canvas : "show-card";
      scale = scale ? scale : 1;
      let ctx = uni.createCanvasContext(canvas);
      // bg
      ctx.drawImage(
        this.tempImgs.bg.path,
        0,
        0,
        this.canvasW * scale,
        this.canvasH * scale
      );

      //avatarUrl
      var r = 38 * rpxRatio * scale,
        R = 4 * rpxRatio * scale + r,
        x = 110 * rpxRatio * scale,
        y = 245 * rpxRatio * scale;

      ctx.setFillStyle("#fff");
      ctx.arc(x, y, R, 0, 2 * Math.PI);
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(this.tempImgs.avatarUrl.path, x - r, y - r, r * 2, r * 2);
      ctx.restore();

      //txt

      var padding = 164 * rpxRatio * scale,
        x = padding,
        y = y - 16 * scale;

      ctx.setTextAlign("left");
      ctx.setFillStyle("#fceee1");
      ctx.setFontSize(14 * scale);
      var txt1 = this.user.nickName;
      if (txt1.length > 8) {
        txt1 = txt1.substr(0, 8) + "...";
      }
      ctx.fillText(txt1, x, y);
      ctx.setFillStyle("#FF5E41");
      ctx.setFontSize(14 * scale);

      //qr
      var w = 90 * rpxRatio * scale,
        x = (this.canvasW / 2) * scale - w / 2,
        y = this.canvasH * scale - 56 * rpxRatio * scale - w;
      ctx.drawImage(this.tempImgs.qr.path, x, y, w, w);

      ctx.draw(true);
      if (canvas == "save-card") {
        this.finishCanvas = true;
        uni.hideLoading();
      }
    },
    showSaveContainer() {
      this.isShowSaveContainer = true;
      if (!this.finishCanvas) {
        uni.showLoading();
      } else {
        uni.hideLoading();
      }
    },
    closeSaveContainer() {
      this.isShowSaveContainer = false;
      uni.hideLoading();
    },
    saveImg() {
      let _this = this;
      if (!this.finishCanvas) {
        return uni.showToast({
          title: "生成中",
          icon: "none"
        });
      }
      uni.showLoading();
      uni.canvasToTempFilePath({
        canvasId: "save-card",
        success: res => {
          this.saveImgPath = res.tempFilePath;
          uni.saveImageToPhotosAlbum({
            filePath: this.saveImgPath,
            success: res => {
              console.log(res);
              uni.showToast({
                title: "保存成功"
              });
            },
            fail: err => {
              console.log(err);
              if (
                err.errMsg == "saveImageToPhotosAlbum:fail auth deny" ||
                err.errMsg ==
                  "saveImageToPhotosAlbum:fail authorize no response"
              ) {
                uni.showToast({
                  title: "获取授权保存图片",
                  icon: "none"
                });
                setTimeout(function() {
                  uni.navigateTo({
                    url: "/pages/my/auth/auth?scope=writePhotosAlbum"
                  });
                }, 1300);
              }
            },
            complete: res => {
              uni.hideLoading();
              this.closeSaveContainer();
            }
          });
        }
      });
    }
  },
  mounted() {},
  onLoad(options) {
    if (options.scene) {
      let scene = getUrlParam(
        decodeURIComponent(options.scene).replace(/^\?/, "")
      );
      options = scene;
    }
    this.checkUser();
    this.checkSignup();
    this.getMyAssist();
    this.getTopList();
    if (options.userId && options.userId != this.user.id) {
      this.getUserById(options.userId);
    }

    this.getSaveImgPath();
  },
  onShow() {
    this.user = local.get("user");
  },
  onShareAppMessage(res) {
    //res.from
    let path = `/pages/clock/clock?userId=${this.user.id}`;
    console.log(path);
    return {
      title: shareContent.title,
      imageUrl: this.imgHOST + "/clock/share.jpg",
      path
    };
  },

  onShareTimeline(res) {
    //res.from
    let path = `/pages/clock/clock?userId=${this.user.id}`;
    return {
      title: shareContent.title,
      path,
      imageUrl: this.imgHOST + "/clock/share.jpg"
    };
  }
};
</script>
<style lang="scss" scoped>
.container {
  padding: 0 40rpx 50rpx;
  background: linear-gradient(#dd3e5e, #da3443);
  .card {
    position: relative;
    margin-bottom: 50rpx;
    padding: 40rpx;
    border-radius: 24rpx;
    background: linear-gradient(to right, #fffffe, #fceee1);
    .border {
      position: absolute;
      margin: auto;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: calc(100% - 80rpx);
      height: calc(100% - 80rpx);
      border-style: solid;
      border-width: 20rpx;
      border-image: url($imgHOST+"/clock/border.png") 30 30 round;
      background: url($imgHOST+"/clock/fireworks.png") top center no-repeat;
      background-size: 100%;
    }
  }
}
.rank {
  margin: 10rpx 30rpx;
  &.me {
    background: #fceee1;
  }
  .medal {
    flex-shrink: 0;
    width: 20rpx;
    image {
      width: 100%;
    }
  }
  .avatar {
    flex-shrink: 0;
    margin: 10rpx 12rpx 10rpx 18rpx;
    width: 50rpx;
    height: 50rpx;
    border-radius: 100%;
  }
  .nickName {
    flex-shrink: 0;
    width: 220rpx;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    color: #909399;
  }
  .integral {
    font-size: 12px;
    color: #da3443;
  }
}
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 999;
  top: 0;
  width: 100%;
  height: 100%;
  .bg {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(30, 30, 30, 0.6);
  }
  .card {
    position: relative;
    width: 80%;
    padding: 50rpx;
    box-sizing: border-box;
    background: #fff;
    border-radius: 24rpx;
    background: linear-gradient(to right, #fffffe, #fceee1);
    text-align: center;
    .border {
      position: absolute;
      margin: auto;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: calc(100% - 80rpx);
      height: calc(100% - 80rpx);
      border-style: solid;
      border-width: 20rpx;
      border-image: url($imgHOST+"/clock/border.png") 30 30 round;
      background: url($imgHOST+"/clock/fireworks.png") top center no-repeat;
      background-size: 100%;
    }
    .content {
      position: relative;
      z-index: 999;
      .avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 100%;
      }
      .btn {
        width: 90%;
      }
    }
  }
}
.assist_by {
  display: flex;
  align-items: center;
  overflow: auto;
  margin-bottom: 30rpx;
  padding: 20rpx 30rpx;
  .user {
    flex-shrink: 0;
    position: relative;
    width: 100rpx;
    height: 100rpx;
    .avatar {
      width: 100%;
      height: 100%;
      border-radius: 100%;
    }
    .nickName {
      position: absolute;
      margin: auto;
      padding: 4rpx;
      left: 0;
      right: 0;
      bottom: 0;
      width: 60rpx;
      border-radius: 6rpx;
      background: #c3defb;
      color: #3277d1;
      font-size: 8px;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
.save-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 0;
  width: 100%;
  overflow: auto;
  transform: translateX(100%);
  transition: 0.1s;
  &.on {
    transform: translateX(0);
  }
  .bg {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-color: rgba(30, 30, 30, 0.5);
  }

  .show-card {
    position: relative;
    margin: 54rpx auto 30rpx;
  }
  .save-card {
    position: absolute;
    opacity: 0;
    transform: translate(-1000%, -1000%);
  }
  .btn {
    position: relative;
    margin: auto;
    width: 556rpx;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    color: #fff;
    background: linear-gradient(#dd3e5e, #da3443);
    border-radius: 44rpx;
  }
}
</style>