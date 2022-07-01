<template>
  <view style="height:100%;background:#fff;">
    <view v-for="(item5,index5) in config.school" :key="index5">
      <block v-if="item5.page">
        <gl-navbar back home text="信息认证"></gl-navbar>
        <view></view>
        <image mode="widthFix" :src="imgHOST+'/applyID/header.png'" style="width:100%;height:80rpx;" />
        <view  v-for="(item,index) in config.school" :key="index" class="form">
          <view class="li" v-if="item.page">
            <view class="label">{{item.labelcity}}</view>
            <picker mode="region" class="input" @change="(e)=>area=e.detail.value">
              <block v-if="area && area.length">{{area.join(',')}}</block>
              <block v-else>
                <view class="place-holder">{{item.city}}</view>
              </block>
            </picker>
          </view>
          <view class="li" v-if="item.page">
            <view class="label">{{item.labelschool}}</view> 
            <picker
              :range="schoolList"
              class="input"
              @click="checkHasArea"
              @change="(e)=>college_name = schoolList[e.detail.value]"
            >
              <block v-if="college_name">{{college_name}}</block>
              <block v-else>
                <view class="place-holder">{{item.school}}</view>
              </block>
            </picker>
          </view>
          <view class="li" v-if="item.page">
            <view class="label">{{item.labelarea}}</view>
            <input
              v-model="campus"
              placeholder="请选择"
              placeholder-class="place-holder"
              class="input"
            />
          </view>
        </view>
        <view class="id-img-content" v-for="(item1,index1) in config.school" :key="index1">
          <view class="id-img" v-if="item1.page">
            <block v-if="student_id.temp">
              <image mode="aspectFill" :src="student_id.temp" data-key="student_id" @click="previewImg" />
              <image
                mode="aspectFill"
                :src="imgHOST+'/icon/loadding-bubbles-grey.svg'"
                class="loadding"
              />
              <image
                mode="aspectFill"
                :src="imgHOST+'/icon/delete-close.png'"
                class="close"
                data-key="student_id"
                @click.stop="deleteImg"
              />
            </block>
            <block v-else-if="student_id.upload">
              <image
                mode="aspectFill"
                :src="student_id.upload"
                data-key="student_id"
                @click="previewImg"
              />
              <image
                mode="aspectFill"
                :src="imgHOST+'/icon/delete-close.png'"
                class="close"
                data-key="student_id"
                @click.stop="deleteImg"
              />
            </block>
            <block v-else>
              <image
                mode="aspectFill"
                :src="imgHOST+'/applyID/id-0.png'"
                data-key="student_id"
                @click="chooseImg"
              />
            </block>
            <view>{{item1.studentcard}}</view>
          </view>
          <view class="id-img" v-if="item1.page">
            <block v-if="identify_id.temp">
              <image
                mode="aspectFill"
                :src="identify_id.temp"
                data-key="identify_id"
                @click="previewImg"
              />
              <image
                mode="aspectFill"
                :src="imgHOST+'/icon/loadding-bubbles-grey.svg'"
                class="loadding"
              />
              <image
                mode="aspectFill"
                :src="imgHOST+'/icon/delete-close.png'"
                class="close"
                data-key="identify_id"
                @click.stop="deleteImg"
              />
            </block>
            <block v-else-if="identify_id.upload">
              <image
                mode="aspectFill"
                :src="identify_id.upload"
                data-key="identify_id"
                @click="previewImg"
              />
              <image
                mode="aspectFill"
                :src="imgHOST+'/icon/delete-close.png'"
                class="close"
                data-key="identify_id"
                @click.stop="deleteImg"
              />
            </block>
            <block v-else>
              <image
                mode="aspectFill"
                :src="imgHOST+'/applyID/id-1.png'"
                data-key="identify_id"
                @click="chooseImg"
              />
            </block>
            <view>{{item1.identitycard}}</view>
          </view>
        </view>
        <view class="tip" v-for="(item2,index2) in config.school" :key="index2">
          <image
            mode="widthFix"
            :src="imgHOST+'/applyID/school-关注公众号.png'"
            style="margin-bottom:50rpx;display:block;width:100%;height:0;"
            @click="previewGZH"
            v-if="item2.page"
          />
          <view class="flx" v-if="item2.page">
            <view class="title">{{item2.title}}</view>
          </view>
          <view class="li" v-if="item2.page">
            {{item2.li1}}
            <text>{{item2.li2}}</text>{{item2.li3}}
            <text>{{item2.li4}}</text>
          </view>
          <view class="li" v-if="item2.page">{{item2.li5}}</view>
        </view>
        <view style="height:180rpx;background:#fff;"></view>
        <view class="submit-btn" @click.stop="submit">提交</view>
      </block>
    </view>
  </view>
