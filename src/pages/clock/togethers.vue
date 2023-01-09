<template>
    <view class="height: 100%">
      <gl-navbar back home text="城市合伙人"></gl-navbar>
      <view class="content">
        <view class="bg">
          <image mode="widthFix" class="bg-img" :src="imgHOST+'/合伙人招募.jpg'" />
        </view>
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
    shareContent
  } from "@/common/util";
  export default {
    data() {
      return {
        imgHOST,
        statusBarHeight: app.globalData.statusBarHeight,
        navigationHeight: app.globalData.navigationHeight
      };
    },
    methods: {
    },
    onShareAppMessage(res) {
      //res.from
      return {
        title: shareContent.title,
        imageUrl: shareContent.img,
        path: "/pages/clock/togethers"
      };
    },
    onShareTimeline(res) {
      return {
        title: shareContent.title,
        imageUrl: shareContent.img,
        path: "/pages/clock/togethers"
      };
    }
  };
  </script>
  <style lang="scss" scoped>
    .content{
      .bg{
        .bg-img{
          height:100%;
          width:100%;
        }
      }
    }
  </style>