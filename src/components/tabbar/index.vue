<template>
  <view style="height:100%;">
    <view class="flx fx-middle tabbar">
      <view
        v-for="(item,index) in list"
        :key="index"
        class="tabbar-li flx fx-center"
        :class="{'on':currentPage == item.pagePath,'rig':index == 1}"
      >
        <block v-if="item.pagePath == currentPage">
          <view class="tab">
            <image
              class="img"
              :src="imgHOST + (currentPage == item.pagePath?item.selectedIconPath:item.iconPath)"
            />
            <view>{{item.text}}</view>
            <view v-if="mytasksNum && item.pagePath==='/pages/home/home'" class="point"></view>
          </view>
        </block>
        <block v-else>
          <navigator hover-class="none" :url="item.pagePath" open-type="switchTab" class="tab">
            <image
              class="img"
              :src="imgHOST + (currentPage == item.pagePath?item.selectedIconPath:item.iconPath)"
            />
            <view class="name">{{item.text}}</view>
            <view v-if="mytasksNum && item.pagePath==='/pages/home/home'" class="point"></view>
          </navigator>
        </block>
      </view>
      <view
        hover-class="none"
        url="/pages/goods/add/add"
        class="mid-add"
        @click="()=>isShowAddModal=true"
      >
        <image mode="widthFix" class="add-img" :src="imgHOST +'/icon/add-b.png'" />
      </view>
      <view
        style="position:absolute;margin:auto;bottom:4rpx;left:0;right:0;font-size:20rpx;color:#666;text-align:center;"
      >发布</view>
    </view>

    <!-- showAddModal -->
    <block v-if="isShowAddModal">
      <view class="add-modal" @click="()=>isShowAddModal=false">
        <view class="content">
          <view>
            <view class="li" @click.stop="toNav('/pages/goods/add/add')">
              <image model="widthFix" :src="imgHOST+'/add/发布闲置.png'" class="icon" />
              <view>
                <view class="title">发布闲置</view>
                <view class="txt">只送不卖 让好物循环</view>
              </view>
            </view>
            <view class="li" @click.stop="toNav('/pages/wish/add')">
              <image model="widthFix" :src="imgHOST+'/add/发布心愿.png'" class="icon" />
              <view>
                <view class="title">发布心愿</view>
                <view class="txt">告诉大家 你想要什么</view>
              </view>
            </view>
            <view @click="toAdd" class="li">
              <image model="widthFix" :src="imgHOST+'/add/校园专区.png'" class="icon"/>
              <view>
                <view class="title">校园专区</view>
                <view class="txt">方便学生 在校自提</view>
              </view>
            </view>
          </view>
          <image mode="widthFix" :src="imgHOST+'/add/close.png'" class="close" />
        </view>
      </view>
    </block>
  </view>
