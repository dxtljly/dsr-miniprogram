<template>
  <view style="height:100%;">
    <gl-navbar back home text="已下架"></gl-navbar>
      <goods-list :list="list" :isLastPage="isLastPage" :isUpdate="!otherUser"></goods-list>
    <canvas
      canvas-id="shareImage"
      style="width:500px;height:400px;position:absolute;top:100px;transform:translateX(-100%);"
    ></canvas>
  </view>
</template>
<script>
const app = getApp();
import { imgHOST, xhr, allowTypes, local, shareContent } from "@/common/util";
export default {
  data() {
    return {
      imgHOST: this.$common.util.imgHOST,
      statusBarHeight: app.globalData.statusBarHeight,
      navigationHeight: app.globalData.navigationHeight,
      user: local.get("user"),
      navbarOn: true,
      rows: 10,
      skip: 0,
      list: [],
      itemIdList: [],
      isLastPage: false,
      isLoadEnd: true,
      otherUser: null,
      shareImage: imgHOST + "/share.png",
      loadImgs: {},
      tempImgs: {}
    };
  },
  methods: {
    scroll(e) {
      if (e.detail.scrollTop > 30) {
        this.navbarOn = false;
      } else {
        this.navbarOn = true;
      }
    },
    getList(e) {
      if (!this.isLoadEnd || this.isLastPage) {
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
          own: 2,
          status: "2-2,2-1"
        };
      if (this.otherUser) {
        data.own = this.otherUser.id;
        data.status = "1";
      }

      xhr.get(url, data, res => {
        this.isLoadEnd = true;
        if (res.statusCode == 200) {
          res.data.items.forEach(v => {
            if (this.itemIdList.indexOf(v.id) < 0) {
              this.list.push(v);
              this.itemIdList.push(v.id);
            }
          });
	  console.log(this.list,'this.list');
          if (res.data.items.length < 10) {
            this.isLastPage = true;
          }
          if (this.list.length && this.list.length <= 10) {
            this.getSaveImgPath();
          }
        }
      });
    },
    getSaveImgPath() {
      if (this.list.length == 1) {
        this.loadImgs.k1 = this.list[0].pic[0].replace(/^http/, "https");
      } else if (this.list.length == 2) {
        this.loadImgs.k1 = this.list[0].pic[0].replace(/^http/, "https");
        this.loadImgs.k2 = this.list[1].pic[0].replace(/^http/, "https");
      } else {
        this.loadImgs.k1 = this.list[0].pic[0].replace(/^http/, "https");
        this.loadImgs.k2 = this.list[1].pic[0].replace(/^http/, "https");
        this.loadImgs.k3 = this.list[2].pic[0].replace(/^http/, "https");
      }
      let _this = this;
      function getTempImgs() {
        let tempImgs = {},
          keys = [],
          promiseFn = [];
        for (let k in _this.loadImgs) {
          keys.push(k);
          let fn = new Promise(function(resolve, reject) {
            uni.getImageInfo({
              src: _this.loadImgs[k],
              success(res) {
                resolve(res);
              },
              fail(err) {
                console.log(_this.loadImgs[k]);
                reject(err);
              }
            });
          });
          promiseFn.push(fn);
        }
        Promise.all(promiseFn).then(res => {
          res.map((val, index) => {
            tempImgs[keys[index]] = val;
          });

          _this.tempImgs = tempImgs;
          _this.drawCanvas();
        });
      }

      getTempImgs();
    },
    drawCanvas() {
      if (this.list.length <= 0) {
        return false;
      }
      let ctx = uni.createCanvasContext("shareImage");
      ctx.setFillStyle("#fff");
      ctx.fillRect(0, 0, 500, 400);
      if (this.list.length == 1) {
        var dx = 0,
          dy = 0,
          dW = 500,
          dH = 400,
          ratio = 5 / 4,
          sx = 0,
          sy = 0,
          sW = this.tempImgs.k1.width,
          sH = this.tempImgs.k1.height;
        if (this.tempImgs.k1.width / this.tempImgs.k1.height > ratio) {
          sW = sH * ratio;
          sx = (this.tempImgs.k1.width - sW) / 2;
        } else {
          sH = sW / ratio;
          sy = (this.tempImgs.k1.height - sH) / 2;
        }
        ctx.drawImage(this.tempImgs.k1.path, sx, sy, sW, sH, dx, dy, dW, dH);
      } else if (this.list.length == 2) {
        var dx = 0,
          dy = 0,
          dW = 245,
          dH = 400,
          ratio = 245 / 4,
          sx = 0,
          sy = 0,
          sW = this.tempImgs.k1.width,
          sH = this.tempImgs.k1.height;
        if (this.tempImgs.k1.width / this.tempImgs.k1.height > ratio) {
          sW = sH * ratio;
          sx = (this.tempImgs.k1.width - sW) / 2;
        } else {
          sH = sW / ratio;
          sy = (this.tempImgs.k1.height - sH) / 2;
        }
        ctx.drawImage(this.tempImgs.k1.path, sx, sy, sW, sH, dx, dy, dW, dH);
        var dx = 255,
          dy = 0,
          dW = 255,
          dH = 400,
          ratio = 2.45 / 4,
          sx = 0,
          sy = 0,
          sW = this.tempImgs.k2.width,
          sH = this.tempImgs.k2.height;
        if (this.tempImgs.k2.width / this.tempImgs.k2.height > ratio) {
          sW = sH * ratio;
          sx = (this.tempImgs.k2.width - sW) / 2;
        } else {
          sH = sW / ratio;
          sy = (this.tempImgs.k2.height - sH) / 2;
        }
        ctx.drawImage(this.tempImgs.k2.path, sx, sy, sW, sH, dx, dy, dW, dH);
      } else {
        var dx = 0,
          dy = 0,
          dW = 245,
          dH = 400,
          ratio = 2.45 / 4,
          sx = 0,
          sy = 0,
          sW = this.tempImgs.k1.width,
          sH = this.tempImgs.k1.height;
        if (this.tempImgs.k1.width / this.tempImgs.k1.height > ratio) {
          sW = sH * ratio;
          sx = (this.tempImgs.k1.width - sW) / 2;
        } else {
          sH = sW / ratio;
          sy = (this.tempImgs.k1.height - sH) / 2;
        }
        ctx.drawImage(this.tempImgs.k1.path, sx, sy, sW, sH, dx, dy, dW, dH);
        var dx = 255,
          dy = 0,
          dW = 245,
          dH = 195,
          ratio = 2.45 / 1.95,
          sx = 0,
          sy = 0,
          sW = this.tempImgs.k2.width,
          sH = this.tempImgs.k2.height;
        if (this.tempImgs.k2.width / this.tempImgs.k2.height > ratio) {
          sW = sH * ratio;
          sx = (this.tempImgs.k2.width - sW) / 2;
        } else {
          sH = sW / ratio;
          sy = (this.tempImgs.k2.height - sH) / 2;
        }
        ctx.drawImage(this.tempImgs.k2.path, sx, sy, sW, sH, dx, dy, dW, dH);
        var dx = 255,
          dy = 205,
          dW = 245,
          dH = 195,
          ratio = 2.45 / 1.95,
          sx = 0,
          sy = 0,
          sW = this.tempImgs.k3.width,
          sH = this.tempImgs.k3.height;
        if (this.tempImgs.k3.width / this.tempImgs.k3.height > ratio) {
          sW = sH * ratio;
          sx = (this.tempImgs.k3.width - sW) / 2;
        } else {
          sH = sW / ratio;
          sy = (this.tempImgs.k3.height - sH) / 2;
        }
        ctx.drawImage(this.tempImgs.k3.path, sx, sy, sW, sH, dx, dy, dW, dH);
      }
      ctx.draw(true, () => {
        uni.canvasToTempFilePath({
          canvasId: "shareImage",
          success: res => {
            this.shareImage = this.list[0].pic[0];
            let tempFilePath = res.tempFilePath;

            let url = "/tools/uploadtoken",
              data = {};
            xhr.get(url, data, res => {
              console.log(res);
              if (res.statusCode == 200) {
                let ossJson = res.data;
                ossJson["host"] = ossJson["host"].replace(/^http:/, "https:");
                console.log(ossJson);
                let file = tempFilePath.replace(/^http:\/\/tmp\//, "");
                let key = ossJson["dir"] + "publishShareCard/" + file,
                  filename = ossJson["host"] + "/" + key;
                uni.uploadFile({
                  header: {},
                  url: ossJson["host"],
                  filePath: tempFilePath,
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
                  fail: function(err) {},
                  complete: res => {
                    if (String(res.statusCode)[0] == 2) {
                      this.shareImage = filename;
                    }
                  }
                });
              }
            });
          }
        });
      });
    }
  },
  onLoad(options) {
    if (options.id && options.id != local.get("user").id) {
      this.otherUser = options;
    }
    this.getList();
  },
  onShow() {},
  onShareAppMessage(res) {
    let user = this.otherUser ? this.otherUser : this.user;
    //res.from
    return {
      title: `${user.nickName} 上架了${this.list.length}件免费商品`,
      imageUrl: this.shareImage,
      path: `/pages/my/goods/publish/publish?id=${user.id}&nickName=${user.nickName}&avatarUrl=${user.avatarUrl}`
    };
  },
  onShareTimeline(res) {
    let user = this.otherUser ? this.otherUser : this.user;
    //res.from
    return {
      title: `${user.nickName} 上架了${this.list.length}件免费商品`,
      imageUrl: this.shareImage,
      path: `/pages/my/goods/publish/publish?id=${user.id}&nickName=${user.nickName}&avatarUrl=${user.avatarUrl}`
    };
  }
};
</script>
<style lang="scss" scoped>
</style>