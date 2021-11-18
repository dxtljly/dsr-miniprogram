<template>
  <view class="gl-list">
    <view v-for="(item,index) in list" :key="index" :class="{'borbot': index < list.length - 1}">
      <button v-if="item.isBtn" :open-type="item.openType" class="li">
        <image mode="widthFix" :src="item.icon" class="icon" />
        <view class="title">
          {{item.title}}
          <view v-if="item.num" class="sup">{{item.num}}</view>
        </view>
        <image mode="widthFix" :src="imgHOST+'/icon/arrow.png'" class="arrow" />
      </button>
      <navigator
        v-else-if="item.url"
        hover-class="none"
        :url="item.url"
        :open-type="item.openType?item.openType:'navigate'"
        class="li"
      >
        <image mode="widthFix" :src="item.icon" class="icon" />
        <view class="title">
          {{item.title}}
          <view v-if="item.num" class="sup">{{item.num}}</view>
        </view>
        <image mode="widthFix" :src="imgHOST+'/icon/arrow.png'" class="arrow" />
      </navigator>
      <view v-else class="li">
        <image mode="widthFix" :src="item.icon" class="icon" />
        <view class="title">
          {{item.title}}
          <view v-if="item.num" class="sup">{{item.num}}</view>
        </view>
        <image mode="widthFix" :src="imgHOST+'/icon/arrow.png'" class="arrow" />
      </view>
    </view>
  </view>
</template>
<script>
export default {
  name: 'gl-list',
  props: {
    list: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      imgHOST: this.$common.util.imgHOST
    };
  },
  methods: {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
.gl-list {
  margin-bottom: 20rpx;

  .borbot {
    border-bottom: 1px solid #f9f9f9;
  }

  .li {
    line-height: normal;
    border-radius: 0;
    text-align: left;
    color: #333;
    &::after {
      border: none;
    }
    &:active {
      background-color: #fff;
    }
  }
  .li {
    display: flex;
    align-items: center;
    background-color: #fff;
    font-size: 30rpx;
    padding: 26rpx 40rpx;

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
}
</style>