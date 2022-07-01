<template>
  <view
    :style="'position:relative;height:calc(100% - ' + (statusBarHeight + navigationHeight) +'px);'"
  >
    <gl-navbar isMessage :messageNo="messageNo" id="gl-navbar"></gl-navbar>
    <view class="search-bar flx fx-middle">
      <view class="input-content flx fx-middle fx-center fx1" @click="toFocusSearch">
        <image mode="widthFix" class="search" :src="imgHOST+'/icon/search.png'" />
        <input
          type="text"
          placeholder="找好物"
          placeholder-class="fcbbb"
          data-key="searchTxt"
          v-model="searchTxt"
          :focus="startSearchFlag"
          @focus="focusSearch"
          @blur="blurSearch"
          @confirm="search"
          :class="{'on':startSearchFlag}"
        />
        <image
          v-if="searchTxt"
          mode="widthFix"
          class="clean"
          :src="imgHOST+'/icon/clean.png'"
          @click.stop="clear"
          data-key="searchTxt"
        />
      </view>
      <!-- <navigator hover-class="none" url="/pages/my/message/message" class="category">
        <image mode="widthFix" :src="imgHOST+'/icon/message-icon.png'" />
        <view v-if="messageNo" class="number">
          <view>{{messageNo > 9 ? '9+' : messageNo}}</view>
        </view>
      </navigator>-->
    </view>
    <view class="refresh" :class="{'on':isRefresh}">
      <image mode="widthFix" :src="imgHOST+'/icon/loadding-bubbles-grey.svg'" />
    </view>
    <scroll-view
      class="container"
      scroll-y="!isRefresh"
      enable-back-to-top
      :scroll-top="scrollTop"
      @scrolltolower="getList"
      upper-threshold="-50"
      @scrolltoupper="refresh"
      @scroll="scroll"
    >
      <view id="banner-top">
        <button
          hover-class="none"
          @click="previewImgs(imgHOST+'/公众号-save.jpg')"
          style="padding:0;border:none;border-radius:0;line-height:normal;"
        >
          <image
            mode="widthFix"
            :src="imgHOST+'/关注公众号.jpg'"
            style="display:block;width:100%;height:0;"
          />
        </button>
        <view class="banner-top">
          <swiper indicator-dots autoplay circular>
            <block v-if="config && config.list">
              <swiper-item v-for="(item,index) in config.list" :key="index">
                <navigator
                  hover-class="none"
                  v-if="item.url || item.path"
                  :target="item.target?'miniProgram':'self'"
                  :url="item.url"
                  :open-type="item.openType"
                  :appId="item.appId"
                  :path="item.path"
                >
                  <image mode="aspectFill" :src="item.img" class="z-depth-1" />
                </navigator>
                <image v-else :src="item.img" mode="aspectFill" class="z-depth-1" />
              </swiper-item>
            </block>
            <block v-else>
              <swiper-item>
                <image src mode="aspectFill" class="z-depth-1" />
              </swiper-item>
            </block>
          </swiper>
        </view>
        <view class="nav-btn">
          <!-- 打卡 -->
          <!-- <navigator hover-class="none" url="/pages/clock/clock">
            <image mode="widthFix" :src="imgHOST+'/icon/礼包.png'" />
          </navigator>-->
          <!-- 打卡 -->
          <navigator hover-class="none" url="/pages/wish/list">
            <image mode="widthFix" :src="imgHOST+'/icon/心愿.png'" />
          </navigator>
          <!-- 毕业季 -->
          <navigator hover-class="none" url="/pages/school/index">
            <image mode="widthFix" :src="imgHOST+'/icon/校园.png'" />
          </navigator>
        </view>
        <!-- ---tab-list--- -->
        <view style="height:20rpx;"></view>
      </view>
      <scroll-view
        scroll-x
        id="tab-list"
        :class="{'on':isTabTypeFixed}"
        :style="isTabTypeFixed?'top:'+tabTypeFixedTop+'px;':''"
      >
        <view class="tab-list" :class="{'on':isTabTypeFixed}">
          <view
            v-for="(item,index) in typeList"
            :key="index"
            class="tab-li"
            :class="{'on':index == typeIndex}"
            @click="changeType"
            :data-index="index"
            :id="'tabList-'+index"
          >
            <view>{{item.name}}</view>
          </view>
          <view class="line" :animation="animationDataTab"></view>
        </view>
      </scroll-view>
      <!-- ===tab-list=== -->
      <view v-if="isTabTypeFixed" class="tab-list-on"></view>
      <view style="min-height:500px;" v-if="list.length">
        <goods-list :list="list" :isLastPage="isLastPage"></goods-list>
      </view>
      <block v-else>
        <block v-if="isLoading">
          <view class="null" style="height:400rpx;">
            <view>
              <image mode="widthFix" :src="imgHOST+'/icon/loading.gif'" />
              <view class="txt">
                <text>加载中···</text>
              </view>
            </view>
          </view>
        </block>
      </block>
    </scroll-view>
    <tab-bar></tab-bar>
    <!-- ---category-container--- -->
    <!-- <view
      class="category-container-bg"
      :class="{'on':showCategory}"
      :style="'top:'+(statusBarHeight + navigationHeight)+'px;'"
      @click="toggleCategory"
    ></view>
    <scroll-view
      scroll-y
      enable-back-to-top
      class="category-container z-index-1"
      :class="{'on':showCategory}"
      :style="'top:'+(statusBarHeight + navigationHeight)+'px;'"
    >
      <view style="height:20rpx;"></view>
      <block v-for="(item,index) in 30" :key="index">
        <view class="category-li flx fx-middle">
          <image mode="aspectFill" :src="imgHOST+'/logo.png'" />
          <view>分类标题-{{index}}</view>
        </view>
      </block>
      <view style="height:60rpx;"></view>
    </scroll-view>-->
    <!-- ===category-container=== -->
    <!-- <message-icon :messageNo="messageNo"></message-icon> -->
    <sl-ppt></sl-ppt>
    <view v-if="isShowFocusModal" class="focus-modal" @click="toogleFocusModal">
      <image
        class="z-i"
        mode="widthFix"
        :src="imgHOST+'/公众号.jpg'"
        :data-src="imgHOST+'/公众号-save.jpg'"
        @longpress.stop="saveImg"
        :style="'top:'+(statusBarHeight+navigationHeight+40)+'px;'"
      />
    </view>
    <!-- <block v-if="isShowGuide">
      <view class="guide-bg" @click="closeGuide">
        <view class="content-1" :style="'top:'+(statusBarHeight + navigationHeight + 20)+'px;'">
          <text>点击</text>
          <image
            mode="widthFix"
            :src="imgHOST+'/wechat-share.svg'"
            style="width:20px;height:20px;vertical-align:middle;"
          />
          <text>[添加到我的小程序]微信首页下拉即可快速访问</text>
        </view>
      </view>
    </block> -->
    <view class="pay" v-if="s">
      <view class="content">
        <image mode="widthFix" :src="imgHOST + '/difference/弹窗.png'" />
        <ul class="text">
          <li class="t1">您有欠款9{{}}元</li>
          <li class="t2">详情如下</li>
          <li class="t3">订单编号: 1234567890{{}}</li>
          <li class="t4">预付邮费: 33{{}}元</li>
          <li class="t5">实际邮费: 24{{}}元</li>
          <li class="t6">欠款: 9{{}}元</li>
        </ul>
        <!-- @click="pay" -->
        <view class="image">
          <image class="img" @click="pay" mode="widthFix" :src="imgHOST + '/difference/去支付.png'"/>
        </view>
      </view>
    </view>
    <view v-if="isShowGifModal" class="gif-modal"> 
      <view class="bg" @click="closeGifModal"></view>
      <image mode="widthFix" :src="imgHOST+'/addWX.png'" class="z-index-1 card" @click="copyWX" />
    </view>
    <!-- @touchstart="touchSpread" @longtap="saveSpread" -->
    <view v-if="isShowSpread && config && config.spread" class="spread" @touchstart="touchSpread">
        <view class="content">
          <!-- <view
            @touchstart="()=>isTouchSpread=true"
            @longtap="saveImgs(imgHOST + '/上海加油.jpg')"
          >
            <image mode="widthFix" :src="imgHOST+'/上海加油.jpg'" />
          </view> -->
          <view
            @touchstart="()=>isTouchSpread=true"
            @click="tail"
          >
            <image mode="widthFix" :src="imgHOST+'/clock/开屏.jpg'" />
          </view>
        </view>
      <view
        class="content"
        :class="{'flx fx-middle':config.spread.isFlx}"
        @touchstart="()=>isTouchSpread=true"
        @longtap="saveImgs(config.spread.downloadImg)"
      >
        <image mode="widthFix" :src="config.spread.img" @click="spreadNav" />
      </view>
      <view
        class="close-btn"
        :style="'top:'+(statusBarHeight + navigationHeight + 20) +'px;'"
        @click="closeSpread"
      >关闭</view>
      <!-- ({{spreadTime}}s) -->
      <view v-if="!isTouchSpread" class="save-tips">长按保存</view>
    </view>
    <!-- <view v-if="isShowGifModal" class="gif-modal">
      <view class="bg" @click="closeGifModal"></view>
      <image
        mode="widthFix"
        :src="imgHOST+'/addWX.png'"
        class="z-index-1 card"
        @click="copyWX"
      />
    </view> -->
    <!-- <view v-if="isShowGifModal" class="gif-modal">
      <view class="bg" @click="closeGifModal"></view>
      <navigator
        hover-class="none"
        url="/pages/webviews/webviews?url=https://www.grecycle.com.cn/src/sli/html/日置名媛.html"
        style="z-index:99999;"
      >
        <image mode="widthFix" :src="imgHOST+'/日置名媛-modal.jpg'" class="z-index-1 card" />
      </navigator>
    </view>-->

    <!-- 毕业季 -->
    <!-- <navigator hover-class="none" url="/pages/school/index" class="fixed-nav">
      <image mode="widthFix" :src="imgHOST+'/毕业季.png'" />
    </navigator>-->
    <!-- 打卡 -->
    <!-- <navigator hover-class="none" url="/pages/clock/clock" class="fixed-nav" style="bottom:22%;">
      <image mode="widthFix" :src="imgHOST+'/clock/clock-tip.png'" />
    </navigator>-->
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
  shareContent
} from "@/common/util";
let animationTab = uni.createAnimation({
  duration: 200,
  timingFunction: "ease"
});
export default {
  data() {
    return {
      imgHOST,
      statusBarHeight: app.globalData.statusBarHeight,
      navigationHeight: app.globalData.navigationHeight,
      animationDataTab: {},
      config: {},
      searchTxt: "",
      startSearchFlag: false,
      scrollTop: 0,
      scrollTopFlag: 0,
      tabTypeTop: 0,
      tabTypeFixedTop: 0,
      isTabTypeFixed: false,
      typeIndex: 0,
      typeList: [
        {
          flag: true,
          name: "全部"
        }
      ],
      isRefresh: false,
      rows: 10,
      skip: 0,
      list: [],
      itemIdList: [],
      isLastPage: false,
      isLoadEnd: true,
      showCategory: false,
      messageNo: 0,
      isShowFocusModal: false,
      isShowGuide:
        !local.get("newJson").guide && local.get("newJson").isFinishCourse,
      isShowSpread: false,
      spreadTime: 5,
      isTouchSpread: false,
      isShowGifModal: false,
      user: local.get("user")
    };
  },
  methods: {
    previewImgs(current, urls) {
      urls = urls || [current];
      uni.previewImage({
        current,
        urls // 需要预览的图片http链接列表
      });
    },
    tail() {
      uni.navigateTo({
        url: "/pages/clock/clock"
      });
      let newJson = local.get("newJson");
      newJson.spread = new Date();
      this.spreadTime = 0;
      this.isShowSpread = false;
      local.set("newJson", newJson);
    },
    closeSpread() {
      let newJson = local.get("newJson");
      newJson.spread = new Date();
      this.spreadTime = 0;
      this.isShowSpread = false;
      local.set("newJson", newJson);
    },
    closeGuide() {
      let newJson = local.get("newJson");
      newJson.guide = true;
      this.isShowGuide = false;
      local.set("newJson", newJson);
    },
    getConfig() {
      let url =
          "https://www.grecycle.com.cn/src/sli/config/wx-index-config.json",
        data = {};
      xhr.get(url, data, res => {
        if (res.statusCode == 200) {
          this.config = res.data;
        }
      });
    },
    saveImgs(img) {
      if (!img) {
        return false;
      }
      uni.showActionSheet({
        itemList: ["保存图片"],
        success: res => {
          if (res.tapIndex == 0) {
            uni.getImageInfo({
              src: img,
              success: res => {
                uni.saveImageToPhotosAlbum({
                  filePath: res.path,
                  success: res => {
                    console.log(res);
                    uni.showToast({
                      title: "保存成功"
                    });
                    this.isShowGZH = false;
                  },
                  fail: err => {
                    if (
                      err.errMsg == "saveImageToPhotosAlbum:fail auth deny" ||
                      err.errMsg ==
                        "saveImageToPhotosAlbum:fail authorize no response"
                    ) {
                      uni.showToast({
                        title: "获取授权「保存到相册」",
                        icon: "none"
                      });
                      setTimeout(() => {
                        uni.navigateTo({
                          url: "/pages/my/auth/auth?scope=writePhotosAlbum"
                        });
                      }, 1300);
                    }
                  }
                });
              }
            });
          }
        },
        fail: res => {
          console.log(res.errMsg);
        }
      });
    },
    spreadNav() {
      if (
        !this.config ||
        !this.config.spread ||
        (!this.config.spread.url && !this.config.spread.path)
      ) {
        return false;
      }
      if (this.config.spread.url) {
        uni.navigateTo({
          url: this.config.spread.url
        });
      } else if (this.config.spread.path) {
        uni.navigateBackMiniProgram({
          appId: this.config.spread.appId,
          path: this.config.spread.path
        });
      }
    },
    focusSearch() {
      this.startSearchFlag = true;
    },
    blurSearch() {
      if (this.searchTxt) {
        return false;
      }
      this.startSearchFlag = false;
    },
    toFocusSearch() {
      if (this.startSearchFlag) return false;
      this.startSearchFlag = true;
    },
    clear(e) {
      let key = e.currentTarget.dataset.key;
      this[key] = "";
      this.blurSearch();
      this.initList();
      this.getList();
    },
    getTypeList() {
      let url = "/item/cats",
        data = {};

      xhr.get(url, data, res => {
        if (res.statusCode == 200) {
          this.typeList = this.typeList.concat(res.data);
          console.log(this.typeList,"this.typeList");
          this.initTabType();
        }
      });
    },
    getTabs(id) {
      const query = uni.createSelectorQuery();
      let scrollLeft = 0;
      setTimeout(() => {
        query.select("#tab-list").fields({ scrollOffset: true }, data => {
          scrollLeft = data.scrollLeft;
        });
        query.select("#" + id).boundingClientRect(data => {
          let w = data.width * 0.1;
          animationTab
            .width(w)
            .translateX(data.width / 2 + data.left - w / 2 - 1 + scrollLeft)
            .step();
          this.animationDataTab = animationTab.export();
        });
        query.exec();
      }, 100);
    },
    changeType(e) {
      if (!this.isLoadEnd) {
        return false;
      }
      let index = e.currentTarget.dataset.index,
        id = e.currentTarget.id;
      if (index == this.typeIndex) {
        return false;
      }
      this.typeIndex = index;
      this.scrollTop = this.scrollTopFlag;
      if (this.scrollTopFlag >= this.tabTypeTop) {
        setTimeout(() => {
          this.scrollTop = this.tabTypeTop + 5;
        }, 500);
      }

      this.getTabs(id);
      this.initList();
      this.searchTxt = "";
      this.blurSearch();
      this.getList();
    },
    initTabType() {
      const query = uni.createSelectorQuery();
      this.getTabs("tabList-0");
      query.select("#banner-top").boundingClientRect(data => {
        if (data) {
          this.tabTypeTop = data.height;
        }
      });

      query.select("#gl-navbar").boundingClientRect(data => {
        if (data) {
          this.tabTypeFixedTop += data.height;
        }
      });

      query.select(".search-bar").boundingClientRect(data => {
        if (data) {
          this.tabTypeFixedTop += data.height;
        }
      });
      query.exec();
    },
    scroll(e) {
      this.scrollTopFlag = e.detail.scrollTop;
      if (e.detail.scrollTop >= this.tabTypeTop) {
        this.isTabTypeFixed = true;
      } else {
        this.isTabTypeFixed = false;
      }
    },
    search() {
      if (!this.searchTxt) {
        return false;
      }
      this.initList();
      this.getList();
    },
    initList() {
      this.skip = 0;
      this.list = [];
      this.isLastPage = false;
      this.itemIdList = [];
    },
    getList(e) {
      if (!this.isLoadEnd || this.isLastPage) {
        return false;
      }
      if (e) {
        if (e.type == "scrolltolower") {
          this.skip += this.rows;
        }
      }
      this.isLoadEnd = false;
      let url = "/items/",
        data = {
          skip: this.skip,
          waterfall: 1,
          sp: 0
        };
      if (this.searchTxt) {
        data.q = this.searchTxt;
      }
      if (
        this.typeList[this.typeIndex] &&
        !this.typeList[this.typeIndex].flag
        && !this.searchTxt
      ) {
        data.cat = this.typeList[this.typeIndex].name;
      }
      xhr.get(url, data, res => {
        this.isLoadEnd = true;
        if (res.statusCode == 200) {
          console.log(res.data,"res.data");
          res.data.items.forEach(v => {
            if (this.itemIdList.indexOf(v.id) < 0) {
              this.list.push(v);
              this.itemIdList.push(v.id);
            }
          });
          if (res.data.items.length < 10) {
            this.isLastPage = true;
          }
        }
      });
    },
    toggleCategory() {
      this.showCategory = !this.showCategory;
    },
    refresh(e) {
      if (!this.isLoadEnd) {
        return false;
      }
      this.isRefresh = true;
      this.searchTxt = "";
      this.blurSearch();
      setTimeout(() => {
        this.initList();
        this.getList();
        this.isRefresh = false;
      }, 1000);
    },
    getMessageNum() {
      let url = "/messages/urcout",
        data = {};
      xhr.get(url, data, res => {
        if (res.statusCode == 200) {
          this.messageNo = res.data ? res.data : 0;
        }
      });
    },
    toogleFocusModal() {
      this.isShowFocusModal = !this.isShowFocusModal;
    },
    saveImg(e) {
      let src = e.currentTarget.dataset.src;
      uni.showActionSheet({
        itemList: ["保存图片"],
        success: res => {
          console.log("选中了第" + (res.tapIndex + 1) + "个按钮");
          if (res.tapIndex == 0) {
            uni.showLoading();
            uni.getImageInfo({
              src,
              success: res => {
                uni.hideLoading();
                uni.saveImageToPhotosAlbum({
                  filePath: res.path,
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
                    this.isShowFocusModal = false;
                  }
                });
              }
            });
          }
        },
        fail: res => {
          console.log(res.errMsg);
        }
      });
    },
    saveSpread() {
      uni.showActionSheet({
        itemList: ["保存图片"],
        success: res => {
          console.log("选中了第" + (res.tapIndex + 1) + "个按钮");
          if (res.tapIndex == 0) {
            uni.getImageInfo({
              src: imgHOST + "/武汉加油.jpg",
              success: res => {
                uni.saveImageToPhotosAlbum({
                  filePath: res.path,
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
                    this.isShowFocusModal = false;
                  }
                });
              }
            });
          }
        },
        fail: res => {
          console.log(res.errMsg);
        }
      });
    },
    touchSpread() {
      this.isTouchSpread = true;
    },
    copyWX() {
      uni.setClipboardData({
        data: "salmonisaboy",
        success: () => {
          uni.showToast({
            title: "复制成功"
          });
        }
      });
    },
    closeGifModal() {
      this.isShowGifModal = false;
      uni.removeStorageSync("isShowGifModal");
    },
    checkUser() {
      let url = "/user/",
        data = {};
      xhr.get(url, data, res => {
        console.log(res);
        if (String(res.statusCode)[0] == 2) {
          local.set("user", res.data);
          this.user = res.data;
        }
      });
    },
    toOlay() {
      uni.navigateTo({
        url: "/pages/spa/qr/list"
      });
      this.closeGifModal();
    }
  },
  mounted() {
    uni.hideTabBar();
  },
  onLoad(options) {
    console.log(options);
    if (options.scene) {
      let scene = getUrlParam(
        decodeURIComponent(options.scene).replace(/^\?/, "")
      );
      options = scene;
    }
    this.animationTab = animationTab;
    if (options.q) {
      this.searchTxt = options.q;
    }
    this.getList();
    this.getTypeList();
    this.isShowSpread =
      local.get("newJson").isFinishCourse &&
      new Date(local.get("newJson").spread).getDate() != new Date().getDate();

    /* let spreadClock = setInterval(() => {
      if (this.spreadTime > 1) {
        this.spreadTime -= 1;
      } else {
        this.closeSpread();
        clearInterval(spreadClock);
      }
    }, 1000); */
  },
  onShow() {
    if (uni.getStorageSync("isShowGifModal")) {
      this.isShowGifModal = true;
    }
    this.getConfig();
    this.getMessageNum();
  },
  onShareAppMessage(res) {
    //res.from
    return {
      title: shareContent.title,
      imageUrl: shareContent.img,
      path: `/pages/index/index${this.searchTxt ? "?q=" + this.searchTxt : ""}`
    };
  },
  onShareTimeline(res) {
    return {
      title: shareContent.title,
      imageUrl: shareContent.img,
      path: `/pages/index/index${this.searchTxt ? "?q=" + this.searchTxt : ""}`
    };
  }
};
</script>

