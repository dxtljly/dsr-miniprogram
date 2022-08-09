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
      <button open-type="share" class="btn share z-depth-1">邀请好友上架闲置物品</button>
  <!-- 上线隐藏 -->
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
      config:{}
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
                    url: "/pages/spa/index/index"
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
    }
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
    if (options.inviterId) {
      local.set("inviter", { id: options.inviterId });
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
</style>
