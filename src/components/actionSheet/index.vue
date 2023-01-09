<template>
  <view>
    <view class="bg" :class="{'on':on}" @click="toEmit" :data-index="-1"></view>
    <view class="list" :class="{'on':on}">
      <block v-if="!share">
        <view class="ul">
          <block v-for="(item,index) in list" :key="index">
            <view
              class="li"
              :class="{'radius':index === 0,'border':index<list.length-1}"
              @click="toEmit"
              :data-index="index"
            >{{item.title}}</view>
          </block>
        </view>
      </block>
      <block v-else>
        <view class="share flx fx-around">
          <view @click="toEmit" data-index="share">
            <button open-type="share" class="button">
              <image class="img" :src="imgHOST+'/icon/share-wechat' + (isSchool ? '-school' : '') + '.png'" />
              <view>分享给好友/群</view>
            </button>
          </view>
          <view @click="toEmit" data-index="save">
            <image class="img" :src="imgHOST+'/icon/share-pyq' + (isSchool ? '-school' : '') + '.png'" />
            <view>保存分享图传播/群</view>
          </view>
        </view>
      </block>
      <view class="cancel">
        <view class="content flx fx-center fx-middle">
          <view class="btn" :class="{'school':isSchool}" @click="toEmit" :data-index="-1">取消</view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { imgHOST, Host, xhr, allowTypes, local } from '@/common/util';
export default {
  name: 'action-sheet',
  props: {
    list: {
      type: Array,
      default: [] // [{title:''}]
    },
    on: {
      type: Boolean,
      default: false
    },
    share: {
      type: Boolean,
      default: false
    },
    isSchool: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imgHOST
    };
  },
  methods: {
    toEmit(e) {
      let index = e.currentTarget.dataset.index;
      uni.$emit('chooseActionSheet', { index: index });
    }
  },
  watch: {},
  beforeMount() {},
  mounted() {},
  updated() {}
};
</script>
<style lang="scss" scoped>
.bg {
  position: fixed;
  top: 0;
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

.list {
  position: fixed;
  z-index: 999;
  bottom: 0;
  width: 100%;
  transform: translateY(100%);
  transition: transform 0.1s;

  &.on {
    transform: translateY(0);
  }

  .ul {
    .li {
      padding: 40rpx 0;
      text-align: center;
      font-size: 28rpx;
      background-color: #fff;
      &.radius {
        border-top-left-radius: 16rpx;
        border-top-right-radius: 16rpx;
      }
      &.border {
        border-bottom: 1px solid #f3f3f3;
      }
    }
  }
  .cancel {
    height: 140rpx;
    padding-top: 10rpx;
    background-color: $backBG-color;
    .content {
      height: inherit;
      background-color: #fff;

      .btn {
        width: 556rpx;
        height: 88rpx;
        line-height: 88rpx;
        color: #fff;
        text-align: center;
        background-color: $main-color;
        border-radius: 44rpx;
        &.school {
          background-color: $school-main-color;
        }
      }
    }
  }
  .share {
    padding: 60rpx;
    font-size: 24rpx;
    text-align: center;
    background-color: #fff;
    border-top-left-radius: 16rpx;
    border-top-right-radius: 16rpx;
    .button {
      margin: 0;
      padding: 0;
      color: #333;
      background: transparent;
      line-height: normal;
      font-weight: normal;
      font-size: 24rpx;
      &::after {
        border: none;
      }
    }
    .img {
      position: relative;
      margin: auto;
      width: 108rpx;
      height: 108rpx;
      margin-bottom: 10rpx;
    }
  }
}
</style>