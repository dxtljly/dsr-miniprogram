<template>
  <view>
    <gl-navbar back home text="发布好物"></gl-navbar>
    <!-- <view v-if="!isSchool" @click="toSchoolAdd" class="toggle-school-container">
      <view class="toggle-school">
        <image mode="widthFix" :src="imgHOST+'/icon/学生需点此发布闲置品.png'" class="txt" />
        <image mode="widthFix" :src="imgHOST+'/icon/arrow-school.gif'" class="arrow" />
      </view>
    </view> -->
    <view class="container">
      <view class="flx fx-middle fx-justify">
        <view>
          添加照片
          <text v-if="uploadImgsLen" style="font-size:18rpx;color:#bbb;">（长按图片可拖拽排序）</text>
        </view>
        <view>{{uploadImgsLen}}/9</view>
      </view>
    </view>
    <!-- <scroll-view v-if="uploadImgsLen" scroll-x>
        <view class="flx fx-middle imgs-content">
          <block v-for="(item,index) in uploadImgs" :key="index">
            <view v-if="item.flag" class="img" inertia :data-index="index">
              <block v-if="!item.upload">
                <image mode="aspectFill" :src="item.temp" />
                <image mode="aspectFill" :src="imgHOST+'/icon/loadding-bubbles-grey.svg'" />
                <view class="loadding-modal"></view>
              </block>
              <image v-if="item.upload" mode="aspectFill" :src="item.upload" />
              <image
                mode="aspectFill"
                :src="imgHOST+'/icon/delete-close.png'"
                class="close"
                @click="deleteImg"
                :data-index="index"
              />
            </view>
          </block>
        </view>
    </scroll-view>-->
    <view
      class="imgs-content"
      :style="'height:'+( (uploadImgsLen > 0 ? Math.ceil( (uploadImgsLen < 9 ? uploadImgsLen+1:9 )/3):1) * 240)+'rpx;'"
    >
      <block v-for="(item,index) in uploadImgs" :key="index">
        <view
          v-if="item.flag"
          class="img"
          :class="{'cur': moveImgsData.cur == index,'zIndex':moveImgsData.curZ == index,'transition':moveImgsData.touch}"
          :style="'transform:translate( '+(moveImgsData.cur == index ? moveImgsData.tranX : imgsData[index].tranX)+'rpx, '+(moveImgsData.cur == index ? moveImgsData.tranY : imgsData[index].tranY)+'rpx) scale('+(moveImgsData.cur == index ? 1.1:1)+');'"
          inertia
          :data-index="index"
          :data-url="item.upload ? item.upload : item.temp"
          @click="previewImg"
          @longpress="moveLongpress"
          @touchmove.stop="touchMoveImg"
          @touchend.stop="touchEndImg"
        >
          <block v-if="!item.upload">
            <image mode="aspectFill" :src="item.temp" />
            <image mode="aspectFill" :src="imgHOST+'/icon/loadding-bubbles-grey.svg'" />
            <view class="loadding-modal"></view>
          </block>
          <image v-if="item.upload" mode="aspectFill" :src="item.upload" />
          <image
            mode="aspectFill"
            :src="imgHOST+'/icon/delete-close.png'"
            class="close"
            @click.stop="deleteImg"
            :data-index="index"
          />
        </view>
      </block>

      <view
        v-if="uploadImgsLen < 9"
        class="img img-add"
        :style="'transform:translate( '+( 240 * (uploadImgsLen - Math.floor(uploadImgsLen/3)*3) )+'rpx, '+ (240 * Math.floor(uploadImgsLen/3)) + 'rpx);'"
        @click="chooseImgs"
      ></view>
    </view>
    <view class="container">
      <view>
        <input
          v-if="!isShowSuccess && !isShowTips"
          v-model="title"
          maxlength="40"
          type="text"
          placeholder="好物标题"
          placeholder-style="color:#bbb;"
          class="title"
        />
        <view v-if="isShowTips" class="title">
          <view v-if="!detail" style="color:#bbb;">详细描述一下好物的规格尺寸、和使用感受吧~</view>
          {{title}}
        </view>
      </view>
      <view style="position:relative;">
        <textarea
          v-if="!isShowSuccess && !isShowTips"
          v-model="detail"
          placeholder="详细描述一下好物的规格尺寸、和使用感受吧~"
          placeholder-style="color:#bbb;"
          maxlength="9999"
          class="textarea"
        ></textarea>
        <view v-else class="textarea">
          <view v-if="!detail" style="color:#bbb;">详细描述一下好物的规格尺寸、和使用感受吧~</view>
          {{detail}}
        </view>
      </view>
      <view class="flx fx-end fx-middle brand_new" @click="toogleBrandNew">
        <view class="radio" :class="{'on':brand_new=='100'}"></view>
        <view>全新商品</view>
      </view>
      <block v-if="isSchool">
        <!-- <view class="flx fx-end fx-middle brand_new fcschool">
          <view>仅限自提</view>
        </view>-->
      </block>
      <block v-else>
        <view class="flx fx-end fx-middle brand_new" @click="tooglePickup">
          <view class="radio" :class="{'on':only_pickup}"></view>
          <view>仅限自提</view>
        </view>
      </block>
      <view class="ul">
        <view v-if="isSchool" class="li">
          <text>商品售价</text>
          <input
            :hidden="isShowTips"
            v-model="show_price"
            type="digit"
            placeholder="仅为展示，平台不接收资金"
            placeholder-style="color:#bbb;"
          />
          <view style="margin-left:20rpx;">￥</view>
        </view>
        <view class="li">
          <text>商品原价</text>
          <input
            :hidden="isShowTips"
            v-model="original_price"
            type="digit"
            placeholder="输入原价"
            placeholder-style="color:#bbb;"
            @blur="checkPrice"
          />
          <view style="margin-left:20rpx;">￥</view>
        </view>
        <view class="li">
          <text>预估重量</text>
          <picker class="fx1" :range="weightRange" :value="weightIndex" @change="bindPickerWeight">
            <view>
              {{weight}}
              <text style="margin-left:20rpx;">kg</text>
            </view>
          </picker>

          <image mode="widthFix" :src="imgHOST+'/icon/arrow.png'" />
        </view>
        <view class="li">
          <text>预估体积</text>
          <input
            v-model="volumeOne"
            type="text"
            dir="rtl"
            placeholder="商品长度"
            placeholder-class="place-holder"
            style="width:200rpx;"
          />
          <input
            v-model="volumeTwo"
            type="text"
            dir="rtl"
            placeholder="商品宽度"
            placeholder-class="place-holder"
            style="width:200rpx;"
          />
          <input
            v-model="volumeThree"
            type="text"
            dir="rtl"
            placeholder="商品高度"
            placeholder-class="place-holder"
            style="width:200rpx;"
          />
        </view>
        <view class="li">
          <text>分类</text>
          <picker
            @click="getTypeList"
            @change="bindPickerType"
            :value="typeIndex"
            :range="typeList"
          >
            <view class="flx fx-middle">
              <view class="fx1">
                <view v-if="typeList[typeIndex]">{{typeList[typeIndex]}}</view>
                <view v-else style="color:#bbb;">选择分类</view>
              </view>
              <image mode="widthFix" :src="imgHOST+'/icon/arrow.png'" />
            </view>
          </picker>
        </view>
        <view class="li">
          <text>发货地址</text>
          <navigator hover-class="none" url="/pages/my/address/list/list" class="flx fx-middle fx1">
            <view class="fx1">
              <view v-if="seller_address">
                <view class="fbold">{{seller_address.name}} {{seller_address.telephone}}</view>
                <view>{{seller_address.place[0]}} {{seller_address.place[1]}} {{seller_address.place[2]}} {{seller_address.detail}}</view>
              </view>
              <view v-else style="color:#bbb;">选择地址</view>
            </view>
            <image mode="widthFix" :src="imgHOST+'/icon/arrow.png'" />
          </navigator>
        </view>
      </view>
    </view>
    <block v-if="banner && banner.length">
      <swiper class="bot-banner" autoplay indicator-dots circular :interval="4000">
        <block v-for="(item,index) in banner" :key="index">
          <swiper-item>
            <navigator
              hover-class="none"
              v-if="item.url || item.path"
              :target="item.target?'miniProgram':'self'"
              :url="item.url"
              :open-type="item.openType"
              :appId="item.appId"
              :path="item.path"
            >
              <image mode="widthFix" :src="item.img" />
            </navigator>
            <image v-else :src="item.img" mode="widthFix" />
          </swiper-item>
        </block>
      </swiper>
    </block>
    <view style="height:200rpx;"></view>
    <view class="btn-submit" :class="{'school':isSchool}" @click="submit">
      <text v-if="!id">让好物循环</text>
      <text v-else>更新好物</text>
    </view>

    <view v-if="isShowSuccess" class="success">
      <view class="bg" @click="closeSuccess"></view>
      <view class="content flx fx-column fx-justify">
        <view>
          <image
            mode="widthFix"
            :src="imgHOST+'/icon/success-icon'+(isSchool ? '-school' : '')+'.png'"
          />
          <view class="txt">{{id?'更新':'发布'}}成功</view>
        </view>
        <block v-if="!isSchool">
          <view class="btn-list" :class="{'school':isSchool}">
            <view class="btn" @click="closeSuccess">继续发布</view>
            <view class="btn outline" @click="toShare">分享好物</view>
          </view>
        </block>
        <block v-else>
          <view class="btn-list" :class="{'school':isSchool}">
            <view class="btn outline" @click="closeSuccess">继续发布</view>
            <navigator hover-class="none" url="/pages/school/invite" class="btn">邀好友，得好礼</navigator>
            <!-- <button open-type="share" data-type="inviteSchool" class="btn">邀好友，得好礼</button> -->
          </view>
        </block>
      </view>
    </view>

    <view v-if="isShowTips" class="modal">
      <view class="bg" @click="closeModal"></view>
      <view class="modal-content z-depth-1">
        <image mode="widthFix" :src="imgHOST+'/detail/售卖须知.png'" />
        <view class="txt-info">
          1、在断舍哩只用上架您最想送的闲置物品，所以售价都是
          <text class="strong">0</text>。<text class="strong">寄送时您无需打包物品，直接给到快递小哥即可</text>;
        </view>
        <view class="txt-info">
          2、领物人拍下后会直接付邮费，所以请您务必认真填写“
          <text class="strong">预估重量</text>”和“
          <text class="strong">所在城市</text>”，以免售后造成不必要的纠纷;
        </view>
        <view class="txt-info">
          3、
          <text class="strong">关注微信公众号，第一时间获得领物人的消息提醒</text>。
        </view>
        <view class="btns-content">
          <view class="btn reject" @click="closeModal" :data-key="true">不再提醒</view>
          <view class="btn accept" @click="saveWeChat">保存公众号二维码</view>
        </view>
        <!-- <view class="modal-title">售卖须知</view>
        <view class="modal-info">
          <view>1.在断舍哩只用上架您最想送的闲置物品就好了，所以售价都是0。</view>
          <view>2.买家拍下后会直接付邮费，所以请您务必认真填写“预估重量”和“所在城市”，以免售后造成不必要的纠纷</view>
        </view>
        <view class="modal-btns flx fx-justify">
          <view class="btn cancel" @click="closeModal">关闭</view>
          <view
            class="btn confirm"
            :class="{'school':isSchool}"
            @click="closeModal"
            :data-key="true"
          >不再提示</view>
        </view>-->
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
  city,
  shareContent
} from "@/common/util";