</template>

<script>
const app = getApp();
import {
  shareContent,
  imgHOST,
  Host,
  xhr,
  local,
  allowTypes,
  getUrlParam,
  debounce,
  throttle
} from "@/common/util";
export default {
  data() {
    return {
      imgHOST,
      statusBarHeight: app.globalData.statusBarHeight,
      navigationHeight: app.globalData.navigationHeight,
      tabbarHeight: app.globalData.tabbarHeight,
      screenWidth: app.globalData.screenWidth,
      user: local.get("user"),
      config: {},
      area: [], //province: "", city: "",
      college_name: "",
      campus: "",
      student_id: {
        temp: "",
        upload: ""
      },
      identify_id: {
        temp: "",
        upload: ""
      },
      uploadXHR: {
        student_id: null,
        identify_id: null
      },
      schoolJSON: {}
    };
  },
  computed: {
    schoolList() {
      let list = [];
      if (this.area && this.area.length) {
        list = this.schoolJSON[this.area[0]] || [];
      }

      return list.sort();
    }
  },
  methods: {
    getSchoolJSON() {
      let url = "https://image.grecycle.com.cn/src/sli/config/大学.json",
        data = {};
      xhr.get(url, data, res => {
        if (res.statusCode == 200) {
          this.schoolJSON = res.data;
        }
      });
    },
    getConfig() {
      let url =
          "https://image.grecycle.com.cn/src/sli/config/sli-certification-config.json",
        data = {};

      xhr.get(url, data, res => {
        if (res.statusCode == 200) {
          this.config = res.data;
        }
      });
    },
    checkHasArea() {
      if (!this.area || !this.area.length) {
        return uni.showToast({
          title: "请先选择所在城市",
          icon: "none"
        });
      }
      if (!this.schoolList || !this.schoolList.length) {
        return uni.showToast({
          title: "该城市未找到相关数据",
          icon: "none"
        });
      }
    },
    chooseImg(e) {
      console.log("chooseImg");
      let imgKey = e.currentTarget.dataset.key;

      let url = "/tools/uploadtoken",
        data = {};
      xhr.get(url, data, res => {
        console.log(res);
        if (res.statusCode == 200) {
          let ossJson = res.data;
          ossJson["host"] = ossJson["host"].replace(/^http:/, "https:");

          uni.chooseImage({
            count: 1,
            sizeType: ["compressed"],
            sourceType: ["album", "camera"],
            success: res => {
              let tempFiles = res.tempFiles;

              let limitSize = 3 * 1024 * 1024;
              for (let i = 0; i < tempFiles.length; i++) {
                if (tempFiles[i].size > limitSize) {
                  uni.showToast({
                    title: "图片过大",
                    icon: "none"
                  });
                } else {
                  if (
                    allowTypes.imgs.indexOf(
                      tempFiles[i].path.substring(
                        tempFiles[i].path.lastIndexOf(".")
                      )
                    ) >= 0
                  ) {
                    this[imgKey].temp = tempFiles[i].path;
                  } else {
                    uni.showToast({
                      title: "不支持图片格式",
                      icon: "none"
                    });
                  }
                }
              }

              let file = this[imgKey].temp.replace(/^http:\/\/tmp\//, "");
              let key = ossJson["dir"] + file,
                filename = ossJson["host"] + "/" + key;
              this.uploadXHR[imgKey] = uni.uploadFile({
                header: {},
                url: ossJson["host"],
                filePath: this[imgKey].temp,
                name: "file",
                formData: {
                  key: key,
                  policy: ossJson["policy"],
                  OSSAccessKeyId: ossJson["accessid"],
                  success_action_status: "200", //让服务端返回200，不设置则默认返回204
                  signature: ossJson["signature"],
                  callback: ossJson["callback"]
                },
                success: res => {},
                fail: err => {
                  uni.showToast({
                    title: "放置失败",
                    icon: "none"
                  });
                  this[imgKey].temp = "";
                },
                complete: res => {
                  this.uploadXHR[imgKey] = null;
                  if (String(res.statusCode)[0] == 2) {
                    this[imgKey].temp = "";
                    this[imgKey].upload = filename;
                  } else {
                    this[imgKey].temp = "";
                    uni.showToast({
                      title: "图片放置失败，请重试",
                      icon: "none"
                    });
                  }
                }
              });
            }
          });
        }
      });
    },
    deleteImg(e) {
      let imgKey = e.currentTarget.dataset.key;
      this[imgKey] = {
        temp: "",
        upload: ""
      };
      if (this.uploadXHR[imgKey]) {
        this.uploadXHR[imgKey].abort();
      }
    },
    previewImg(e) {
      let imgKey = e.currentTarget.dataset.key;

      let img = this[imgKey].temp || this[imgKey].upload;

      uni.previewImage({
        current: img,
        urls: [img]
      });
    },
    submit() {
      if (!this.user || this.user.role != "telUser") {
        return uni.navigateTo({
          url: "/pages/my/auth/login"
        });
      }
      if (!String(this.area)) {
        return uni.showToast({
          title: "请选择所在省市",
          icon: "none"
        });
      }
      if (!this.college_name) {
        return uni.showToast({
          title: "请选择",
          icon: "none"
        });
      }
      if (!this.campus) {
        return uni.showToast({
          title: "请填写",
          icon: "none"
        });
      }
      if (!this.student_id.upload) {
        return uni.showToast({
          title: "未放置图片",
          icon: "none"
        });
      }
      if (!this.identify_id.upload) {
        return uni.showToast({
          title: "未放置图片",
          icon: "none"
        });
      }

      let url = "/campus_admin/student_application",
        data = {
          college_name: this.college_name,
          province: this.area[0],
          city: this.area[1] + this.area[2],
          campus: this.campus,
          student_id: this.student_id.upload,
          identify_id: this.identify_id.upload
        };

      uni.showLoading();
      xhr.post(url, data, res => {
        uni.hideLoading();
        if (res.statusCode == 200) {
          uni.showModal({
            title: "提交成功",
            content: "已提交！请耐心等待工作人员进行查看！",
            showCancel: false,
            confirmText: "好哩",
            complete: res => {
              uni.navigateBack();
            }
          });
        }
      });
    },
    previewGZH() {
      let img = imgHOST + "/applyID/公众号-save.jpg";
      uni.previewImage({
        current: img,
        urls: [img]
      });
    }
  },
  watch: {
    area(newVal, oldVal) {
      if (oldVal[0] !== newVal[0]) {
        this.college_name = "";
        this.campus = "";
      }
    }
  },
  mounted() {},
  onLoad(options) {
    if (options.scene) {
      let scene = getUrlParam(
        decodeURIComponent(options.scene).replace(/^\?/, "")
      );
      options = scene;
    }
    this.getSchoolJSON();
    this.getConfig();
  },
  onShow() {
    this.user = local.get("user");
  },
  onShareAppMessage(res) {
    //res.from
    return {
      title: shareContent.schoolTitle,
      imageUrl: shareContent.schoolImg,
      path: "/pages/school/index"
    };
  },
  onShareTimeline(res) {
    return {
      title: shareContent.schoolTitle,
      imageUrl: shareContent.schoolImg,
      path: "/pages/school/index"
    };
  }
};
</script>

<style lang="scss" scoped>
.form {
  padding: 30rpx 60rpx;
  background: #fff;
  .li {
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;
    .label {
      flex-shrink: 0;
      margin-right: 30rpx;
      font-size: 14px;
      font-weight: 500;
    }
    .input {
      flex-grow: 1;
      font-size: 13px;
      overflow: auto;
      padding: 12rpx 30rpx;
      background: #f9f9f9;
      border-radius: 6rpx;
      white-space: nowrap;
      color: #6d9cf8;
    }
  }
}
.id-img-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx 60rpx;
  background: #fff;
  .id-img {
    position: relative;
    width: 300rpx;
    height: 200rpx;
    font-size: 14px;
    text-align: center;
    image {
      width: 100%;
      height: 100%;
      border-radius: 12rpx;
    }
    .loadding {
      position: absolute;
      top: 0;
      left: 0;
    }
    .close {
      position: absolute;
      width: 50rpx;
      height: 50rpx;
      top: -20rpx;
      right: -20rpx;
    }
  }
}
.tip {
  padding: 60rpx;
  background: #fff;
  .title {
    position: relative;
    margin-bottom: 30rpx;
    font-size: 15px;
    font-weight: 500;
    &::after {
      content: "";
      display: block;
      position: absolute;
      bottom: 6rpx;
      width: 100%;
      height: 14rpx;
      border-radius: 8rpx;
      background: rgba(109, 156, 248, 0.4);
    }
  }
  .li {
    position: relative;
    padding-left: 36rpx;
    margin-bottom: 30rpx;
    font-size: 13px;
    color: #666;
    text-align: justify;
    text {
      color: #fd938f;
    }
    &::before {
      content: "";
      display: block;
      position: absolute;
      left: 0;
      top: 10rpx;
      width: 20rpx;
      height: 20rpx;
      background: #6d9cf8;
      border-radius: 50%;
    }
  }
}
.submit-btn {
  position: fixed;
  margin: auto;
  left: 0;
  right: 0;
  bottom: 30rpx;
  width: calc(100% - 120rpx);
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  color: #fff;
  background: #6d9cf8;
  border-radius: 80rpx;
}
</style>