<style lang="scss" scoped>
$search-bar-height: 104rpx;
$tab-list-height: 60rpx;
.search-bar {
  position: fixed;
  width: 100%;
  height: $search-bar-height;
  padding: 16rpx 20rpx;
  background-color: #fff;
  box-sizing: border-box;

  .input-content {
    height: 100%;
    background-color: $backBG-color;
    border-radius: 40rpx;

    image.search {
      width: 38rpx;
      height: 38rpx;
      margin-right: 20rpx;
    }
    input {
      font-size: 28rpx;
      width: 100rpx;
      transition: 0.3s;
      &.on {
        width: 500rpx;
      }
    }
    image.clean {
      width: 30rpx;
      height: 30rpx;
      margin-left: 20rpx;
    }
  }

  .category {
    text-align: center;
    color: $main-color;
    font-size: 20rpx;
    margin-left: 30rpx;
    image {
      width: 40rpx;
      height: 40rpx;
    }
    .number {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 20rpx;
      right: 10rpx;
      width: 20rpx;
      height: 20rpx;
      font-size: 14rpx;
      color: #fff;
      background-color: #ff5e41;
      border-radius: 50%;
    }
  }
}
.refresh {
  margin-top: $search-bar-height;
  width: 100%;
  height: 0;
  text-align: center;
  overflow: hidden;
  transition: 0.1s;
  image {
    width: 100rpx;
    height: 100rpx;
  }
  &.on {
    height: 100rpx;
  }
}
scroll-view.container {
  position: relative;
  height: calc(100% - #{$search-bar-height + $tabbar-height});
}

// 960*334
.banner-top {
  margin-top: $page-offset;
  swiper {
    width: 100%;
    height: 248rpx;

    swiper-item {
      padding: 0 $page-offset;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      overflow: hidden;
      navigator {
        width: 100%;
        height: 100%;
        border-radius: 12rpx;
      }
      image {
        width: 100%;
        height: 100%;
        border-radius: 12rpx;
        background-color: #fff;
      }
    }
  }
}

.tab-list-on {
  height: $tab-list-height;
}
#tab-list {
  &.on {
    position: fixed;
    z-index: 999;
  }
}
.tab-list {
  position: relative;
  display: flex;
  align-items: center;
  color: #666;
  width: auto;
  transition: 0.1s;

  &.on {
    height: $tab-list-height;
    padding-bottom: 8rpx;

    .line {
      bottom: 0rpx;
    }
    .tab-li {
      background-color: #fff;
    }
  }

  .tab-li {
    display: flex;
    align-items: center;
    flex-grow: 1;
    flex-shrink: 0;
    position: relative;
    padding: 0 20rpx 8rpx;
    height: $tab-list-height;
    text-align: center;
    font-size: 15px;
    transition: 0.1s;
    white-space: nowrap;

    &.on {
      color: #333;
      font-size: 30rpx;
      font-weight: bold;
    }
  }

  .line {
    flex-shrink: 0;
    display: block;
    position: absolute;
    bottom: 0;
    height: 0;
    border-radius: 10rpx;
    border: 2px solid $main-color;
    transition: 0.1s;
  }
}