export default {
  data() {
    return {
      imgHOST,
      user: local.get("user") || null,
      id: null,
      createId: null,
      count: 9,
      uploadImgs: [], //{temp:'',upload:'',flag:true}
      title: "", //商品标题
      detail: "", //商品介绍
      brand_new: "0", //全新商品 '0' '100'
      only_pickup: false,
      show_price: "", //售价  仅为校园版块显示
      original_price: "", //原价
      weight: "", //重量
      weightIndex: -1,
      weightRange: [],
      category: "", //品类
      place: "", //省市区
      hasEdit_seller_address: false,
      seller_address: null,
      if_readd: false, //是否重新上架
      typeIndex: -1,
      typeList: [],
      isShowSuccess: false,
      id: null,
      catsList: [],
      catsid: "",
      catIndex: null,
      isShowTips: false,
      imgsData: [],
      moveImgsData: {
        touch: false,
        cur: -1,
        curZ: -1,
        startX: 0,
        startY: 0,
        tranX: 0,
        tranY: 0,
        curTranX: 0,
        curTranY: 0,
        curKey: -1,
        startKey: -1
      },
      isSchool: false,
      isBook: false,
      banner: [],
      campus_info: null, // {college_name: "",province: "",city: "",campus: ""},
      getCampusXHR: null
    };
  },
  methods: {
    
    initWeightRange() {
      let weightRange = [];
      for (let i = 1; i < 100; i++) {
        weightRange.push(i);
      }
      this.weightRange = weightRange;
    },
    checkImg(file, i, filename) {
      /* uni.uploadFile({
        header: {
          cookie: 'access_token_cookie=' + uni.getStorageSync('access_token')
        },
        url: Host + '/tools/imgcheck',
        filePath: file,
        name: 'file',
        success: res => {
          console.log(res);
        },
        fail: err => {
          uni.showToast({
            title: '上传失败',
            icon: 'none'
          });
          this.uploadImgs[i].flag = false;
        },
        complete: res => {
          console.log('checkImg');
          console.log(res);
          if (res.errMsg == 'uploadFile:ok') {
            this.uploadImgs[i].temp = '';
            this.uploadImgs[i].upload = filename;
          } else {
            this.uploadImgs[i].flag = false;
            uni.showToast({
              title: res.errMsg,
              icon: 'none'
            });
          }
        }
      }); */
      let url = "/tools/imgcheck",
        data = { url: filename };

      xhr.post(url, data, res => {
        console.log(res);
        if (res.statusCode == 204) {
          this.uploadImgs[i].temp = "";
          this.uploadImgs[i].upload = filename;
        } else {
          this.uploadImgs[i].flag = false;
        }
      });
    },
    chooseImgs(e) {
      console.log("chooseImg");
      let url = "/tools/uploadtoken",
        data = {};
      xhr.get(url, data, res => {
        console.log(res);
        if (res.statusCode == 200) {
          let ossJson = res.data;
          ossJson["host"] = ossJson["host"].replace(/^http:/, "https:");
          let count = this.count;
          this.uploadImgs.map((val, index) => {
            count -= this.uploadImgs;
          });
          uni.chooseImage({
            count,
            sizeType: ["compressed"],
            sourceType: ["album", "camera"],
            success: res => {
              let tempFiles = res.tempFiles;
              let fileList = [];
              let limitSize = 1 * 1024 * 1024;
              for (let i = 0; i < tempFiles.length; i++) {
                if (tempFiles[i].size > limitSize) {
                  uni.showToast({
                    title: "图片过大",
                    image: "/static/imgs/error.png"
                  });
                } else {
                  if (
                    allowTypes.imgs.indexOf(
                      tempFiles[i].path.substring(
                        tempFiles[i].path.lastIndexOf(".")
                      )
                    ) >= 0
                  ) {
                    fileList.push(tempFiles[i].path);
                  } else {
                    uni.showToast({
                      title: "不支持图片格式",
                      icon: "none"
                    });
                  }
                }
              }
              if (fileList.length == 0) return false;
              let len = this.uploadImgs.length;
              fileList.map((val, index) => {
                this.uploadImgs.push({
                  flag: true,
                  temp: val,
                  upload: ""
                });
              });

              console.log(len);
              for (let i = len; i < fileList.length + len; i++) {
                let file = fileList[i - len].replace(/^http:\/\/tmp\//, "");
                let key = ossJson["dir"] + file,
                  filename = ossJson["host"] + "/" + key;
                uni.uploadFile({
                  header: {},
                  url: ossJson["host"],
                  filePath: fileList[i - len],
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
                  fail: function(err) {
                    uni.showToast({
                      title: "上传失败",
                      icon: "none"
                    });
                    this.uploadImgs[i].flag = false;
                  },
                  complete: res => {
                    console.log("index:" + i);
                    console.log(res);
                    if (String(res.statusCode)[0] == 2) {
                      this.checkImg(fileList[i - len], i, filename);
                    } else {
                      this.uploadImgs[i].flag = false;
                      uni.showToast({
                        title: "图片上传失败，请重试",
                        icon: "none"
                      });
                    }
                  }
                });
              }
            }
          });
        }
      });
    },
    deleteImg(e) {
      if (this.moveImgsData.touch) return false;
      let index = e.currentTarget.dataset.index;
      let deleteItem = this.uploadImgs[index];
      deleteItem.flag = false;

      this.uploadImgs[index] = deleteItem;
    },
    previewImg(e) {
      let current = e.currentTarget.dataset.url;
      let imgList = [];
      this.uploadImgs.map(v => {
        if (v.flag) {
          imgList.push(v.upload ? v.upload : v.temp);
        }
      });
      console.log(current);
      uni.previewImage({
        current,
        urls: imgList
      });
    },
    getImgsPosition(data, vibrate = true) {
      let imgsData = data.map((v, i) => {
        v.tranX = 240 * (v.key - Math.floor(v.key / 3) * 3);
        v.tranY = 240 * Math.floor(v.key / 3);
        return v;
      });
      this.imgsData = imgsData;

      if (!vibrate) return false;
      uni.vibrateShort();
    },
    initMoveImgs() {
      let imgsData = this.tempUploadImgs.map((v, i) => {
        return {
          key: v.key,
          tranX: 0,
          tranY: 0,
          data: v
        };
      });
      this.imgsData = imgsData;
      this.getImgsPosition(imgsData, false);
    },
    moveLongpress(e) {
      let index = e.currentTarget.dataset.index;
      let key = this.imgsData[index].key;
      let rate = 750 / uni.getSystemInfoSync().windowWidth;
      let startX = e.touches[0].pageX * rate,
        startY = e.touches[0].pageY * rate,
        tranX = 240 * (key - Math.floor(key / 3) * 3),
        tranY = 240 * Math.floor(key / 3);

      this.moveImgsData = {
        touch: true,
        cur: index,
        curZ: index,
        startX,
        startY,
        tranX,
        tranY,
        curTranX: tranX,
        curTranY: tranY,
        startKey: -1
      };
      uni.vibrateShort();
    },
    touchMoveImg(e) {
      if (!this.moveImgsData.touch) return false;

      let rate = 750 / uni.getSystemInfoSync().windowWidth;
      let tranX =
          e.touches[0].pageX * rate -
          this.moveImgsData.startX +
          this.moveImgsData.curTranX,
        tranY =
          e.touches[0].pageY * rate -
          this.moveImgsData.startY +
          this.moveImgsData.curTranY;

      this.moveImgsData.tranX = tranX;
      this.moveImgsData.tranY = tranY;

      let rows = Math.ceil(this.uploadImgsLen / 3) - 1,
        i = Math.round(tranX / 240),
        j = Math.round(tranY / 240);

      i = i > 2 ? 2 : i;
      i = i < 0 ? 0 : i;

      j = j > 2 ? 2 : j;
      j = j < 0 ? 0 : j;

      let startKey = this.imgsData[this.moveImgsData.cur].key,
        endKey = i + j * 3,
        imgsData = [],
        tempImgsData = JSON.parse(JSON.stringify(this.imgsData));

      endKey =
        endKey >= this.uploadImgsLen - 1 ? this.uploadImgsLen - 1 : endKey;

      // 防止拖拽过程中发生乱序问题
      if (startKey == endKey || this.moveImgsData.startKey == startKey) {
        return false;
      }
      this.moveImgsData.startKey = startKey;

      if (startKey < endKey) {
        imgsData = tempImgsData.map((v, i) => {
          if (v.key > startKey && v.key <= endKey) {
            v.key = v.key - 1;
          } else if (v.key == startKey) {
            v.key = endKey;
          }
          return v;
        });
      } else if (startKey > endKey) {
        imgsData = tempImgsData.map((v, i) => {
          if (v.key < startKey && v.key >= endKey) {
            v.key = v.key + 1;
          } else if (v.key == startKey) {
            v.key = endKey;
          }
          return v;
        });
      } else {
        return false;
      }

      this.getImgsPosition(imgsData, true);
    },
    touchEndImg(e) {
      if (!this.moveImgsData.touch) return false;
      this.moveImgsData = {
        touch: false,
        cur: -1,
        curZ: -1,
        startX: 0,
        startY: 0,
        tranX: 0,
        tranY: 0
      };
      let uploadImgs = [],
        validList = [],
        invalidList = [];
      this.imgsData.map((v, i) => {
        let key = v.key,
          index = v.data.index;
        if (v.data.flag) {
          v.data.key = key;
          validList[key] = v.data;
        } else {
          invalidList[index] = v.data;
        }
      });

      //如果有删除的图片 flag=false ，过滤已删除

      if (invalidList.length) {
        let keyIndex = 0;
        for (let i = 0; i < this.uploadImgs.length; i++) {
          console.log(i);
          if (invalidList[i]) {
            uploadImgs[i] = invalidList[i];
          } else {
            uploadImgs[i] = validList[keyIndex];
            keyIndex++;
          }
        }
      } else {
        validList.map((v, i) => {
          uploadImgs[i] = v;
        });
      }
      this.uploadImgs = uploadImgs;
    },
    toogleBrandNew() {
      this.brand_new = this.brand_new == "100" ? "0" : "100";
    },
    tooglePickup() {
      this.only_pickup = !this.only_pickup;
    },
    checkPrice(e) {
      if (
        String(this.original_price)
          .replace(/\./, "")
          .match(/\D+/) ||
        String(this.original_price).match(/\.\d{3,}/)
      ) {
        this.original_price = String(this.original_price)
          .replace(/[^\d.]/g, "")
          .replace(/\.{2,}/g, ".")
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", ".")
          .replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3")
          .replace(/^\./g, "")
          .replace(".$", "00");
        console.log(this.original_price);
      }

      this.original_price = parseFloat(this.original_price);

      if (this.original_price > 9999999999 / 100) {
        uni.showToast({
          title: "价格过大",
          icon: "none"
        });
        this.original_price = 9999999999 / 100;
      } else if (this.original_price < 0) {
        uni.showToast({
          title: "非法价格",
          icon: "none"
        });
        this.original_price = 0;
      }
    },
    checkWeight(e) {
      if (String(this.weight).match(/\D+/)) {
        this.weight = String(this.weight)
          .replace(/[^\d.]/g, "")
          .replace(/\.{2,}/g, ".")
          .replace(".", "$#$")
          .replace(/\./g, "")
          .replace("$#$", ".")
          .replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3")
          .replace(/^\./g, "")
          .replace(".$", "00");
      }
      this.weight = Math.round(this.weight);
      if (this.weight > 999) {
        uni.showToast({
          title: "重量过重",
          icon: "none"
        });
        this.weight = 999;
      } else if (this.weight < 0) {
        uni.showToast({
          title: "非法重量",
          icon: "none"
        });
        this.weight = 0;
      }
    },
    bindPickerWeight(e) {
      this.weight = Number(e.detail.value) + 1;
    },
    bindPickerType(e) {
      this.typeIndex = e.detail.value;
    },
    bindPickerCity(e) {
      this.place = [...e.detail.value];
    },
    volume() {
      return (
        this.catsList[this.catIndex] &&
        this.catsList[this.catIndex].name == "居家日用"
      );
    },
    getTypeList() {
      if (this.typeList.length) {
        return false;
      }
      if (this.catsList && this.catsList.length) {
        return false;
      }
      let url = "/item/cats",
        data = {};

      xhr.get(url, data, res => {
        if (res.statusCode == 200) {
          this.catsList = res.data;
          console.log(this.catsList,"this.catsList");
          if (this.catsid) {
            for (let i = 0; i < this.catsList.length; i++) {
              if (this.catsList[i].id == this.catsid) {
                this.catIndex = i;
                break;
              }
            }
          }
          let typeList = [];
          res.data.map((v, i) => {
            if (this.isSchool) {
              if (["母婴用品", "儿童用品"].indexOf(v.name) >= 0) {
                return false;
              }
            }
            typeList.push(v.name);
          });
          this.typeList = typeList;
          if (this.isBook) {
            this.category = "图书音像";
          }

          setTimeout(() => {
            if (this.category) {
              this.typeIndex = this.typeList.indexOf(this.category);
            }
          }, 1000);
        }
      });
    },
    saveEdit() {
      if (this.isCreateSuccess) {
        return false;
      }
      let goodsAddData = {};

      goodsAddData.uploadImgs = [];
      this.uploadImgs.map((v, i) => {
        if (v.flag && v.upload) {
          goodsAddData.uploadImgs.push(v);
        }
      });
      goodsAddData.title = this.title;
      goodsAddData.detail = this.detail;
      goodsAddData.brand_new = this.brand_new;
      goodsAddData.only_pickup = this.only_pickup;
      goodsAddData.original_price = this.original_price;
      goodsAddData.weight = this.weight;
      goodsAddData.category = this.typeList[this.typeIndex];
      goodsAddData.if_readd = this.if_readd;

      if (this.isSchool) {
        goodsAddData.show_price = this.show_price;
      }

      if (goodsAddData.uploadImgs.length && !this.id) {
        local.set("goodsAddData", goodsAddData);
      } else {
        local.clear("goodsAddData");
      }
    },
    initSaveEdit() {
      if (this.id) {
        return false;
      }
      let goodsAddData = local.get("goodsAddData");
      console.log(goodsAddData);
      if (goodsAddData) {
        this.uploadImgs = goodsAddData.uploadImgs;
        this.title = goodsAddData.title;
        this.detail = goodsAddData.detail;
        this.brand_new = goodsAddData.brand_new;
        this.only_pickup = goodsAddData.only_pickup;
        this.original_price = goodsAddData.original_price;
        this.weight = goodsAddData.weight;
        this.category = goodsAddData.category;
        this.if_readd = goodsAddData.if_readd;

        if (typeof goodsAddData.show_price !== "undefined") {
          this.show_price = goodsAddData.show_price;
          this.isSchool = true;
        }

        if (!goodsAddData.rePutaway) {
          uni.showModal({
            title: "提示",
            content: "您有未编辑完成的内容，是否继续？",
            success: res => {
              console.log(res);
              if (res.confirm) {
              } else if (res.cancel) {
                this.initEdit();
              }
            }
          });
        }
      }
    },
    initEdit(flag) {
      this.uploadImgs = [];
      this.title = "";
      this.detail = "";
      this.brand_new = "0";
      this.original_price = "";
      this.weight = "";
      if (!flag) {
        this.only_pickup = false;
        this.category = "";
        this.typeIndex = -1;
        this.place = "";
      }
      local.clear("goodsAddData");
    },
    showSuccess() {
      this.isShowSuccess = true;
    },
    closeSuccess() {
      this.id = null;
      this.isShowSuccess = false;
    },
    submit() {
      if (local.get("user").role != "telUser") {
        return uni.showToast({
          title: "请先登录",
          icon: "none",
          success: res => {
            setTimeout(() => {
              uni.navigateTo({
                url: "/pages/my/auth/login"
              });
            }, 1500);
          }
        });
      }
      if (local.get("user").ad_level == 5 || local.get("user").ad_level >= 6) {
        return uni.showModal({
          title: "警告",
          content: "很抱歉，由于您存在违规操作，已被禁止发布/更新好物",
          showCancel: false,
          success: res => {}
        });
      }

      if (!this.seller_address) {
        return uni.showToast({
          title: "缺少发货地址",
          icon: "none"
        });
      }
      const volumeStr = [this.volumeOne,this.volumeTwo,this.volumeThree];
      let volume =  Object.keys(volumeStr).map(key => {
        console.log(volumeStr);
        return volumeStr[key];
      });
      let 
      let url = "/item/",
        data = {
          pic: [],
          title: this.title,
          detail: this.detail,
          brand_new: this.brand_new,
          original_price: Math.round(this.original_price * 100),
          weight: this.weight,
          category: this.typeList[this.typeIndex],
          place: this.seller_address.place,
          only_pickup: this.only_pickup,
          seller_address: this.seller_address,
          if_readd: this.if_readd,
          volume: volume
        };
      if (this.isSchool) {
        data.only_pickup = true;
        data.show_price = Math.round(this.show_price * 100);

        if (!this.campus_info) {
          if (!this.getCampusXHR) {
            this.getCollege();
          }
          return uni.showLoading({
            title: "初始化学校信息中···"
          });
        } else {
          data.campus_info = this.campus_info;
        }
      }
      this.uploadImgs.map((v, i) => {
        if (v.flag && v.upload) {
          data.pic.push(v.upload);
        }
      });
      console.log(data);
      // if (this.volumeOne < 1) {
      //   return uni.showToast({
      //     title: "请输入真实长度",
      //     icon: "none"
      //   });
      // }
      // if (this.volumeTwo < 1) {
      //   return uni.showToast({
      //     title: "请输入真实宽度",
      //     icon: "none"
      //   });
      // }
      // if (this.volumeThree < 1) {
      //   return uni.showToast({
      //     title: "请输入真实高度",
      //     icon: "none"
      //   });
      // }
      if (!data.pic.length) {
        return uni.showToast({
          title: "缺少商品图片",
          icon: "none"
        });
      }
      if (!data.title) {
        return uni.showToast({
          title: "缺少好物标题",
          icon: "none"
        });
      }
      if (data.title.length < 2) {
        return uni.showToast({
          title: "好物标题过短",
          icon: "none"
        });
      }
      if (data.title.length > 40) {
        return uni.showToast({
          title: "好物标题过长",
          icon: "none"
        });
      }
      if (String(data.original_price).replace(/\s/g, "") == "") {
        return uni.showToast({
          title: "缺少原价",
          icon: "none"
        });
      }
      if (String(data.weight).replace(/\s/g, "") <= 0) {
        return uni.showToast({
          title: "缺少重量",
          icon: "none"
        });
      }
      if (!data.category) {
        return uni.showToast({
          title: "缺少分类",
          icon: "none"
        });
      }
      if (!data.place) {
        return uni.showToast({
          title: "缺少所在区域",
          icon: "none"
        });
      }
      uni.showLoading({
        title: "提交中",
        mask: true
      });
      if (!this.id) {
        xhr.post(url, data, res => {
          uni.hideLoading();
          if (String(res.statusCode)[0] == 2) {
            this.createId = res.data;
            this.isShowSuccess = true;
            this.initEdit(true);
            uni.requestSubscribeMessage({
              tmplIds: [
                "dsVZwx5r7s5YbqGXXpGDL5sm5zOWhDIl-5-AOPqMF_k",
                "_nkzpELZ8sSdLIatERaLUsoDumj2D-smcJ9dPplBAjQ",
                "VcBdvKNx5vdxvKEiWFC1jolgxUHYT1nVQR8iWDDcxeY"
              ],
              success: res => {},
              fail: err => {},
              complete() {}
            });
          }
        });
      } else {
        data.id = this.id;
        xhr.put(url, data, res => {
          uni.hideLoading();
          if (String(res.statusCode)[0] == 2) {
            this.isShowSuccess = true;
            this.initEdit(true);
            uni.requestSubscribeMessage({
              tmplIds: [
                "dsVZwx5r7s5YbqGXXpGDL5sm5zOWhDIl-5-AOPqMF_k",
                "_nkzpELZ8sSdLIatERaLUsoDumj2D-smcJ9dPplBAjQ",
                "VcBdvKNx5vdxvKEiWFC1jolgxUHYT1nVQR8iWDDcxeY"
              ],
              success: res => {},
              fail: err => {},
              complete() {}
            });
          }
        });
      }
    },
    toShare() {
      uni.navigateTo({
        url: `/pages/goods/detail/detail?id=${
          this.id ? this.id : this.createId
        }&showShare=1${this.isSchool ? "&school=1" : ""}`
      });
      this.closeSuccess();
    },
    getDetail() {
      let url = "/item/" + this.id,
        data = {};
      uni.showLoading({
        mask: true
      });
      xhr.get(url, data, res => {
        console.log(res);
        if (res.statusCode == 200) {
          uni.hideLoading();
          let uploadImgs = [];
          res.data.pic.map((v, i) => {
            uploadImgs.push({
              flag: true,
              temp: "",
              upload: v
            });
          });
          this.uploadImgs = uploadImgs;
          this.title = res.data.title;
          this.detail = res.data.detail;
          this.brand_new = res.data.brand_new;
          this.only_pickup = res.data.only_pickup;
          this.original_price = Math.round(res.data.original_price / 100);
          this.weight = res.data.weight;
          this.weightIndex = res.data.weight - 1;
          this.category = res.data.category;
          this.seller_address = res.data.seller_address;
          this.if_readd = res.data.if_readd;

          if (typeof res.data.show_price !== "undefined") {
            this.isSchool = true;
            this.show_price = Math.round(res.data.show_price / 100);
          }

          setTimeout(() => {
            if (!this.typeIndex == -1) {
              this.typeIndex = this.typeList.indexOf(this.category);
            }
          }, 1000);
        }
      });
    },
    showTips() {
      if (local.get("newJson").showSellTips) {
        return false;
      }
      if (!this.isSchool) {
        this.isShowTips = true;
      }
    },
    closeModal(e) {
      if (e.currentTarget.dataset.key) {
        let newJson = { ...local.get("newJson") };
        newJson.showSellTips = true;
        console.log(newJson);
        local.set("newJson", newJson);
      }
      this.isShowTips = false;
    },
    getSellerAddress() {
      if (this.id && !this.hasEdit_seller_address) {
        this.hasEdit_seller_address = true;
      } else if (local.get("chooseAddress")) {
        this.seller_address = local.get("chooseAddress");
      } else if (local.get("defaultAddress")) {
        this.seller_address = local.get("defaultAddress");
      }
    },
    checkUser() {
      let url = "/user/",
        data = {};
      xhr.get(url, data, res => {
        console.log(res);
        if (String(res.statusCode)[0] == 2) {
          local.set("user", res.data);
          this.user = res.data;
          console.log(res.data);
        }
      });
    },
    // toSchoolAdd() {
    //   if (this.user && this.user.is_student) {
    //     this.toggleSchoolAdd();
    //   } else {
    //     this.checkApply();
    //   }
    // },
    toggleSchoolAdd() {
      this.isSchool = true;
      let typeList = [];
      this.typeList.forEach((v, i) => {
        if (["母婴用品", "儿童用品"].indexOf(v) >= 0) {
          return false;
        }
        typeList.push(v);
      });
      this.typeList = typeList;
      this.typeIndex = -1;
    },
    saveWeChat() {
      uni.showLoading({ title: "保存中···" });
      uni.getImageInfo({
        src: this.imgHOST + "/detail/保存下来图.png",
        success: res => {
          console.log(res);
          uni.hideLoading();
          uni.saveImageToPhotosAlbum({
            filePath: res.path,
            success: res => {
              uni.showToast({
                title: "保存成功"
              });
              setTimeout(function() {
                this.isShowModal = false;
              }, 1300);
            },
            fail: err => {
              if (
                err.errMsg == "saveImageToPhotosAlbum:fail auth deny" ||
                err.errMsg ==
                  "saveImageToPhotosAlbum:fail authorize no response"
              ) {
                uni.showToast({
                  title: "获取授权保存图片",
                  icon: "none"
                });
                setTimeout(function() {
                  uni.navigateTo({
                    url: "/pages/my/auth/auth?scope=writePhotosAlbum"
                  });
                }, 1300);
              }
            }
          });
        }
      });
    },
    getConfig() {
      let url =
          "https://www.grecycle.com.cn/src/sli/config/sli-add-config.json",
        data = {};

      xhr.get(url, data, res => {
        if (res.statusCode == 200) {
          this.banner = res.data.banner;
        }
      });
    },
    getCollege() {
      let url = "/campus_admin/student_application_status",
        data = {};

      this.getCampusXHR = xhr.get(url, data, res => {
        this.getCampusXHR = null;
        uni.hideLoading();
        if (res.statusCode == 200) {
          this.isCampusSearch = true;
          this.campus_info = {
            college_name: res.data.college_name,
            province: res.data.province,
            city: res.data.city,
            campus: res.data.campus
          };
        }
      });
    }
  },
  watch: {
    uploadImgs: {
      deep: true,
      handler(val, oldVal) {}
    },
    tempUploadImgs: {
      deep: true,
      handler(val, oldVal) {
        this.initMoveImgs();
      }
    }
  },
  computed: {
    uploadImgsLen() {
      let uploadImgsLen = 0;
      this.uploadImgs.map((v, i) => {
        v.index = i;
        if (v.flag) {
          uploadImgsLen++;
        } else {
          v.key = null;
        }
      });
      return uploadImgsLen;
    },
    tempUploadImgs() {
      let uploadImgsLen = 0,
        tempUploadImgs = [];
      this.uploadImgs.map((v, i) => {
        v.index = i;
        if (v.flag) {
          v.key = uploadImgsLen;
          uploadImgsLen++;
        } else {
          v.key = null;
        }
        tempUploadImgs.push(v);
      });
      return tempUploadImgs;
    }
  },
  beforeMount() {
    this.initSaveEdit();
  },
  beforeDestroy() {
    this.saveEdit();
  },
  onLoad(options) {
    this.initWeightRange();
    if (options.school) {
      this.isSchool = true;
      this.only_pickup = true;
    }
    if (options.book) {
      this.isBook = true;
    }

    if (options.id) {
      this.id = options.id;
      this.getDetail();
    } else {
      this.showTips();
      if (options.if_readd) {
        this.if_readd = true;
      }
    }

    this.getTypeList();
    this.getConfig();
  },
  onShow() {
    this.getSellerAddress();
    this.user = local.get("user") || null;

    if (!this.campus_info) {
      this.getCollege();
    }
  },
  onUnload() {
    local.clear("chooseAddress");
  },
  onShareAppMessage(res) {
    //res.from
    let inviterId = local.get("user").id;
    console.log(res);
    if (res.from == "button") {
      if (res.target.dataset.type == "inviteSchool") {
        return {
          title: "让好物循环",
          path: "/pages/school/index?inviterId=" + inviterId,
          imageUrl: this.imgHOST + "/share-school.png",
          success(res) {
            uni.showToast({
              title: "分享成功"
            });
          }
        };
      }
    }
    return {
      title: this.isSchool ? "让好物循环" : "一个只送不卖的闲置分享平台",
      imageUrl:
        this.imgHOST + "/share" + this.isSchool ? "-school" : "" + ".png",
      path: "/pages/index/index"
    };
  },
  onShareTimeline(res) {
    return {
      title: this.isSchool ? "让好物循环" : "一个只送不卖的闲置分享平台",
      imageUrl:
        this.imgHOST + "/share" + this.isSchool ? "-school" : "" + ".png",
      path: "/pages/index/index"
    };
  }
};
</script>
<style lang="scss" scoped>
.container {
  padding: 30rpx $page-offset 0;
  background-color: #fff;
  font-size: 15px;
}
.imgs-content {
  position: relative;
  width: 100%;
  padding: 20rpx 0 0 30rpx;
  background-color: #fff;
  box-sizing: border-box;
  .img {
    display: block;
    position: absolute;

    width: 210rpx;
    height: 210rpx;
    margin-right: 30rpx;
    margin-bottom: 30rpx;
    &.transition {
      transition: 0.3s;
    }
    &.on::after {
      content: "封面";
      display: block;
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 36rpx;
      line-height: 36rpx;
      font-size: 20rpx;
      color: #fff;
      text-align: center;
      background-color: rgba(51, 51, 51, 0.7);
    }
    &.cur {
      transition: initial;
    }
    &.zIndex {
      z-index: 2;
    }
    image {
      display: block;
      position: absolute;
      width: inherit;
      height: inherit;
      &.close {
        top: -10rpx;
        right: -10rpx;
        width: 40rpx;
        height: 40rpx;
      }
    }
    .loadding-modal {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(51, 51, 51, 0.3);
    }
  }
}
.img-add {
  position: relative;
  flex-shrink: 0;
  background-color: #f3f3f3;

  &::before,
  &::after {
    content: "";
    display: block;
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border: 1px solid #bbb;
  }

  &::before {
    width: 56rpx;
    height: 0;
  }

  &::after {
    width: 0;
    height: 56rpx;
  }
}

.title {
  padding: 20rpx 0;
  border-top: 1px solid #f9f9f9;
  border-bottom: 1px solid #f9f9f9;
}
.textarea {
  width: 100%;
  height: 300rpx;
  padding: 20rpx 0;
  line-height: 1.5;
  box-sizing: border-box;
}
.brand_new {
  padding: 20rpx 0;
  font-size: 24rpx;
  .radio {
    margin-right: 10rpx;
    width: 26rpx;
    height: 26rpx;
    border-radius: 50%;
    border: 1px solid #d8d8d8;

    &.on {
      background-color: #ff5e41;
    }
  }
}
.ul {
  .li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 0;
    border-top: 1px solid #f9f9f9;

    text {
      width: 140rpx;
      padding-right: 20rpx;
    }

    input,
    picker {
      flex-grow: 1;
      text-align: right;
    }
    image {
      width: 30rpx;
      height: 30rpx;
      padding-left: 20rpx;
    }
  }
}

