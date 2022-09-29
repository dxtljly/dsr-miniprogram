<template>
  <view class="bg">
    <gl-navbar back home :titleImg="imgHOST+'/icon/毕业季-title.png'"></gl-navbar>
    <image mode="widthFix" :src="imgHOST+'/invite-school/header-bg.png'" class="header" />
    <view class="rule-container">
      <image mode="widthFix" :src="imgHOST+'/invite-school/title-活动规则.png'" class="title" />
      <view class="txt">邀请好友上架物品，在规定时间内达到不同等级的指定人数，就可领取多重好礼哦！奖品多多，等你来拿~</view>
      <view class="invite-content">
        <view class="title-h">当前成功邀请{{inviteNo}}位好友</view>
        <view class="number-line">
          <view class="line">
            <view class="line-on" :style="'width:'+invitePercent"></view>
          </view>
          <view class="li" :class="{'on':inviteNo >=1 }">
            <view class="point">1</view>
            <view class="txt-num">邀请1人</view>
          </view>
          <view class="li" :class="{'on':inviteNo >=3 }">
            <view class="point">3</view>
            <view class="txt-num">邀请3人</view>
          </view>
          <view class="li" :class="{'on':inviteNo >=6 }">
            <view class="point">6</view>
            <view class="txt-num">邀请6人</view>
          </view>
          <view class="li" :class="{'on':inviteNo >=8 }">
            <view class="point">8</view>
            <view class="txt-num">邀请8人</view>
          </view>
        </view>
      </view>
    </view>
    <view class="invite-btns">


      <button @click="showShare" class="btn share z-depth-1">邀请好友上架闲置物品</button>
      <!-- <button open-type="share" class="btn share z-depth-1">邀请好友上架闲置物品</button> -->
  


      <block v-if="config.school[0].tobtn">
        <view
          @click="toAdd"
          class="btn add z-depth-1"
        >去断舍哩上架闲置物品</view>
        <image
          mode="widthFix"
          :src="imgHOST+'/invite-school/content-bg.png'"
          style="width:100%;height:0;margin-top:-160rpx;"
        />
      </block>
    </view>
    <image mode="widthFix" :src="imgHOST+'/invite-school/title-奖品领取.png'" class="title" />
    <view class="award-container">
      <block v-for="(award,index) in awardList" :key="index">
        <view class="award-step">
          <image
            mode="widthFix"
            :src="imgHOST+'/invite-school/'+['第一档','第二档','第三档'][index]+'.png'"
            class="step"
          />
          <view class="title-num">成功邀请到{{award.num}}人上架闲置物品</view>
          <view class="award-content">
            <block v-for="(item,i) in award.awards" :key="i">
              <view class="li">
                <image mode="aspectFill" :src="item.img" />
                <view class="price">价值：{{item.price}}元</view>
                <view class="name">{{item.name}}</view>
                <view
                  class="btn"
                  :class="{'on':inviteNo >= award.num}"
                  @click="submitAward(award.num,item)"
                >领取</view>
              </view>
            </block>
          </view>
          <navigator
            v-if="index == awardList.length -1"
            hover-class="none"
            url="/pages/school/award"
            style="color:#FFBD57;font-size:12px;text-decoration:underline;text-align:center;"
          >查看领奖记录 >></navigator>
        </view>
      </block>
    </view>
    <view style="height:180rpx;"></view>
    <image mode="widthFix" :src="imgHOST+'/invite-school/title-温馨提示.png'" class="title" />
    <view
      style="padding-bottom:100rpx;background-size: 100%;background-repeat: no-repeat;background-position: bottom;"
      :style="'background-image:url('+imgHOST+'/invite-school/footer.png);'"
    >
      <view class="tips-container">
        <view>1、邀请的好友仅限新用户；</view>
        <view>2、一个邀请周期为14天，在周期内达到相应档次的邀请人数，就可以在相应档次或上一档次的奖品中，任选一个领取；</view>
        <view
          style="color:#FFBD57;"
        >举个栗子：小哩邀请了7位好友在断舍哩上架闲置物品，此时ta可以在第一级和第二级的共三件奖品中任选一件领取，也可以等凑满8个好友后，在5件奖品中任选一件。</view>
        <view>3、用户可在每个邀请周期完成后，重复参加活动，多次领取奖品；</view>
        <view>4、上架的物品会由工作人员进行审核是否符合上架要求，符合要求的才会计入成功邀请人数，审核时限为24小时；</view>
        <view>5、如发现恶意刷单或其他违规行为，将取消领奖资格；</view>
        <view>6、本活动最终解释权归上海复士网络科技有限公司所有。</view>
      </view>
    </view>

    <!-- wechat modal -->
    <view class="wechat-modal" :class="{'on':isShowWechat}" @click="()=>this.isShowWechat = false">
      <image
        mode="widthFix"
        :src="imgHOST+'/invite-school/wechat.png'"
        class="z-depth-1"
        @click.stop="copyWechat"
      />
    </view>

    <view
      class="save-container"
      :class="{'on':isShowSaveContainer}"
      :style="'height:calc(100% - ' +(statusBarHeight+navigationHeight)+ 'px);'"
    >
      <view
        class="bg"
        :style="'background-image:url(' + imgHOST + '/detail/bg-school.png);'"
        @click="closeSaveContainer"
      ></view>

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

      <view class="btn school" @click="saveImg">保存图片分享</view>
    </view>
    <action-sheet :isSchool="isSchool" share :on="isShowShare"></action-sheet>
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
      animationDataTab: {},
      inviteNo: 0,
      awardList: [
        {
          num: 3,
          awards: [
            {
              img: imgHOST + "/invite-school/awards/1.png",
              price: 25,
              name: "美团或哈罗单车月卡"
            }
          ]
        },
        {
          num: 6,
          awards: [
            {
              img: imgHOST + "/invite-school/awards/2.png",
              price: 45,
              name: "饿了么季卡"
            },
            {
              img: imgHOST + "/invite-school/awards/3.png",
              price: 49,
              name: "咕哩环保袋"
            }
          ]
        },
        {
          num: 8,
          awards: [
            {
              img: imgHOST + "/invite-school/awards/4.png",
              price: 88,
              name: "游戏皮肤（王者荣耀）"
            },
            {
              img: imgHOST + "/invite-school/awards/5.png",
              price: 88,
              name: "网易云音乐 黑胶VIP:6个月"
            },
            {
              img: imgHOST + "/invite-school/awards/6.png",
              price: 78,
              name: "腾讯视频VIP/爱奇艺黄金VIP/优酷VIP (三选一)"
            }
          ]
        }
      ],
      isShowWechat: false,
      user: local.get("user"),
      config:{},
      isShowShare: false,
      isShowSaveContainer: false,
      canvasW: 649 * rpxRatio,
      canvasH: 980 * rpxRatio,
      canvasScale: 3,
      isSchool: true,
      finishCanvas: false,
      loadImgs: {
        bg: imgHOST + "/detail/share-bg-school.png",
        content: imgHOST + "/detail/share-content-bg.png",
        avatarUrl: local.get("user").avatarUrl,
        qr: imgHOST + "/qr.jpg"
      },
      tempImgs: {},
      saveImgPath: null
    };
  },
  methods: {
    getConfig() {
      let url =
          "https://www.grecycle.com.cn/src/sli/config/sli-certification-config.json",
        data = {};
      xhr.get(url, data, res => {
        if (res.statusCode == 200) {
          this.config = res.data;
        }
      });
    },
    toAdd() {
      console.log(this.user,"this.user");
      console.log(this.user.is_student,"this.user.is_student");
      if (this.user && this.user.is_student) {
        uni.navigateTo({
           url: "/pages/goods/add/add?school=1"
        });
      } else {
        this.checkApply();
      }
    },
    checkApply() {
      let url = "/campus_admin/student_application_status",
        data = {};
      xhr.get(url, data, res => {
        if (res.statusCode == 200) {
          if (res.data.status == 1) {
            uni.showModal({
              title: "已提交",
              content: "已提交！请耐心等待工作人员进行认证！",
              showCancel: false,
              confirmText: "好哩",
              complete: res => {}
            });
          } else if (res.data.status == 2) {
            console.log("res.data.status == 2");
          } else {
            uni.showModal({
              title: "发布需求",
              content: "为确保交易的真实性，需要您先进行认证哦~",
              cancelText: "稍后再说",
              cancelColor: "#bbb",
              confirmText: "前往认证",
              complete: res => {
                if (res.confirm) {
                  uni.navigateTo({
                    url: "/pages/spa/index/index?=1"
                  });
                }
              }
            });
          }
        }
      });
    },
    getUserInfo() {
      let url = "/user/",
        data = {};
      xhr.get(url, data, res => {
        console.log(res);
        if (String(res.statusCode)[0] == 2) {
          local.set("user", res.data);
          this.inviteNo = local.get("user").campus_ref_count;
        }
      });
    },
    getInviteNo() {
      let inviteNo = local.get("user").campus_ref_count;

      let clock = setInterval(() => {
        if (this.inviteNo < inviteNo) {
          this.inviteNo++;
        } else {
          clearInterval(clock);
        }
      }, 50);
    },
    submitAward(num, item) {
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
      if (num > this.inviteNo) {
        return uni.showToast({
          title: "邀请人数不足",
          icon: "none"
        });
      }

      let url = "/campus_admin/apply",
        data = {
          name: JSON.stringify(item),
          point: num
        };

      xhr.post(url, data, res => {
        if (String(res.statusCode)[0] == 2) {
          this.isShowWechat = true;
          this.inviteNo -= num;
          this.getUserInfo();
        } else {
          uni.showToast({
            title: res.data.message ? res.data.message : "未知错误",
            icon: "none"
          });
        }
      });
    },
    copyWechat() {
      uni.setClipboardData({
        data: "salmonisaboy",
        success: res => {
          uni.showToast({
            title: "复制微信号成功"
          });
        }
      });
    },
    
    
    showShare() {
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
    getSaveImgPath(){
      let _this = this;
      let getQr = new Promise(function(resolve, reject) {
        let url = Host + "/tools/qrgen",
          data = {
            scene: `userId=${_this.user.id}`,
            page: "pages/school/invite"
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
      this.loadImgs.avatar = local.get("user").avatarUrl
        ? local.get("user").avatarUrl
        : imgHOST + "/logo.jpg";

      function getTempImgs() {
        let tempImgs = {},
          keys = [],
          promiseFn = [];
        console.log("_this.loadImgs",_this.loadImgs);
        for (let k in _this.loadImgs) {
          keys.push(k);
          let fn = new Promise(function(resolve, reject) {
            uni.getImageInfo({
              src: _this.loadImgs[k],
              success(res) {
                resolve(res);
              },
              fail(err) {
                console.log("_this.loadImgs[k]",_this.loadImgs[k]);
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
      console.log("scale",scale);
      let ctx = uni.createCanvasContext(canvas);
      // bg
      ctx.drawImage(
        this.tempImgs.bg.path,
        0,
        0,
        this.canvasW * scale,
        this.canvasH * scale
      );

      //content
      var x = 56 * rpxRatio * scale,
        y = 284 * rpxRatio * scale,
        bot = 56 * rpxRatio * scale;
      ctx.drawImage(
        this.tempImgs.content.path,
        x,
        y,
        this.canvasW * scale - x * 2,
        this.canvasH * scale - y - bot
      );

      //头像
      var r = 60 * rpxRatio * scale,
        R = 4 * rpxRatio * scale + r,
        y = 284 * rpxRatio * scale;

      ctx.setFillStyle("#fff");
      ctx.arc((this.canvasW * scale) / 2, y, R, 0, 2 * Math.PI);
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc((this.canvasW * scale) / 2, y, r, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(
        this.tempImgs.avatar.path,
        (this.canvasW * scale) / 2 - r,
        y - r,
        r * 2,
        r * 2
      );
      ctx.restore();

      //txt

      var padding = (56 + 80) * rpxRatio * scale,
        x = padding - 16,
        y = y + R + 50 * scale;

      var userTxt = this.user.nickName
      ctx.fillStyle = "#FF5E41"
      ctx.setFontSize(14 * scale);
      ctx.setTextAlign("center");
      ctx.fillText(userTxt, (this.canvasW / 2) * scale, (y - R))

      console.log("padding",padding);
      console.log("rpxRatio",rpxRatio);
      console.log("this.canvasW",this.canvasW);
      
      ctx.setTextAlign("left");
      ctx.setFontSize(14 * scale);
      ctx.fillStyle 
      ctx.fillStyle = "black"
      var txt1 = "我正在参加“断舍哩”邀好友活动",
        txt1W = ctx.measureText(txt1).width;
      console.log("txt1W",txt1W);
      ctx.fillText(txt1, x, y);

      ctx.setTextAlign("center");
      ctx.fillText(
        "快来上架闲置物品，帮我赢好礼！",
        (this.canvasW / 2) * scale,
        y + 25 * scale
      );

      //qr
      var x = padding,
        y = (374 + 160) * rpxRatio * scale,
        dW = this.canvasW * scale - padding * 2,
        dH = 348 * rpxRatio * scale

      ctx.drawImage(this.tempImgs.qr.path, x, y, dW, dH);


      ctx.setFillStyle("#333");
      ctx.setTextAlign("left");
      ctx.setFontSize(10 * scale);

      ctx.draw(true);
      if (canvas == "save-card") {
        this.finishCanvas = true;
        uni.hideLoading();
      }
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
    },
  },
  computed: {
    invitePercent() {
      let percent = 0;
      this.inviteNo = Number(this.inviteNo);
      if (this.inviteNo >= 1 && this.inviteNo < 5) {
        percent = (100 / 3 / 5) * this.inviteNo;
      } else if (this.inviteNo < 8) {
        percent = (100 / 3) * (1 + (1 / 3) * (this.inviteNo - 5));
      } else if (this.inviteNo >= 8) {
        percent = (100 / 3) * (2 + (1 / 2) * (this.inviteNo - 8));
      }

      percent = percent > 100 ? 100 : percent;

      return `${percent}%`;
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
    //  微信邀请 ||  二维码邀请
    if (options.inviterId || options.userId) {
      local.set("inviter", { id: options.inviterId || options.userId });
    }
  },
  onShow() {
    this.getInviteNo();
    this.getConfig();
  },
  onShareAppMessage(res) {
    //res.from
    let inviterId = local.get("user").id;
    return {
      title: "校园版块 - 让好物循环",
      imageUrl: shareContent.schoolImg,
      path: "/pages/school/invite?inviterId=" + inviterId
    };
  },
  onShareTimeline(res) {
    //res.from
    let inviterId = local.get("user").id;
    return {
      title: "校园版块 - 让好物循环",
      imageUrl: shareContent.schoolImg,
      path: "/pages/school/invite?inviterId=" + inviterId
    };
  }
};
</script>

<style lang="scss" scoped>
.bg {
  background-color: #769cfd;
}
.header {
  display: block;
  width: 100%;
}
image.title {
  position: relative;
  display: block;
  margin: 0 auto 30rpx;
  width: 300rpx;
  height: 10rpx;
}
.rule-container {
  margin: -300rpx 30rpx 0;
  padding: 50rpx;
  border: 2px solid #fff;
  border-radius: 20rpx;
  background-color: #5669f7;
  color: #fff;

  .txt {
    font-size: 14px;
    text-align: justify;
  }
  .invite-content {
    margin-top: 20rpx;
    padding: 30rpx 20rpx;
    background-color: #fff;
    border-radius: 20rpx;

    .title-h {
      font-size: 13px;
      color: #db9529;
      text-align: center;
    }
    .number-line {
      margin-top: 30rpx;
      position: relative;
      display: flex;
      justify-content: space-between;
      .line {
        position: absolute;
        width: calc(100% - 86rpx);
        height: 10rpx;
        top: 37rpx;
        left: 43rpx;
        background-color: #fff0d9;

        .line-on {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background-color: #ffbd57;
          border-radius: 10rpx;
          transition: 0.3s;
        }
      }
      .li {
        z-index: 9;
        text-align: center;
        .point {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 14px;
          margin: 20rpx;
          width: 46rpx;
          height: 46rpx;
          background-color: #ffdaa0;
          border-radius: 50%;
          transition: 0.3s;
        }
        .txt-num {
          font-size: 10px;
          color: #ffdaa0;
          transition: 0.3s;
        }

        &.on {
          .point {
            background-color: #ffbd57;
          }
          .txt-num {
            color: #db9529;
          }
        }
      }
    }
  }
}
.invite-btns {
  margin: 30rpx 0;
  .btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 30rpx;
    width: 600rpx;
    height: 100rpx;
    font-size: 18px;
    color: #fff;
    border-radius: 50rpx;
    &.share {
      background-color: #ffbd57;
    }
    &.add {
      background-color: #5669f7;
    }
  }
}
.award-container {
  margin: 0 30rpx;
  padding: 50rpx;
  border: 2px solid #fff;
  border-radius: 20rpx;
  background-color: #5669f7;
  color: #fff;
  .award-step {
    padding-bottom: 20rpx;
    image.step {
      display: block;
      margin: 0 auto 20rpx;
      width: 120rpx;
      height: 10rpx;
    }
    .title-num {
      text-align: center;
      font-size: 12px;
    }
    .award-content {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      margin: 20rpx 0 40rpx;
      .li {
        width: 254rpx;
        padding: 14rpx;
        box-sizing: border-box;
        text-align: center;
        background-color: #fff;
        border-radius: 10rpx;
        margin-bottom: 30rpx;
        image {
          width: 100%;
          height: 150rpx;
        }
        .price {
          margin-top: 20rpx;
          color: #5670f7;
        }
        .name {
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 10px;
          color: #333;
          margin-bottom: 20rpx;
        }
        .btn {
          position: relative;
          margin: auto;
          width: 200rpx;
          height: 44rpx;
          line-height: 44rpx;
          text-align: center;
          border-radius: 20rpx;
          background-color: #cbcbcb;
          color: #fff;
          font-size: 13px;
          transition: 0.3s;
          &.on {
            background-color: #ffbd57;
          }
        }
      }
    }
  }
}
.tips-container {
  margin: 0 30rpx;
  padding: 50rpx;
  border: 2px solid #fff;
  border-radius: 20rpx;
  background-color: #5669f7;
  color: #fff;
  font-size: 12px;
  text-align: justify;
  line-height: 1.6;
}

.wechat-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(30, 30, 30, 0.3);
  transform: translateX(100%);
  transition-delay: 0.2s;

  image {
    width: 60%;
    height: 0;
    border-radius: 20rpx;
    transform: translateX(100%);
    transition: 0.3s;
  }
  &.on {
    transform: translateX(0);
    transition-delay: 0s;
    image {
      transform: translateX(0);
    }
  }
}

.save-container {
  position: fixed;
  z-index: 9998;
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
    background-color: $main-color;
    border-radius: 44rpx;
    &.school {
      background-color: $school-main-color;
    }
  }
}
</style>
