<template>
  <view style="height:100%;overflow:auto;">
    <gl-navbar full text="我的" white textStyle="color:#fff;" bg="transparent"></gl-navbar>
    <view class="container">
      <view class="bg" :style="'background-image:url('+imgHOST+'/home/bg.png);'"></view>

      <!-- <view class="toLoveTab" @click="toLoveTab">
        爱心足迹
      </view> -->
      
      <view class="userInfo">
        <navigator hover-class="none" url="/pages/my/auth/login" class="userMsg">
          <view class="avatar">
            <image mode="widthFix" :src="user.avatarUrl ? user.avatarUrl : imgHOST+'/logo.jpg'" />
            <image class="icn" mode="aspectFit" :src="imgHOST + '/icon/emit.png'"></image>
          </view>
          <view class="userTxt">
            <view class="nickname">
              <span class="userName">{{user.nickName}}</span>
              <view class="lvImg">
                <image
                  :src="imgHOST + '/task/level' + memberLevelId + '.png'"
                  mode="widthFix"
                />
              </view>
            </view>
            <view class="userExp">
              <!-- <canvas canvas-id="userExps" id="userExps" style="width:150rpx; height:10rpx;"></canvas> -->
              <view class="userExps" :style="'width:'+( growth / growthPoint )*100+'%'"></view>
            </view>
          </view>
        </navigator>
      </view>

      <view class="showUserMsg  z-depth-3">
        <view class="infoLft" @click="toMysend">
          <view class="infoNum">{{publishNumber>99?'99+':publishNumber}}</view>
          <view class="infoTxt">在赠商品</view>
        </view>
        <view style="height: 80rpx;border-right: 1rpx solid #666;"></view>
        <view class="infoRht">
          <navigator url="" 
          hover-class="none" class="toPointMall" >
            <view class="integration">{{integration}}</view>
            <view class="infoTxt">我的哩豆</view>
          </navigator>
        </view>
      </view>

    </view>
    <!-- <navigator
      hover-class="none"
      target="miniProgram"
      open-type="navigate"
      app-id="wxebadf544ddae62cb"
      path="pages/survey/index?sid=6850669&hash=771a"
    >
      <image
        mode="widthFix"
        :src="imgHOST+'/home/有奖小调查.jpg'"
        style="width:100%;height:0;margin-top:-20rpx;margin-bottom:20rpx;"
      />
    </navigator>-->

<!-- 布告栏 -->
    <!-- <block v-if="config &&  config.banner && config.banner.length">
      <swiper
        class="banner"
        autoplay
        :indicator-dots="config.banner.length>1"
        circular
        :interval="4000"
      >
        <block v-for="(item,index) in config.banner" :key="index">
          <swiper-item>
            <block v-if="item.url || item.path">
              <navigator
                hover-class="none"
                :target="item.target || 'self'"
                :url="item.url"
                :open-type="item.openType || 'redirect'"
                :app-id="item.appId"
                :path="item.path"
              >
                <image mode="aspectFill" :src="item.img" />
              </navigator>
            </block>
            <block v-else>
              <image mode="aspectFill" :src="item.img" />
            </block>
          </swiper-item>  
        </block>
      </swiper>
    </block> -->

  <!-- 签到打卡 -->
    <block v-if="showTip">
      <navigator hover-class="none" url="/pages/clock/clock">
        <image
          mode="widthFix"
          :src="imgHOST+'/clock/sell-banner.jpg'"
          style="margin-left:15rpx;width:96%;border-radius: 10rpx;"
        />
      </navigator>
    </block>

    
    <gl-li :list="navList1"></gl-li>
    
    <!-- 客服 -->
    <button class="li" open-type="contact" bindcontact="handleContact">
      <image mode="widthFix" :src="btn_feedback.icon" class="icon" />
      <view class="title">
        {{btn_feedback.title}}
        <view v-if="btn_feedback.num" class="sup">{{btn_feedback.num}}</view>
      </view>
      <image mode="widthFix" :src="imgHOST+'/icon/arrow.png'" class="arrow" />
    </button>

    <gl-li :list="navList2"></gl-li>


    <view class="spa z-depth-1">
      <view class="title">有奖活动</view>
      <view class="list">
        <view>
          <navigator hover-class="none" url="/pages/spa/qr/list">
            <image :src="imgHOST+'/icon/qr.png'" />
            <text>我的劵码</text>
          </navigator>
        </view>
        <view>
          <view @click="scanSpa">
            <image :src="imgHOST+'/icon/scan.png'" />
            <text>商家核销</text>
          </view>
        </view>
      </view>
    </view>
    <view class="tx-center">
      <image
        mode="widthFix"
        :src="imgHOST+'/home/让好物循环.png'"
        style="width:320rpx;height:0;margin:30rpx 0;"
      />
    </view>
    <view>
      <ad unit-id="adunit-ca4ae30b880d9a14"></ad>
    </view>
    <view style="height:140rpx;"></view>
    <!-- <view style="height:400rpx;"></view> -->

    <tab-bar></tab-bar>
    <!-- <message-icon :messageNo="messageNo"></message-icon> -->
    <!-- 毕业季 -->
    <!-- <navigator hover-class="none" url="/pages/school/index" class="fixed-nav">
      <image mode="widthFix" :src="imgHOST+'/毕业季.png'" />
    </navigator>-->
  </view>