.btn-submit {
  position: fixed;
  margin: auto;
  left: 0;
  right: 0;
  bottom: 60rpx;
  width: 564rpx;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  color: #fff;
  border-radius: 44rpx;
  background-color: $main-color;
  &.school {
    background-color: $school-main-color;
  }
}

.success {
  position: fixed;
  z-index: 999;
  top: 0;
  width: 100%;
  height: 100%;
  .bg {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(51, 51, 51, 0.5);
  }

  .content {
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 440rpx;
    height: 480rpx;
    border-radius: 20rpx;
    padding: 50rpx 70rpx;
    box-sizing: border-box;
    text-align: center;
    background-color: #fff;

    image {
      width: 80rpx;
      height: 80rpx;
    }
    .txt {
      font-weight: bold;
    }

    .btn-list {
      .btn {
        margin-top: 20rpx;
        width: 100%;
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
        font-size: 28rpx;
        color: #fff;
        border-radius: 40rpx;
        background-color: $main-color;
        border: 1px solid $main-color;
        &.outline {
          color: $main-color;
          background-color: #fff;
        }
      }
      &.school {
        .btn {
          background-color: $school-main-color;
          border: 1px solid $school-main-color;
          &.outline {
            color: $school-main-color;
            background-color: #fff;
          }
        }
      }
    }
  }
}