</template>
<script>
const app = getApp();
import { imgHOST, Host, xhr, allowTypes, local } from "@/common/util";
export default {
  name: "tabBar",
  props: {},
  data() {
    return {
      imgHOST: this.$common.util.imgHOST,
      currentPage: "",
      selected: 0,
      color: "",
      selectedColor: "",
      list: [
        {
          pagePath: "/pages/index/index",
          iconPath: "/icon/index.png",
          selectedIconPath: "/icon/index-on.png",
          text: "首页"
        },
        {
          pagePath: "/pages/home/home",
          iconPath: "/icon/home.png",
          selectedIconPath: "/icon/home-on.png",
          text: "我的"
        }
      ],
      mytasksNum: 0,
      isShowAddModal: false
    };
  },
  methods: {
    getSchoolJSON() {
      let url = "https://image.grecycle.com.cn/src/sli/config/大学.json",
        data = {};
      xhr.get(url, data, res => {
        if (res.statusCode == 200) {
          this.schoolJSON = res.data;
          this.provinceList = Object.keys(res.data);
        }
      });
    },
    checkApply() {
      let url = "/campus_admin/student_application_status",
        data = {};
      console.log("checkApply");
      xhr.get(url, data, res => {
        console.log(res);
        if (res.statusCode == 200) {
          if (res.data.status == 1) {
            uni.showModal({
              title: "认证已提交",
              content: "大学身份认证已提交！请耐心等待工作人员进行审核！",
              showCancel: false,
              confirmText: "好哩",
              complete: res => {}
            });
          } else if (res.data.status == 2) {
            this.checkUser();
            uni.navigateTo({
              url: "/pages/goods/add/add?school=1"
            });
          } else {
            uni.showModal({
              title: "需要认证",
              content: "需要学生身份认证通过后，才能在校园专区发布闲置！",
              cancelText: "稍后再说",
              cancelColor: "#bbb",
              confirmText: "前往认证",
              complete: res => {
                if (res.confirm) {
                  uni.navigateTo({
                    url: "/pages/school/applyID"
                  });
                }
              }
            });
          }
        }
      });
    },
    checkUser() {
      let url = "/user/",
        data = {};
      xhr.get(url, data, res => {
        console.log(res);
        if (String(res.statusCode)[0] == 2) {
          local.set("user", res.data);
          this.user = res.data;
          console.log(res.data);
        }
      });
    },
    toAdd() {
      if (this.user && this.user.is_student) {
        uni.navigateTo({
          url: "/pages/goods/add/add?school=1"
        });
      } else {
        this.checkApply();
      }
    },
    getMyTasks() {
      let url = "/item/mytasks",
        data = {};
      xhr.get(url, data, res => {
        if (res.statusCode === 200) {
          let mytasks = res.data;
          let mytasksNum = 0;
          try {
            for (let k in mytasks) {
              mytasksNum += mytasks[k];
            }
          } catch (err) {}
          this.mytasksNum = mytasksNum;
        }
      });
    },
    toNav(url) {
      this.isShowAddModal = false;
      uni.navigateTo({
        url
      });
    }
  },
  beforeMount() {
    this.getMyTasks();
    let currentPage =
      "/" + getCurrentPages()[getCurrentPages().length - 1].route;
    this.currentPage = currentPage;
    // if (this.currentPage == "/pages/home/home") {
    //   local.clear("mytasks");
    // }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.tabbar {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: $tabbar-height;
  background-color: #fff;
  background-clip: content-box;
  padding-top: 20rpx;

  .mid-add {
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: -20rpx;
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background-color: #fff;
    box-sizing: border-box;

    .add-img {
      width: 100%;
      height: 100%;
    }
  }

  .tabbar-li {
    position: relative;
    flex-grow: 1;
    text-align: center;
    color: #999;
    margin: 0 40rpx 0 0;
    &.rig {
      margin: 0 0 0 40rpx;
    }
    &.on {
      color: $main-color;
    }
    .img {
      display: block;
      position: relative;
      margin: auto;
      width: 20px;
      height: 22px;
    }
    .tab {
      position: relative;
      margin-top: 8rpx;
      padding: 0 40rpx;
      font-size: 20rpx;
      .name {
        margin-top: 6rpx;
      }
      .point {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        margin: auto;
        transform: translate(20rpx, -6rpx);
        width: 18rpx;
        height: 18rpx;
        background: $red-color;
        border-radius: 50%;
        border: 1px solid #fff;
      }
    }
  }
}
.add-modal {
  position: fixed;
  z-index: 999;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(30, 30, 30, 0.9);
  .content {
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 50%;
    .li {
      display: flex;
      align-items: center;
      margin-bottom: 40rpx;
      .icon {
        margin-right: 30rpx;
        width: 104rpx;
        height: 104rpx;
      }
      .title {
        color: #fff;
        font-size: 15px;
      }
      .txt {
        color: #bbb;
        font-size: 12px;
      }
    }
    .close {
      position: absolute;
      margin: auto;
      left: 0;
      right: 0;
      bottom: 50rpx;
      width: 54rpx;
      height: 54rpx;
    }
  }
}
</style>