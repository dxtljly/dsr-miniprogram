<template>
  <view
    :style="'position:relative;height:calc(100% - ' + (statusBarHeight + navigationHeight) +'px);'"
  >
    <gl-navbar back home :text="category"></gl-navbar>
    <!-- ---category-container--- -->
    <scroll-view
      scroll-y
      enable-back-to-top
      @scrolltolower="getList"
      class="container"
      :class="{'on':showCategory}"
      :style="'top:'+(statusBarHeight + navigationHeight)+'px;'"
    >
      <goods-list :list="list" :listTotal="listTotal"></goods-list>
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
      category: "",
      rows: 10,
      skip: 0,
      list: [],
      listTotal: -1,
      isLoadEnd: true
    };
  },
  methods: {
    getList(e) {
      if (!this.isLoadEnd || this.list.length == this.listTotal) {
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
          cat: this.category
        };

      xhr.get(url, data, res => {
        this.isLoadEnd = true;
        if (res.statusCode == 200) {
          this.list = [...this.list].concat(res.data.items);
          this.listTotal = res.data.count;
        }
      });
    }
  },
  mounted() {},
  onLoad(options) {
    if (!options.cat) {
      return uni.redirectTo({ url: "/pages/goods/category/list" });
    }
    this.category = options.cat.replace(/\s/g, "");
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
.container {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