</template>
<script>
import {
  imgHOST,
  Host,
  xhr,
  allowTypes,
  local,
  shareContent,
  request
} from "@/common/util";
export default {
  data() {
    return {
      imgHOST,
      navList1: [
        // {
        //   icon: imgHOST + "/home/love.png",
        //   title: "宠粉活动",
        //   url: "/pages/activity/olay"
        // },
        {
          icon: imgHOST + "/home/publish.png",
          title: "我的发布",
          url: "/pages/my/goods/publish/publish"
        },
        {
          icon: imgHOST + "/home/give.png",
          title: "我送出的",
          url: "/pages/my/goods/give/give",
          num: 0
        },
        {
          icon: imgHOST + "/home/get.png",
          title: "我领到的",
          url: "/pages/my/goods/get/get",
          num: 0
        },
        {
          icon: imgHOST + "/home/location.png",
          title: "我的地址",
          url: "/pages/my/address/list/list"
        },
        {
          icon: imgHOST + "/icon/myFav.png",
          title: "我的收藏",
          url: "/pages/my/goods/fav/fav"
        },
        {
          icon: imgHOST + "/home/支付记录.png",
          title: "我的支付",
          url: "/pages/my/goods/pay/pay"
        },
        // {
        //   icon: imgHOST + "/icon/myFav.png",
        //   title: "送出足迹",
        //   url: "/pages/my/goods/footprint/footprint"
        // }

        // {
        //   icon: imgHOST + "/icon/加入我们.png",
        //   title: "邀新有哩",
        //   url: "/pages/invite/invite"
        // },

      ],
      navList2: [
        {
          icon: imgHOST + "/icon/加入我们.png",
          title: "加入我们",
          url: "/pages/clock/joinUs"
        },
        {
          icon: imgHOST + "/icon/icon-ad.png",
          title: "广告合作",
          url: "/pages/clock/cooperation"
        },
        {
          icon: imgHOST + "/icon/icon-face.png",
          title: "专属表情",
          url:
            "/pages/webviews/webviews?url=https://w.url.cn/s/ATHVQ5t#wechat_redirect"
        },
        {
          icon: imgHOST + "/home/FAQ.png",
          title: "常见问题",
          url: "/pages/FAQ/FAQ"
        },
        {
          icon: imgHOST + "/home/setting.png",
          title: "权限设置",
          isBtn: true,
          openType: "redirect"
        }
      ],
      user: local.get("user"),
      publishNumber: 0,
      messageNo: 0,

      tip: null,
      config: {},
      list:[],
      btn_feedback:{
        icon: imgHOST + "/home/feedback.png",
        title: "来撩小哩",
        url: "/pages/feedback/feedback"
      },
      integration: 0, // 哩豆
      growth: 0, //成长值
      growthPoint: 10000,
      memberLevelId: 1,//用户等级
      levelData: {},
      showTip: null,
      noAddTask: false
    };
  },
  methods: {
    addNavList1(){
      this.navList1.map((val,index) => {
        if(val.title == "任务中心"){
          this.noAddTask = true
        }
      })
      if(local.get("integral_token") && !this.noAddTask){
        this.navList1.push({
          icon: imgHOST + "/icon/myFav.png",
          title: "任务中心",
          url: "/pages/task/task"
        })
      }
    },
    toMysend(){
      uni.navigateTo({ url: '/pages/my/goods/publish/publish' })
    },
    toLoveTab(){
      uni.navigateTo({ url: '/pages/donation/index' })
    },
    handleContact (e) {
      console.log(e.detail.path)
      console.log(e.detail.query)
    },
    getConfig() {
      let url =
          "https://www.grecycle.com.cn/src/sli/config/sli-home-config.json",
        data = {};

      xhr.get(url, data, res => {
        if (res.statusCode == 200) {
          this.tip = res.data.tip;
          this.showTip = res.data.showTip
          console.log("this.showTip");
        }
      });
    },
    getBanner() {
      let url =
          "https://www.grecycle.com.cn/src/sli/config/wx-home-banner-config.json",
        data = {};

      xhr.get(url, data, res => {
        if (res.statusCode == 200) {
          this.config = res.data;
          console.log(this.config,"this.config");
        }
      });
    },
    getPublishNumber() {
      let url = "/items/",
        data = {
          own: 2,
          status: "1"
        };
      xhr.get(url, data, res => {
        console.log(res.data,"/items/");
        if (res.statusCode == 200) {
          this.publishNumber = res.data.count;
        }
      });
    },
    getMessageNum() {
      let url = "/messages/urcout",
        data = {};
      xhr.get(url, data, res => {
        console.log(res.data,"/messages/urcout");
        if (res.statusCode == 200) {
          this.messageNo = res.data ? res.data : 0;
        }
      });
    },
    getMyTasks() {
      let url = "/item/mytasks",
        data = {};
      xhr.get(url, data, res => {
        // console.log(res.data,"/item/mytasks");
        if (res.statusCode === 200) {
          if (res.data.unreceived + res.data.unpaid) {
            this.navList1[2].num = res.data.unreceived + res.data.unpaid;
          }
          if (res.data.undelivered) {
            this.navList1[1].num = res.data.undelivered;
          }
        }
      });
    },
    scanSpa() {
      uni.scanCode({
        onlyFromCamera: true,
        success(res) {
          let coupon_id = res.result.replace(/^spa=/, "");
          let url = "/spa/check",
            data = {
              coupon_id
            };
          xhr.put(url, data, res => {
            console.log(res);
            if (String(res.statusCode)[0] == 2) {
              uni.showModal({
                title: "提示",
                content: "核销成功",
                showCancel: false,
                confirmText: "好哩~",
                success(res) {}
              });
            } else {
              uni.showToast({
                title: res.data.message,
                icon: "none"
              });
            }
          });
        }
      });
    },
    
    getUserInfo(){
      let url = "/mall-portal/sso/info",
      data = {}
      request.get(url,data, res => {
        console.log("积分商城信息",res);
        if(res.code == 200){
          this.integration = res.data.data.integration
          this.growth = res.data.data.growth
          this.memberLevelId = res.data.data.memberLevelId
        }
      })
    },
    getLevelList(){
      let url = "/mall-portal/member/task/levelList",
        data = {}
      request.get( url,data, res => {
        if(res.code == 200) {
          let levelList = res.data.data
          levelList.map((val,index) => {
            if(this.memberLevelId == val.id){
              this.growthPoint = val.growthPoint
            }
          })
        }
      })
    }
  },
  mounted() {
    uni.hideTabBar();
    this.getMyTasks();
    let timer = setInterval(() => {
      setTimeout(this.getMyTasks, 0)
    }, 10000);
  },
  onLoad(options) {
    this.getBanner();
    this.getConfig();
  },
  onShow() {
    // 任务相关
    // this.getUserInfo()
    // this.getLevelList()
    // this.addNavList1()


    this.user = local.get("user");
    this.getPublishNumber();
    this.getMessageNum();
  },
  onReady() {
    var ctx = uni.createCanvasContext('firstCanvas')
    ctx.rect(0,0,100,10)
    ctx.fillStyle = "green"
    ctx.fill()
    console.log("ctx",ctx);
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
$offset: 40rpx;
.container {
  position: relative;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  .bg {
    position: absolute;
    width: 100%;
    height: 370rpx;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .toLoveTab{
    position: absolute;
    top: 180rpx;
    right: 0;
    line-height: 58rpx;
    background: #fff;
    font-size: 28rpx;
    letter-spacing: 1rpx;
    padding: 0 30rpx 0 40rpx;
    border-top-left-radius: 30rpx;
    border-bottom-left-radius: 30rpx;
  }

  .userInfo {
    position: relative;
    margin: 160rpx $page-offset 10rpx 40rpx;
    width: 350rpx;
    height: 100rpx;
    box-sizing: border-box;
    .userMsg{
      display: flex;
      align-items: center;
      position: relative;
      height: 100rpx;
      z-index: 4;
      .avatar {
        position: relative;
        margin: auto 0;
        width: 100rpx;
        height: 100rpx;
        padding: 6rpx;
        box-sizing: border-box;
        border-radius: 50%;
        image {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
        .icn{
          width: 36rpx;
          height: 36rpx;
          position: absolute;
          right: -10rpx;
          bottom: 0;
          z-index: 100;
        }
      }
      .userTxt{
        max-width: 220rpx;
        margin-left: 10rpx;
        .nickname {
          display: flex;
          align-items: center;
          height: 50rpx;
          margin-bottom: 4rpx;
          .userName{
            max-width: 180rpx;
            text-align: left;
            font-size: 34rpx;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #fff;
          }
          .lvImg{
            margin-left: 4rpx;
            margin-top: 4rpx;
            image{
              display: block;
              position: relative;
              max-width: 42rpx;
              max-height: 42rpx;
            }

          }
        }
        .userExp, .userExps{
          box-sizing: border-box;
          margin: 10rpx 0;
          width: 200rpx;
          height: 10rpx;
          background-color: #fff;
          border-radius: 6rpx;
        }
        .userExps{
          max-width: 200rpx !important;
          margin: 0;
          margin-left: 2rpx;
          background-color: greenyellow;
          z-index: 999;
        }
      }
    }
  }

  .showUserMsg{
    position: relative;
    margin: 0 $page-offset 10rpx;
    display: flex;
    align-items: center;
    height: 160rpx;
    border-radius: 16rpx;
    background-color: #fff;
    text-align: center;
    box-sizing: border-box;

    .infoLft, .infoRht{
      display: flex;
      flex-direction: column;
      width: 50%;
      margin-top: 20rpx;
      height: 120rpx;
      .infoNum, .infoTxt, .integration{
        font-size: 48rpx;
        font-weight: 600;
        text-align: center;
        line-height: 58rpx;
      }
      .integration{
        font-size: 42rpx;
        color: #FFCC00;
        font-family: "楷体";
      }
      .infoTxt{
        font-weight: 500;
        line-height: 44rpx;
        font-size: 28rpx;
      }
    }
    .infoRht{
      height: 100%;
      margin-top: 0;
      .toPointMall{
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
      }
    }
  }
}
.banner {
  position: relative;
  margin-bottom: 20rpx;
  height: 166rpx;
  swiper-item {
    navigator {
      width: 100%;
      height: 100%;
    }
    image {
      display: block;
      margin: 0 $offset;
      box-sizing: border-box;
      width: calc(100% - #{$offset} * 2);
      height: 100%;
      border-radius: 12rpx;
      overflow: hidden;
    }
  }
}
.fixed-nav {
  position: fixed;
  bottom: 8%;
  right: 0;
  width: 150rpx;
  height: 150rpx;
  image {
    width: 100%;
    height: 0;
  }
}
.spa {
  position: relative;
  margin: 0 auto 20px;
  // width: calc(100% - 40px);
  padding: 10px 20px;
  box-sizing: border-box;
  background: #fff;
  // border-radius: 10px;
  .title {
    padding: 10px 0;
    font-size: 14px;
    font-weight: bold;
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    color: #666;
    font-size: 12px;
    & > view {
      width: calc(100% / 4);
      text-align: center;
      margin-bottom: 10px;
      line-height: 1.5;
      image {
        display: block;
        position: relative;
        margin: 5px auto;
        width: 24px;
        height: 24px;
      }
    }
  }
}

.li {
  display: flex;
  align-items: center;
  background-color: #fff;
  font-size: 30rpx;
  padding: 26rpx 40rpx;
  border-bottom: 1px solid #f9f9f9;

  .title {
    display: flex;
    align-items: center;
    flex-grow: 1;
    .sup {
      font-size: 8px;
      background: $red-color;
      color: #fff;
      margin-left: 10rpx;
      padding:2rpx 8rpx;
      border-radius: 16rpx;
    }
  }

  .icon {
    width: 40rpx;
    height: 40rpx;
    margin-right: 26rpx;
  }
  .arrow {
    width: 28rpx;
    height: 28rpx;
  }
}
</style>