.category-container-bg {
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  opacity: 0;
  background-color: rgba(51, 51, 51, 0.5);
  transition: opacity 0.1s;

  &.on {
    width: 100%;
    height: 100%;
    opacity: 1;
  }
}

.category-container {
  position: absolute;
  top: 0;
  right: 0;
  width: 80%;
  height: 100%;
  background-color: $backBG-color;
  box-sizing: border-box;
  padding: 0 20rpx;
  transform: translateX(100%);
  transition: transform 0.1s;
  &.on {
    transform: translateX(0);
  }

  .category-li {
    padding: 20rpx 30rpx;
    background-color: #fff;
    border-radius: 8rpx;
    margin-bottom: 20rpx;
    font-size: 28rpx;
    image {
      width: 40rpx;
      height: 40rpx;
      margin-right: 30rpx;
      border-radius: 50%;
    }
  }
}
.focus-modal {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(51, 51, 51, 0.3);
  image {
    position: relative;
    width: 80%;
    display: block;
    margin: auto;
  }
}

.guide-bg {
  position: fixed;
  z-index: 9999;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(30, 30, 30, 0.3);
  .content-1 {
    position: absolute;
    right: 30px;
    width: 150px;
    padding: 8px 10px;
    border-radius: 4px;
    font-size: 12px;
    background: rgba(255, 255, 255, 0.3);
  }
}
.pay {
  display: flex;
  position: fixed;
  z-index: 999999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.3);
  .content { 
    transform: translateX(14%) translateY(30%);
    .text {
      transform: translateX(23%) translateY(-225%);
      .t1 {
        transform: translateY(20%);
        font-size: 52rpx;
        font-weight: 600;
        letter-spacing: 4rpx;
        color: red;
      }
      .t2 {
        font-size: 24rpx;
        transform: translateX(15%) translateY(80%);
        //transform: translateY(25%);
      }
      .t3 {
        font-size: 28rpx;
        transform: translateY(110%);
      }
      .t4 {
        font-size: 28rpx;
        transform: translateY(130%);
      }
      .t5 {
        font-size: 28rpx;
        transform: translateY(150%);
      }
      .t6 {
        font-size: 28rpx;
        transform: translateY(170%);
      }
    }
    .image {
      .img {
        width: 60%;
        height: 60%;
        transform: translateX(30%) translateY(-475%);
      }
    }
  }
}
.spread {
  position: fixed;
  z-index: 999999;
  top: 0;
  width: 100%;
  height: 100%;
  .content {
    width: 100%;
    height: 100%;
    overflow: auto;
    image {
      display: block;
      width: 100%;
    }
  }
  .close-btn {
    position: fixed;
    right: 30rpx;
    padding: 8rpx 16rpx;
    border-radius: 8rpx;
    color: #fff;
    background-color: rgba(51, 51, 51, 0.7);
    font-size: 36rpx;
  }
    .close {
    position: fixed;
    right: 40rpx;
    font-size: 12px;
    padding: 12rpx 24rpx;
    border-radius: 12rpx;
    color: #fff;
    background-color: rgba(51, 51, 51, 0.6);
  }
  .save-tips {
    position: fixed;
    box-sizing: border-box;
    width: 100%;
    padding: 32rpx;
    bottom: 100rpx;
    color: #fff;
    font-weight: bold;
    text-align: center;
    background-color: rgba(51, 51, 51, 0.3);
  }
  .save-tip {
    position: fixed;
    padding: 20rpx;
    box-sizing: border-box;
    width: 100%;
    bottom: 60rpx;
    text-align: center;
    color: #fff;
    background-color: rgba(51, 51, 51, 0.3);
  }
}

.gif-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 100%;
  top: 0;
  .bg {
    position: absolute;
    z-index: 9991;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(30, 30, 30, 0.3);
  }
  image {
    z-index: 9999;
    width: 560rpx;
    height: 0;
    border-radius: 16rpx;
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
.nav-btn {
  display: flex;
  justify-content: space-around;
  padding: 20rpx $page-offset 10rpx;
  width: 100%;
  box-sizing: border-box;
  navigator {
    width: calc(50% - 15rpx);
    image {
      display: block;
      width: 100%;
    }
  }
}
input::-webkit-input-placeholder {
        color: #999999;
    }
</style>
