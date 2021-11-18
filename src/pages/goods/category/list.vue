<template>
  <view
    :style="'position:relative;height:calc(100% - ' + (statusBarHeight + navigationHeight) +'px);'"
  >
    <gl-navbar back home text="全部分类"></gl-navbar>
    <!-- ---category-container--- -->
    <scroll-view
      scroll-y
      enable-back-to-top
      class="category-container z-index-1"
      :class="{'on':showCategory}"
      :style="'top:'+(statusBarHeight + navigationHeight)+'px;'"
    >
      <view style="height:20rpx;"></view>
      <block v-for="(item,index) in list" :key="index">
        <navigator
          hover-class="none"
          :url="'/pages/goods/list/category?cat='+item.name"
          class="category-li flx fx-middle"
        >
          <image mode="aspectFill" :src="item.pic" />
          <view>{{item.name}}</view>
        </navigator>
      </block>
      <view style="height:60rpx;"></view>
    </scroll-view>
  </view>
  <!-- ===category-container=== -->
</template>

<script>
const app = getApp();
import { imgHOST, xhr, allowTypes, local, shareContent } from "@/common/util";

export default {
  data() {
    return {
      imgHOST,
      statusBarHeight: app.globalData.statusBarHeight,
      navigationHeight: app.globalData.navigationHeight,
      list: []
    };
  },
  methods: {
    getList() {
      let url = "/item/cats",
        data = {};

      xhr.get(url, data, res => {
        if (res.statusCode == 200) {
          this.list = res.data;
        }
      });
    }
  },
  mounted() {
    //this.initTabType();
  },
  onLoad(options) {
    this.getList();
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
.category-container {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: $backBG-color;
  box-sizing: border-box;
  padding: 0 20rpx;

  .category-li {
    padding: 20rpx 30rpx;
    background-color: #fff;
    border-radius: 8rpx;
    margin-bottom: 20rpx;
    font-size: 28rpx;
    image {
      width: 66rpx;
      height: 66rpx;
      margin-right: 30rpx;
      border-radius: 50%;
    }
  }
}
</style>
