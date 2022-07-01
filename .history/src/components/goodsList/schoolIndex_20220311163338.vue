<template>
  <view class="content">
    <view v-if="initLoad" class="null">
      <view>
        <image mode="widthFix" class="img" :src="imgHOST+'/icon/loadding.gif'" />
        <view>加载中 ···</view>
      </view>
    </view>
    <view v-else-if="!list.length" class="null">
      <view>
        <image mode="widthFix" class="img" :src="imgHOST+'/icon/null.png'" />
        <view>未匹配到数据 ~</view>
      </view>
    </view>
    <view class="list-wrapper" :style="'height:'+wrapperH+'px;'">
      <block v-for="(item,index) in list" :key="index">
        <navigator
          hover-class="none"
          :url="'/pages/goods/detail/detail?school=1&id='+item.id"
          class="list"
          :id="'list-'+index"
          :style="positionList[index]"
        >
          <image
            mode="widthFix"
            class="cover-img"
            :src="item.pic[0]"
            @load="imgLoad"
            @error="imgLoad"
            :data-index="index"
          />
          <view class="txt">
            <view class="title">
              <text v-if="item.brand_new == '100'" class="label new">全新</text>
              <!-- <text v-if="item.only_pickup" class="label pick_up">自提</text> -->
              {{item.title}}
            </view>
            <view class="price">
              <text>￥{{item.show_price ? Math.floor(item.show_price/100) : 0}}</text>
              <text class="origin">￥{{Math.floor(item.original_price/100)}}</text>
            </view>
            <view class="avatar flx fx-middle fx-justify">
              <view class="flx fx-middle">
                <image
                  mode="aspectFill"
                  class="img"
                  :src="item.seller.avatarUrl ? item.seller.avatarUrl : imgHOST+'/logo.jpg'"
                />
                <view
                  class="place"
                  :class="{'fcschool':item.campus_info && item.campus_info.college_name}"
                >{{item.campus_info && item.campus_info.college_name ? item.campus_info.college_name : item.place[0]}}</view>
              </view>
            </view>
          </view>
        </navigator>
      </block>
    </view>
    <view v-if="list.length" class="tx-center">
      <block v-if="isLastPage">
        <view class="loadding">
          <text>没有更多数据哩 ~</text>
        </view>
      </block>
      <block v-else>
        <view class="loadding">
          <image mode="widthFix" class="img" :src="imgHOST+'/icon/loadding-bubbles-grey.svg'" />
        </view>
      </block>
    </view>
  </view>
</template>
<script>
export default {
  name: "goods-list-school",
  props: {
    list: {
      type: Array,
      default: []
    },
    isLastPage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imgHOST: this.$common.util.imgHOST,
      wrapperH: 0,
      rectList: [],
      positionList: []
    };
  },
  computed: {
    initLoad() {
      let initLoad = false;
      if (!this.list.length && !this.isLastPage) {
        initLoad = true;
        this.wrapperH = 0;
        this.rectList = [];
        this.positionList = [];
      }
      return initLoad;
    }
  },
  methods: {
    imgErr(e) {
      let index = e.currentTarget.dataset.index;
      let rectList = [];
      try {
        rectList = JSON.parse(JSON.stringify(this.rectList));
      } catch (err) {}
      rectList[index] = {
        h: 0
      };
      this.rectList = rectList;
    },
    imgLoad(e) {
      let index = e.currentTarget.dataset.index;
      const query = uni.createSelectorQuery().in(this);

      query.select("#list-" + index).boundingClientRect(res => {
        let rectList = [];
        try {
          rectList = JSON.parse(JSON.stringify(this.rectList));
        } catch (err) {}
        rectList[index] = {
          h: res ? res.height : 0
        };
        this.rectList = rectList;
        this.initPosition();
      });
      query.exec();
    },
    initPosition() {
      let positionList = this.positionList;
      let colHArray = [0, 0];
      this.rectList.forEach((v, i) => {
        let h = 0;
        if (v) {
          h = v.h ? v.h : 0;
        }

        if (colHArray[0] <= colHArray[1]) {
          positionList[i] = `top:${colHArray[0]}px;left:0;opacity:1;`;
          colHArray[0] += h + 15;
        } else {
          positionList[i] = `top:${colHArray[1]}px;right:0;opacity:1;`;
          colHArray[1] += h + 15;
        }
        if (colHArray[0] <= colHArray[1]) {
          this.wrapperH = colHArray[1];
        } else {
          this.wrapperH = colHArray[0];
        }
      });

      this.positionList = positionList;
    },
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.content {
  padding: 10rpx 15rpx 0 20rpx;
  .null {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 600rpx;
    color: #d8d8d8;
    font-size: 26rpx;
    text-align: center;
    .img {
      display: block;
      width: 260rpx;
      height: 260rpx;
      margin-bottom: 20rpx;
    }
  }
  .list-wrapper {
    //position: relative;
    display: flex;
    flex-flow: column wrap;
    width: 716rpx;
    column-gap: 10rpx;
    .list {
      width: calc(100% / 2);
      margin-bottom: $content-offset;
      border-radius: 12rpx;
      font-size: 26rpx;
      opacity: 0;
      transition-delay: 0.1s;
      .cover-img {
        display: block;
        filter: saturate(100%) brightness(100%);
        border-radius: 25rpx;
        width: 348rpx;
      }
      .txt {
        padding: $content-offset;
        .title {
          height: 94rpx;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-wrap: break-word;
          text-overflow: ellipsis;
          word-break: break-all;
          font-size: 32rpx;
          .label {
            display: inline-block;
            margin-top: -6rpx;
            padding: 2rpx 4rpx;
            margin-right: 6rpx;
            font-weight: normal;
            font-size: 10px;
            color: #fff;
            border-radius: 4rpx;
            vertical-align: middle;
            &.new {
              background-color: #ff5e41;
            }
            &.pick_up {
              background-color: $main-color;
            }
          }
        }
        .price {
          font-weight: bold;
          font-size: 36rpx;
          margin-bottom: 8rpx;
          .origin {
            margin-left: 20rpx;
            color: #666;
            font-size: 24rpx;
            text-decoration: line-through;
          }
        }
        .avatar {
          color: #bbb;
          font-size: 24rpx;
          .img {
            flex-shrink: 0;
            width: 40rpx;
            height: 40rpx;
            margin-right: 20rpx;
            border-radius: 50%;
          }
          
        }
        .place {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .loadding {
    height: 100rpx;
    color: #d8d8d8;
    font-size: 24rpx;
    text-align: center;
    .img {
      display: block;
      position: relative;
      margin: auto;
      width: 100rpx;
      height: 100rpx;
    }
  }
}
</style>