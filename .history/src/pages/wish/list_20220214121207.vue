<template>
  <view
    :style="'position:relative;height:calc(100% - ' + (statusBarHeight + navigationHeight) +'px);'"
  >
    <!--  -->
    <gl-navbar
      id="gl-navbar"
      back
      home
      :titleImg="imgHOST+'/wish/心愿-title.png'"
      :titleImgW="'120rpx'"
    ></gl-navbar>
    <view class="search-bar flx fx-middle">
      <view class="input-content flx fx-middle fx-center fx1" @click="toFocusSearch">
        <image mode="widthFix" class="search" :src="imgHOST+'/icon/search.png'" />
        <input
          type="text"
          placeholder="找心愿"
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
      <navigator hover-class="none" url="/pages/my/message/message" class="category">
        <image mode="widthFix" :src="imgHOST+'/icon/message-icon.png'" />
        <view v-if="messageNo" class="number">
          <view>{{messageNo > 9 ? '9+' : messageNo}}</view>
        </view>
      </navigator>
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
        <view class="banner-top">
          <swiper v-if="bannerList && bannerList.length" indicator-dots autoplay circular>
            <swiper-item v-for="(item,index) in bannerList" :key="index" class="z-depth-1">
              <navigator
                hover-class="none"
                v-if="item.url || item.path"
                :target="item.target?'miniProgram':'self'"
                :url="item.url"
                :open-type="item.openType"
                :appId="item.appId"
                :path="item.path"
              >
                <image mode="aspectFill" :src="item.img" />
              </navigator>
              <image v-else :src="item.img" mode="aspectFill" />
            </swiper-item>
          </swiper>
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
      <view style="min-height:500px;">
        <wish-list :list="list" :isLastPage="isLastPage"></wish-list>
      </view>
    </scroll-view>

    <view class="fixed-add-btn" @click="toAdd">
      <image mode="widthFix" :src="imgHOST+'/wish/add.png'" />
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
  shareContent,
  schoolJSON
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
      isShowChooseCampus: false,
      campusTxt: "",
      area: ["上海市", "上海市", "静安区"],
      provinceList: [], //Object.keys(res.data)
      user: local.get("user") || null,
      isCampusSearch: false,
      campus_province: "",
      campus_campus: "",
      campus_city: "",
      college_name: "",
      animationDataTab: {},
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
      bannerList: [],
      messageNo: 0,
      schoolJSON: null
    };
  },
  computed: {
    schoolList() {
      let list = [];
      if (
        this.schoolJSON &&
        this.area &&
        this.area[0] &&
        this.schoolJSON[this.area[0]]
      ) {
        list = this.schoolJSON[this.area[0]].sort();
      }
      if (this.campusTxt) {
        list = list.filter(v => {
          if (v.match(new RegExp(this.campusTxt))) {
            return v;
          }
        });
      }
      return list;
    }
  },
  methods: {
    getBannerList() {
      let url =
          "https://www.grecycle.com.cn/src/sli/config/wx-wish-config.json",
        data = {};
      xhr.get(url, data, res => {
        if (res.statusCode == 200) {
          let list = res.data.list;
          this.bannerList = list;
        }
      });
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
          let list = [];
          res.data.forEach(v => {
            list.push(v);
          });

          this.typeList = this.typeList.concat(list);
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
          let w = data.width * 0.15;
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
      let url = "/wish/list",
        data = {
          skip: this.skip
        };
      if (this.searchTxt) {
        data.q = this.searchTxt;
      }
      if (
        this.typeList[this.typeIndex] &&
        !this.typeList[this.typeIndex].flag
      ) {
        data.cat = this.typeList[this.typeIndex].name;
      }

      xhr.get(url, data, res => {
        console.log(res);
        this.isLoadEnd = true;
        if (res.statusCode == 200) {
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
      uni.navigateTo({
        url: "/pages/wish/add"
      });
    }
  },
  mounted() {
    uni.hideTabBar();
  },
  onLoad(options) {
    if (options.scene) {
      let scene = getUrlParam(
        decodeURIComponent(options.scene).replace(/^\?/, "")
      );
      options = scene;
    }

    if (options.q) {
      this.searchTxt = options.q;
    }

    this.animationTab = animationTab;
    this.getBannerList();
    this.getList();
    this.getTypeList();
  },
  onShow() {
    // this.getBannerList();
    this.getMessageNum();
    this.user = local.get("user") || null;
  },
  onShareAppMessage(res) {
    //res.from
    return {
      title: shareContent.wishTitle,
      imageUrl: shareContent.wishImg,
      path: `/pages/wish/list${this.searchTxt ? "?q=" + this.searchTxt : ""}`
    };
  },
  onShareTimeline(res) {
    return {
      title: shareContent.wishTitle,
      imageUrl: shareContent.wishImg,
      path: `/pages/wish/list${this.searchTxt ? "?q=" + this.searchTxt : ""}`
    };
  }
};
</script>

<style lang="scss" scoped>
$search-bar-height: 104rpx;
$tab-list-height: 60rpx;
.choose-campus {
  display: flex;
  align-items: center;
  position: relative;
  view {
    font-size: 14px;
    color: $school-main-color;
    white-space: nowrap;
    max-width: 240rpx;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &::after {
    content: "";
    display: block;
    margin-left: 10rpx;
    margin-top: 12rpx;
    width: 0;
    height: 0;
    border-top: 10rpx solid #bbb;
    border-bottom: 10rpx solid transparent;
    border-left: 10rpx solid transparent;
    border-right: 10rpx solid transparent;
  }
}
.choose-campus-modal {
  position: fixed;
  top: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background: #fff;
  .nav {
    .search-bar {
      position: relative;
      .input-content {
        box-sizing: border-box;
        padding: 0 30rpx;
      }
    }

    .province-choose {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 80rpx;
      margin: 0 $page-offset + 20rpx;
      font-size: 14px;
      border-bottom: 1px solid $border-color;

      .btn-all {
        margin-right: 14rpx;
        font-size: 12px;
        color: $main-color;
        opacity: 0.7;
      }
      .btn-my {
        margin-left: 14rpx;
        font-size: 12px;
        color: $red-color;
        opacity: 0.7;
      }
    }
  }
  .school-li {
    margin: 0 30rpx;
    padding: 20rpx 0;
    border-bottom: 1px solid $border-color;
    font-size: 14px;
    color: #666;
  }
  .null {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 160rpx;
    color: #999;
    font-size: 13px;
  }
}
.search-bar {
  position: fixed;
  width: 100%;
  height: $search-bar-height;
  padding: 16rpx $page-offset;
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
  display: flex;
  flex-flow: column wrap;
  column-gap: 10rpx;
  height: calc(100% - #{$search-bar-height});

.banner-top {
  padding: $page-offset $page-offset 0;
  swiper {
    margin: auto;
    width: 100%;
    height: 204rpx;
    swiper-item {
      width: 100%;
      height: 100%;
      background-color: #fff;
      border-radius: 12rpx;
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
    padding: 0 20rpx 0;
    height: $tab-list-height;
    text-align: center;
    font-size: 15px;
    transition: 0.1s;
    white-space: nowrap;

    &.on {
      color: #333;
      font-size: 40rpx;
    }
  }

  .line {
    flex-shrink: 0;
    display: block;
    position: absolute;
    bottom: 6rpx;
    height: 0;
    border-radius: 10rpx;
    border: 2px solid $main-color-1;
    opacity: 0.9;
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
.spread {
  position: fixed;
  z-index: 999999;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
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
    font-size: 24rpx;
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

.fixed-add-btn {
  position: fixed;
  bottom: 8%;
  right: 0;
  width: 150rpx;
  height: 150rpx;
  image {
    width: 100%;
    height: 100%;
  }
}
</style>
