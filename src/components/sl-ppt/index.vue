<template>
  <view>
    <view v-if="isShow" class="ppt">
      <swiper class="swiper" :style="'background-image:url(' + imgHOST + '/detail/bg.png);'" @change="change">
        <block v-for="(item,index) in count" :key="index">
          <swiper-item class="swiper-item flx fx-middle fx-center">
            <image
              mode="widthFix"
              class="img"
              :src="imgHOST+'/ppt/course/ppt-'+(index+1)+(isSchool ? '-school':'')+'.png'"
            />
          </swiper-item>
        </block>
      </swiper>
      <view class="point flx fx-middle">
        <block v-for="(item,index) in count" :key="index">
          <view class="li z-depth-1" :class="{'on':current==index,'school':isSchool}"></view>
        </block>
      </view>
      <view
        v-if="current == count-1"
        class="btn"
        :class="{'school':isSchool}"
        @click="finishCourse"
      >开启断舍哩之旅</view>
    </view>
  </view>
</template>
<script>
import { imgHOST, Host, xhr, allowTypes, local } from '@/common/util';
export default {
  name: 'sl-ppt',
  props: {
    isSchool: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imgHOST,
      isShow: false,
      count: 5,
      current: 0
    };
  },
  methods: {
    change(e) {
      let current = e.detail.current;
      this.current = current;
    },
    finishCourse() {
      this.isShow = false;
      let newJson = { ...local.get('newJson') };
      if (this.isSchool) {
        newJson.isFinishSchoolCourse = true;
      } else {
        newJson.isFinishCourse = true;
      }
      local.set('newJson', newJson);
    }
  },
  watch: {},
  beforeMount() {
    if (!this.isSchool) {
      if (!local.get('newJson').isFinishCourse) {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    } else {
      if (!local.get('newJson').isFinishSchoolCourse) {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    }
  },
  mounted() {
    if (this.isSchool) {
      this.count = 4;
    }
  },
  updated() {}
};
</script>
<style lang="scss" scoped>
.ppt {
  position: fixed;
  z-index: 999999;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(51, 51, 51, 0.5);
  .swiper {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    .swiper-item {
      width: 100%;
      height: 100%;
      .img {
        width: 100%;
      }
    }
  }

  .point {
    position: absolute;
    left: 40rpx;
    bottom: 30rpx;
    .li {
      width: 20rpx;
      height: 20rpx;
      border-radius: 50%;
      background-color: #fff;
      margin-right: 20rpx;
      &.on {
        background-color: $main-color;
        &.school {
          background-color: #ffbd57;
        }
      }
    }
  }

  .btn {
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    bottom: 100rpx;
    width: 540rpx;
    height: 92rpx;
    line-height: 92rpx;
    font-size: 36rpx;
    color: #fff;
    text-align: center;
    border-radius: 46rpx;
    background-color: rgba(255, 85, 54, 1);
    box-shadow: 0 2px 2px 0 rgba(255, 85, 54, 0.4),
      0 3px 1px -2px rgba(255, 85, 54, 0.2), 0 1px 5px 0 rgba(255, 85, 54, 0.8);

    &.school {
      background-color: rgb(255, 189, 87);
      box-shadow: 0 2px 2px 0 rgba(255, 189, 87, 0.4),
        0 3px 1px -2px rgba(255, 189, 87, 0.2),
        0 1px 5px 0 rgba(255, 189, 87, 0.8);
    }
  }
}
</style>