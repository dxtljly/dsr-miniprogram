<template>
  <view style="height:100%;">
    <gl-navbar back home text="我的收藏"></gl-navbar>
    <scroll-view
      scroll-y
      enable-back-to-top
      style="height:100%;"
      @scrolltolower="getList"
      @scroll="scroll"
    >
      <goods-list :list="list" :isLastPage="isLastPage" isFavList @cancelFav="cancelFav"></goods-list>
    </scroll-view>
  </view>
</template>
<script>
const app = getApp();
import { imgHOST, xhr, allowTypes, local, shareContent } from "@/common/util";
export default {
  data() {
    return {
      imgHOST: this.$common.util.imgHOST,
      statusBarHeight: app.globalData.statusBarHeight,
      navigationHeight: app.globalData.navigationHeight,
      rows: 10,
      skip: 0,
      list: [],
      itemIdList: [],
      isLastPage: false,
      isLoadEnd: true
    };
  },
  methods: {
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
      let url = "/user/fav",
        data = {};

      xhr.get(url, data, res => {
        this.isLoadEnd = true;
        if (res.statusCode == 200) {
          this.list = res.data;
          console.log(this.list,"1234543234543234");
          console.log(this.list,"this.list.fav,/user/fav");
          this.isLastPage = true;
        }
      });
    },
    cancelFav(e) {
      let id = e.id,
        index = e.index;
      let url = "/user/fav",
        data = {
          id
        };
      xhr.delete(url, data, res => {
        if (res.statusCode == 200) {
          uni.showToast({ title: "取消收藏" });
          this.list.splice(index, 1);
        }
      });
    }
  },
  onLoad(options) {
    if (options.scene) {
      let scene = getUrlParam(
        decodeURIComponent(options.scene).replace(/^\?/, "")
      );
      options = scene;
    }
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
</style>