.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(51, 51, 51, 0.4);
  }
  .modal-content {
    z-index: 9;
    width: 600rpx;
    border-radius: 18rpx;
    background-color: #fff;
    padding-bottom: 60rpx;
    box-sizing: border-box;
    image {
      display: block;
      width: 100%;
      height: 60rpx;
      border-top-left-radius: 18rpx;
      border-top-right-radius: 18rpx;
    }
    .txt-info {
      margin-bottom: 30rpx;
      font-size: 15px;
      color: #666;
      font-weight: 300;
      padding: 0 50rpx;

      .strong {
        color: #333;
        font-weight: 500;
      }
    }
    .btns-content {
      display: flex;
      justify-content: space-between;
      margin-top: 60rpx;
      padding: 0 50rpx;
      .btn {
        padding: 16rpx 14rpx;
        white-space: nowrap;
        border-radius: 60rpx;
        font-weight: 300;
        font-size: 15px;
        &.reject {
          color: #666;
          border: 1px solid #666;
        }
        &.accept {
          color: #fff;
          background: $main-color;
          border: 1px solid $main-color;
        }
      }
    }
  }

  // .modal-content {
  //   position: relative;
  //   z-index: 999999999999999;
  //   margin: auto;
  //   top: 460rpx;
  //   width: 600rpx;
  //   background-color: #fff;
  //   border-radius: 10rpx;
  //   .modal-title {
  //     padding-top: 30rpx;
  //     text-align: center;
  //     font-size: 36rpx;
  //     font-weight: bold;
  //   }
  //   .modal-info {
  //     padding: 30rpx 30rpx 40rpx;
  //     font-size: 28rpx;
  //     color: #333;
  //     text-align: justify;
  //     view {
  //       margin-bottom: 20rpx;
  //     }
  //   }
  //   .modal-btns {
  //     text-align: center;
  //     height: 80rpx;
  //     line-height: 80rpx;
  //     border-top: 1px solid #f3f3f3;
  //     .btn {
  //       width: 50%;
  //     }
  //     .cancel {
  //       color: #bbb;
  //       border-right: 1px solid #f3f3f3;
  //     }
  //     .confirm {
  //       color: $main-color;
  //       &.school {
  //         color: $school-main-color;
  //       }
  //     }
  //   }
  // }
}

.toggle-school-container {
  border-top: 1px solid #dfdfdf;
  background-color: #fff;
  padding: $page-offset $page-offset 0;
  .toggle-school {
    padding: 18rpx 40rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 12rpx;
    background-color: rgba(109, 156, 248, 0.2);
    .txt {
      width: 320rpx;
      height: 0;
    }
    .arrow {
      width: 40rpx;
      height: 0;
    }
  }
}

.bot-banner {
  position: relative;
  margin: 30rpx auto;
  height: 166rpx;
  text-align: center;

  navigator {
    width: 100%;
  }
  image {
    width: 690rpx;
  }
}
</style>