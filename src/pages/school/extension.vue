<template>
    <view class="height: 100%">
      <gl-navbar back home :text="text"></gl-navbar>
      <view class="content">
        <view class="bg">
          <image mode="widthFix" class="bg-img" :src="imgHOST+'/school/校园推广.jpg'" />
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
        navigationHeight: app.globalData.navigationHeight,
        text:"校园推广"
      };
    },
    onload(){
        wx.showShareMenu({
            withShareTicket: false,
            menus: ['shareAppMessage', 'shareTimeline']
        });
    },
    methods: {
    },
    onShareAppMessage(res) {
      //res.from
      return {
        title: this.text,
        imageUrl: shareContent.schoolImg,
        path: "/pages/school/extension"
      };
    },
    onShareTimeline(res) {
      return {
        title: this.text,
        imageUrl: shareContent.schoolImg,
        path: "/pages/school/extension"
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