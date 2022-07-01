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
          :url="'/pages/wish/detail?id='+item.id"
          class="list z-depth-1"
          :id="'list-'+index"
          :style="positionList[index]"
        >
          <block v-if="item.pic && item.pic[0]">
            <image
              mode="widthFix"
              class="cover-img"
              :src="item.pic[0]"
              @load="imgLoad"
              @error="imgLoad"
              :data-index="index"
            />
          </block>
          <block v-else>
            <image
              mode="widthFix"
              class="cover-img"
              :src="imgHOST+'/wish/cover.jpg'"
              @load="imgLoad"
              @error="imgLoad"
              :data-index="index"
            />
          </block>

          <view class="txt">
            <view class="title">
              <text v-if="item.seller && item.seller.wisher" class="label new">公益</text>
              {{item.title}}
            </view>
            <view class="avatar flx fx-middle fx-justify">
              <view class="flx fx-middle">
                <image
                  mode="aspectFill"
                  class="img"
                  :class="{'chariy':item.seller && item.seller.wisher}"
                  :src="item.seller.avatarUrl ? item.seller.avatarUrl : imgHOST+'/logo.jpg'"
                />
                <image
                  v-if="item.seller && item.seller.wisher"
                  mode="widthFix"
                  :src="imgHOST+'/icon/icon-charity.png'"
                  class="icon-charity"
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
    imgLoad(e) {
      let index = e.currentTarget.dataset.index;
      const query = uni.createSelectorQuery().in(this);

      query.select("#list-" + index).boundingClientRect(res => {
        let rectList = JSON.parse(JSON.stringify(this.rectList));
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
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.content {
  //padding: 10rpx 20rpx 0 20rpx;
  padding: ;
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
    width: 712rpx;
    column-gap: 20rpx;
    .list {
      width: calc(100% / 2);
      width: 344rpx;
      border-radius: 30rpx;
      margin-bottom: 20rpx;
      background-color: #fff;
      border-radius: 12rpx;
      font-size: 26rpx;
      opacity: 0;
      transition-delay: 0.1s;
      .cover-img {
        display: block;
        border-top-left-radius: 30rpx;
        border-top-right-radius: 30rpx;
        width: 344rpx;
        height: 344rpx;
      }
      .txt {
        padding: $content-offset;
        .title {
          //   height: 84rpx;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 16rpx;
          word-wrap: break-word;
          word-break: break-all;
          font-size: 16px;
          .label {
            display: inline-block;
            margin-top: -6rpx;
            padding: 2rpx 4rpx;
            margin-right: 6rpx;
            font-weight: normal;
            font-size: 10px;
            color: #fff;
            border-radius: 8rpx;
            vertical-align: middle;
            &.new {
              background-color: #ff5e41;
            }
            &.pick_up {
              background-color: $school-main-color;
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
          position: relative;
          color: #bbb;
          font-size: 24rpx;
          .img {
            flex-shrink: 0;
            width: 40rpx;
            height: 40rpx;
            margin-right: 20rpx;
            border-radius: 50%;
            &.chariy {
              border: 1px solid $main-color-1;
            }
          }
          .icon-charity {
            position: absolute;
            top: 20rpx;
            left: 20rpx;
            width: 20rpx;
            height: 20rpx;
          }
        }
        .place {
          width: 200rpx;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .loadding {
    margin-top: 26rpx;
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