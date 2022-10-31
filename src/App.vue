<script>
import { imgHOST,  Host, xhr, allowTypes, local, request } from "@/common/util";
export default {
  onLaunch(options) {
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
  onShow() {
    console.log("App Show");
    this.login();
    // this.reShowPost();
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
    // if(uni.canIUse('getUpdateManager')) {
    //   const updateManager = wx.getUpdateManager();
    //   if (updateManager) {
    //     updateManager.onCheckForUpdate(function (res) {
    //       if (res.hasUpdate) {
              
    //       }
    //     })
    //   }
    // }
  },
  onHide() {
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
    screenHeight: uni.getSystemInfoSync().screenHeigh,
    checkAdLevel: true
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

                  // if(res.data.user.role == "telUser" && res.data.user.telephone){
                  //   console.log("授权手机用户注册积分商城");
                    // 积分商城登录注册
                    // this.addUserInfo();
                  // }
                }
              });
            },
            fail: err => {
              console.error(err);
            },
            //  积分任务次控            
            complete: res => {
              // 本地日期，一天一次 针对开屏
              let newJson = local.get("newJson") ? local.get("newJson") : {};
              if(new Date(local.get("newJson").spread).getDate() != new Date().getDate()){
                this.globalData.checkAdLevel = true;
                
                // 每日重置次数
                // let initDataTask = {
                //   seeIndex: 0,
                //   seeDetail: 0,
                //   shareDetail: 0
                // }
                // local.set("initDataTask",initDataTask)

                // // 登陆积分
                // setTimeout(()=>{
                //   let nowToken = local.get("integral_token")
                //   let dailyTask = local.get("dailyTask")
                //   let newUserTask = local.get("newUserTask")
                //   if(nowToken && dailyTask && newUserTask){
                //     this.emitLoginTask()
                //     this.emitOnceLoginTask()
                //     this.emitOncePhTask()
                //   }
                // },3000);
              }
            }
          });
        }
      });
    },

    /*
    // 积分商城注册
    addUserInfo(){
      let user = local.get('user')
      if(user && user.telephone){
        let url = "/mall-portal/sso/register",
        data = {
          "gender": 0,
          "icon": user.avatarUrl,
          "nickName": user.nickName,
          "password": user.telephone,
          "phone": user.telephone,
          "sourceType": 3,
          "unionid": user.unionId,
          "username": user.telephone
        }
        console.log("data",data);
        request.post( url,data, res=> {
          if(res.code == 200 || res.code == 500 ){
            console.log("用户登录积分商城",res.code);
            this.toLoginInfo()
          }
        })
      }
    },
    getTaskList(){
      let url = "/mall-portal/member/task/queryMemberTaskParamList",
				data = {
					"pageNum": 1,
					"pageSize": 20,
					"platformType": 2
				},
        newUserTask = [],
        dailyTask = [];
			request.get(url,data, res => {
				if(res.code == 200){
					let list = res.data.data.list
					list.map((val,index) => {
						if(val.taskType == 0){
							newUserTask.push(val)
						} else {
							dailyTask.push(val)
						}
					})
          local.set("newUserTask",newUserTask)
          local.set("dailyTask",dailyTask)
				}
			})
    },
    // 积分token
    toLoginInfo(){
      let url = "/mall-portal/sso/login",
        user = local.get('user'),
        data = {
        "password": user.telephone,
        "sourceType": 2,
        "username": user.telephone
      }
      request.post(url,data, res => {
        if(res.code == 200 ){
          local.set("integral_token", res.data.data.token)
          // 任务列表
          this.getTaskList()
        }
      })
    },
    // 首次登陆
    emitOnceLoginTask(){
      let newUserTask = local.get("newUserTask"),
        taskId = "";
        newUserTask.map((val,index) => {
        if(val.name == "首次登录"){
          taskId = val.id
        }
      })
      let url = "/mall-portal/member/task/add",
        data = {
          "changeCount": 10,
          "changeType": 0,
          "platformType": 2,
          "umsMemberTaskId": taskId
      }
      request.post( url,data, res => {
        if(res.code == 200 ){
          console.log("首次登录任务  10");
        }
        else if(res.code == 500){
          console.log("首次登陆任务已完成 10");
        }
      })
    },
    emitOncePhTask(){
      let newUserTask = local.get("newUserTask"),
        taskId = "";
        newUserTask.map((val,index) => {
        if(val.name == "授权手机号"){
          taskId = val.id
        }
      })
      let url = "/mall-portal/member/task/add",
        data = {
          "changeCount": 30,
          "changeType": 0,
          "platformType": 2,
          "umsMemberTaskId": taskId
      }
      request.post( url,data, res => {
        if(res.code == 200 ){
          console.log("首次授权给积分30");
        }
        else if(res.code == 500){
          console.log("首次授权已完成 30");
        }
      })
    }, */
    // reShowPost() {
    //   let initData = local.get("initData") || {};
    //   if (initData.post) {
    //     delete initData.post;
    //   }
    //   local.set("initData", initData);
    // },

    // emitLoginTask(){
    //   let dailyTask = local.get("dailyTask"),
    //     taskId = "";
    //   dailyTask.map((val,index) => {
    //     if(val.name == "签到"){
    //       taskId = val.id
    //     }
    //   })
    //   let url = "/mall-portal/member/task/add",
    //     data = {
    //       "changeCount": 5,
    //       "changeType": 0,
    //       "platformType": 2,
    //       "umsMemberTaskId": taskId
    //   }
    //   request.post( url,data, res => {
    //     if(res.code == 200 ){
    //       console.log("每日签到OK 5");
    //     }
    //     else if(res.code == 500){
    //       console.log("登录任务已完成 5");
    //     }
    //   })
    // },

    checkAdLevel(ad_level) {
      //ifdef MP-WEIXIN
      // 在页面中定义激励视频广告
      let videoAd = null;
      // 在页面onLoad回调事件中创建激励视频广告实例

      //  6-15在ios上无关闭按钮
      let adUnitIds = [
        // "adunit-32950bbef680ebe7", //1      
        "adunit-648833bca5563ffc", //2   
        "adunit-194d12144ff78aa4" //3
      ];

      if (this.globalData.checkAdLevel == false) {
        videoAd = wx.createRewardedVideoAd({
          // adUnitId: ad_level < 3 ? adUnitIds[ad_level - 1] : adUnitIds[2]
          adUnitId: ad_level < 3 ? adUnitIds[0] : adUnitIds[1]
        });
        console.log("videoAd=>>>>>",videoAd);
        videoAd.onLoad(() => {});
        videoAd.onError(err => {});
        videoAd.onClose(res => {
          videoAd.offClose()
          if (res.isEnded) {

          } else {
            uni.showModal({
              title: "提示",
              content: "看完一则广告，即可开启免费领取好物之旅",
              showCancel: false,
              success: res => {
                if (res.confirm) {
                  this.checkAdLevel(ad_level);
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
  box-sizing: border-box;
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
