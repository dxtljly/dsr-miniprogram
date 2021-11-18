<script>
import { imgHOST, Host, xhr, allowTypes, local } from "@/common/util";
export default {
  onLaunch: function(options) {
    if (
      [1047, 1048, 1049].indexOf(options.scene) >= 0 &&
      options.path == "pages/school/index"
    ) {
      let newJson = { ...local.get("newJson") };
      newJson.isFinishSchoolCourse = true;
      local.set("newJson", newJson);
    }
    console.log("App Launch");

    uni.hideTabBar();
  },
  onShow: function() {
    console.log("App Show");
    this.login();
    uni.setStorageSync("isShowGifModal", true);
    const updateManager = uni.getUpdateManager();
    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function(res) {
          updateManager.applyUpdate();
        });
        updateManager.onUpdateFailed(function(res) {
          // 新的版本下载失败
        });
      }
    });
  },
  onHide: function() {
    console.log("App Hide");
  },
  globalData: {
    userInfo: null,
    statusBarHeight: uni.getSystemInfoSync()["statusBarHeight"],
    navigationHeight: uni
      .getSystemInfoSync()
      .system.toLowerCase()
      .match("ios")
      ? 44
      : 48,
    screenWidth: uni.getSystemInfoSync().screenWidth,
    screenHeight: uni.getSystemInfoSync().screenHeight
  },
  methods: {
    login() {
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
                  this.$mp.app.aldstat.sendOpenid(res.data.user.openId);

                  if (res.data.user.ad_level > 0) {
                    this.globalData.checkAdLevel = false;
                    this.checkAdLevel(res.data.user.ad_level);
                  }
                }
              });
            },
            fail: err => {
              console.error(err);
            }
          });
        }
      });
    },
    checkAdLevel(ad_level) {
      //ifdef MP-WEIXIN
      // 在页面中定义激励视频广告
      let videoAd = null;

      // 在页面onLoad回调事件中创建激励视频广告实例
      let adUnitIds = [
        "adunit-67e4ed428ea10518", //1
        "adunit-648833bca5563ffc", //2
        "adunit-194d12144ff78aa4" //3
      ];
      if (wx.createRewardedVideoAd) {
        videoAd = wx.createRewardedVideoAd({
          adUnitId: ad_level < 3 ? adUnitIds[ad_level - 1] : adUnitIds[2]
        });
        videoAd.onLoad(() => {});
        videoAd.onError(err => {});
        videoAd.onClose(res => {
          if (res.isEnded) {
            this.globalData.checkAdLevel = true;
          } else {
            uni.showModal({
              title: "提示",
              content: "看完一则广告，即可开启免费领取好物之旅",
              showCancel: false,
              success: res => {
                if (this.globalData.checkAdLevel == false) {
                  this.checkAdLevel(ad_level);
                }

                if (res.confirm) {
                  console.log("用户点击确定");
                } else if (res.cancel) {
                  console.log("用户点击取消");
                }
              }
            });
          }
        });
      }

      // 用户触发广告后，显示激励视频广告
      if (videoAd) {
        videoAd.show().catch(() => {
          // 失败重试
          videoAd
            .load()
            .then(() => videoAd.show())
            .catch(err => {
              console.log("激励视频 广告显示失败");
            });
        });
      }
      //endif
    }
  }
};
</script>

<style lang="scss">
/*每个页面公共css */
page {
  background-color: $backBG-color;
  color: #333;
  height: 100%;
  font-size: 32rpx;
  user-select: text;
}
// Z-levels
.z-depth-0 {
  box-shadow: none !important;
}

/* 2dp elevation modified*/
$z-depth-shadow1: rgba(0, 0, 0, 0.04);
$z-depth-shadow2: rgba(0, 0, 0, 0.02);
$z-depth-shadow3: rgba(0, 0, 0, 0.08);
.z-depth-1 {
  box-shadow: 0 2px 2px 0 $z-depth-shadow1, 0 3px 1px -2px $z-depth-shadow2,
    0 1px 2px 0 $z-depth-shadow3;
}
.z-depth-1-half {
  box-shadow: 0 3px 3px 0 $z-depth-shadow1, 0 1px 7px 0 $z-depth-shadow2,
    0 3px 1px -1px $z-depth-shadow3;
}

/* 6dp elevation modified*/
.z-depth-2 {
  box-shadow: 0 4px 5px 0 $z-depth-shadow1, 0 1px 10px 0 $z-depth-shadow2,
    0 2px 4px -1px $z-depth-shadow3;
}

/* 12dp elevation modified*/
.z-depth-3 {
  box-shadow: 0 8px 17px 2px $z-depth-shadow1, 0 3px 14px 2px $z-depth-shadow2,
    0 5px 5px -3px $z-depth-shadow3;
}

/* 16dp elevation */
.z-depth-4 {
  box-shadow: 0 16px 24px 2px $z-depth-shadow1, 0 6px 30px 5px $z-depth-shadow2,
    0 8px 10px -7px $z-depth-shadow3;
}

/* 24dp elevation */
.z-depth-5 {
  box-shadow: 0 24px 38px 3px $z-depth-shadow1, 0 9px 46px 8px $z-depth-shadow2,
    0 11px 15px -7px $z-depth-shadow3;
}

.hoverable {
  transition: box-shadow 0.25s;

  &:hover {
    box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2),
      0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
}

/* --- flex --- */

.flx {
  display: flex !important;
  /*用于解决浮动*/
}

.fx1 {
  flex-grow: 1;
}

.shrink0 {
  flex-shrink: 0;
  /*不被压缩空间*/
}

.fx-column {
  flex-direction: column;
}

.fx-justify {
  justify-content: space-between;
}
.fx-around {
  justify-content: space-around;
}

.fx-center {
  justify-content: center;
}

.fx-middle {
  display: inline-flex;
  align-items: center;
}
.fx-bot {
  align-items: flex-end;
}

.fx-end {
  justify-content: flex-end;
}

.fx-wrap {
  flex-wrap: wrap;
}

/* === flex === */

/* --- font color --- */
.fcmain {
  color: $main-color;
}
.fcmain-1 {
  color: $main-color-1;
}
.fcbbb {
  color: #bbb;
}
.fcschool {
  color: $school-main-color;
}
/* === font color === */
.fbold {
  font-weight: bold;
}

.place-holder {
  color: #dfdfdf;
}

/* --- text --- */
.tx-middle {
  vertical-align: middle;
}
$text-align-list: left, right, center, justify;
@each $item in $text-align-list {
  .tx-#{$item} {
    text-align: $item;
  }
}

$white-space: normal, pre, nowrap, pre-wrap, pre-line;
@each $item in $white-space {
  .#{$item} {
    white-space: $item;
  }
}
/* === text=== */
button {
  padding: 0;
  line-height: normal;
  background: transparent;
  border-radius: 0;
  color: #333;
  border: none;
  box-shadow: none;

  &::before,
  &::after {
    border: none;
    box-shadow: none;
  }

  &::active {
    background: transparent;
  }
}
</style>
