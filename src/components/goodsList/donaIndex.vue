<template>
  <view class="content">
    <view v-if="!list.length" class="null">
      <view>
        <image mode="widthFix" class="img" :src="imgHOST + '/icon/null.png'" />
        <view>未匹配到数据 ~</view>
      </view>
    </view>

    <view class="list-wrapper">
      <block v-for="(item, index) in list" :key="index">
        <navigator
          hover-class="none"
          url=""
          class="list">
          <image mode="aspectFill" class="cover-img" :src="item.pic[0]" />
          <view class="title">我捐赠了10万只口罩</view>
          <view class="txt">
            <view class="avatar flx fx-middle fx-justify">
              <view class="flx fx-middle">
                <image
                  mode="aspectFill"
                  class="img"
                  :src="
                    item.seller.avatarUrl
                      ? item.seller.avatarUrl
                      : imgHOST + '/logo.jpg'"
                />
                <view class="place">{{ item.seller.nickName }}</view>
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
          <image
            mode="widthFix"
            class="img"
            :src="imgHOST + '/icon/loadding-bubbles-grey.svg'"
          />
        </view>
      </block>
    </view>
  </view>
</template>
<script>
import { imgHOST, xhr, local } from "@/common/util";
export default {
  name: "dona-list",
  props: {
    list: {
      type: Array,
      default: [],
    },
    isLastPage: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      imgHOST: this.$common.util.imgHOST,
      wrapperH: 0,
      rectList: [],
      positionList: [],
    };
  },
  computed: {},
  methods: {},
  mounted() {},
  updated() {},
};
</script>
<style lang="scss" scoped>
.content {
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
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    background: #fff;
    .list {
      width: calc((100% - 20rpx) / 2);
      margin-bottom: 20rpx;
      border-radius: 24rpx;
      font-size: 26rpx;
      transition-delay: 0.1s;
      box-sizing: border-box;
      .title{
        padding: 6rpx;
        width: 100%;
        line-height:40rpx;
        font-size: 28rpx;
        font-weight: bold;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      .cover-img {
        width: 100%;
        border-radius: 12rpx;
        border-top-left-radius: 24rpx;
        border-top-right-radius: 24rpx;
      }
      .txt {
        .avatar {
          color: #333;
          font-size: 24rpx;
          .img {
            flex-shrink: 0;
            width: 40rpx;
            height: 40rpx;
            margin-right: 10rpx;
            border-radius: 50%;
          }
        }
        .place {
        color: #a2a0a1;
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