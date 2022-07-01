<template>
  <view style="height:100%;">
    <gl-navbar back home text="常见问题"></gl-navbar>
    <scroll-view
      scroll-y
      enable-back-to-top
      :scroll-into-view="scrollToId"
      :style="'height:calc(100% - ' + ( statusBarHeight + navigationHeight) + 'px); '"
    >
      <view class="container">
        <block v-for="(item,index) in FAQ" :key="index">
          <view
            class="li"
            :id="'FAQ-'+(index+1)"
            :class="{'borbot':index < FAQ.length-1}"
            @click="change"
            :data-index="index"
          >
            <view class="title flx fx-middle fx-justify">
              <view
                class="icon"
                :style="'background-image:url('+imgHOST+'/icon/FAQ-icon.png);'"
              >Q{{index+1}}</view>
              <view class="fx1">{{item.title}}</view>
              <view class="arrow" :class="{'on':current == index}"></view>
            </view>
            <view v-if="current == index" class="content flx">
              <view class="icon"></view>
              <view>{{item.content}}</view>
            </view>
          </view>
        </block>
      </view>
      <view class="tx-center" style="margin-top:40rpx;">
        <image mode="widthFix" :src="imgHOST+'/icon/感谢您对绿色环保事业.png'" style="width:80%;height:0;" />
      </view>
      <view style="height:160rpx;"></view>
    </scroll-view>
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
  shareContent
} from "@/common/util";
export default {
  data() {
    return {
      imgHOST,
      statusBarHeight: app.globalData.statusBarHeight,
      navigationHeight: app.globalData.navigationHeight,
      current: 0,
      FAQ: [
        {
          title: "断舍哩是什么？",
          content:
            "断舍哩是一款倡导环保理念，帮助大家进行断舍离，体验极简生活乐趣的闲置分享平台。"
        },

        {
          title: "断舍哩包含哪些品类的产品？",
          content: "所有品类，均可以放置在断舍哩上进行赠送。"
        },
        {
          title: "校园专区是什么？",
          content:
            "断舍哩专为全国学生开设的处理闲置的版块，为适应学生的需求，此版块可出售有价的闲置物品，但发布的闲置物品默认为自提。\n\n因校园专区内大部分为有价商品，为确保交易的真实性、可靠性和安全性，专区内发布闲置需要进行实名身份认证。进行认证后，同一所学校的学生可以更方便地进行自提交易。"
        },
        {
          title: "为什么大部分商品都是免费的？",
          content:
            "断舍哩上最大的特点就是所有物品只送不卖。卖家可以轻松送出自己的闲置物品，买家可免费获得想要的物品，让不可再生的有限资源得到最大限度的循环再利用。\n\n经过身份认证的学生用户，可在“校园专区”出售有价的闲置物品。"
        },
        {
          title: "如何在断舍哩上赠送商品？",
          content:
            "您只需将想赠送出去的闲置物品，拍照后上传至平台即可。无任何费用（运费也有买家承担），无聊天功能（大大降低时间成本），也无需提供任何售后服务（因为商品本身就是免费的）。操作轻松，简单方便。"
        },
        {
          title: "如何在断舍哩上申领物品？",
          content:
            "对于中意的免费物品，您可以直接在平台下单申领（目前每日每个账户仅限申领一次，但可申领一位用户名下的多件物品；每7天申领上限为3次），但需要承担运费。\n\n自提商品需与买家沟通。"
        },
        {
          title: "关于运费",
          content:
            "免费物品如需快递，运费将由买家承担，且买家在下单时已预付邮费给快递公司；卖家在接到发货通知时，可直接通过断舍哩平台，免费呼叫快递小哥上门收件，此时卖家不需要再额外支付运费。其他非免费商品及自提商品，是否快递及运费由哪方承担，请买卖双方自行协商确定。"
        },
        {
          title: "付了邮费后对方迟迟不发货怎么办？",
          content:
            "对方若在120小时之内不发货的话，邮费会自动按原路返还给您。若无到账，请联系客服返还邮费。"
        },
        {
          title: "收到与照片不符的商品怎么办？",
          content:
            "如果有卖家恶意发货或其他恶劣违规情况，您可向平台申诉举报，经核实后，平台会对卖家进行警告、账号限制或封禁处理。断舍哩的初衷就是为了提倡环保的理念，请各位用户遵守诚实守信的交易原则，维护平台良好氛围，感谢您的配合！"
        },
        {
          title: "为什么邮费比市面上的贵？",
          content:
            "运费收取标准按物品预估重量多加3公斤计算，多退少补。多收的款项会在快递师傅上门取件确认实际运费后，按原路退回（具体运费可参考德邦快递官网）。没有收到退款的用户，有可能实际重量的邮费超过已付款，需要补交运费"
        },
        {
          title: "如何退换货？",
          content:
            "因为断舍哩是含有公益性质的纯赠送平台，目前不支持退换货，望请理解！"
        },
        {
          title: "断舍哩社区公约",
          content:
            "为了维护良好的社区氛围，保障广大普通用户的权益，断舍哩特制定以下社区公约，请大家积极遵守：\n\n" +
            "1、咕哩是一个主打免费赠送闲置的社区，反对经营性行为，所以禁止在平台发布销售/广告类信息，包括但不限于商家和个人发布的，包含商品转出售价格、私人联系方式、私下交易等内容。\n\n" +
            "2、不得发布国家法律法规不允许的信息，包括但不限于国家禁止或限制交易的物品，及其他违反法律法规的言论。\n\n" +
            "3、不得发布具有人身攻击性质的内容，不得发布侵犯他人权利的信息。\n\n" +
            "4、不支持闲置物品描述与实际不符的行为。\n\n" +
            "以上行为一经发现或被他人举报，平台将会根据具体情况，选择删除、屏蔽信息、限制发布信息、限制交易、限制互动、甚至查封账户等处罚方式。\n\n"
        }
      ],
      scrollToId: ""
    };
  },
  methods: {
    change(e) {
      let index = e.currentTarget.dataset.index;
      if (this.current == index) {
        this.current = null;
      } else {
        this.current = index;
      }
    }
  },
  onLoad(options) {
    if (options.q) {
      this.current = options.q - 1;
      this.scrollToId = "FAQ-" + options.q;
    }
  },
  onShow() {},
  onShareAppMessage(res) {
    //res.from
    return {
      title: "【常见问题】一个只送不卖的闲置分享平台",
      imageUrl: this.imgHOST + "/FAQ-share.png",
      path: "/pages/FAQ/FAQ"
    };
  },
  onShareTimeline(res) {
    //res.from
    return {
      title: "【常见问题】一个只送不卖的闲置分享平台",
      imageUrl: this.imgHOST + "/FAQ-share.png",
      path: "/pages/FAQ/FAQ"
    };
  }
};
</script>
<style lang="scss" scoped>
.arrow {
  width: 14rpx;
  height: 14rpx;
  border-color: #bbb;
  border-bottom-style: solid;
  border-right-style: solid;
  border-bottom-width: 1px;
  border-right-width: 1px;
  transform: rotate(45deg);
  &.on {
    transform: rotate(-135deg);
    border-color: $main-color;
  }
}
.container {
  margin-top: 20rpx;
  padding: 20rpx 0;
  background-color: #fff;
  .li {
    padding: 0 20rpx;
    &.borbot {
      border-bottom: 1px solid #f3f3f3;
    }
  }

  .title {
    padding: 50rpx 0;
    font-weight: bold;
    .icon {
      margin-top: 4rpx;
      margin-right: 20rpx;
      width: 50rpx;
      height: 40rpx;
      background-repeat: no-repeat;
      background-size: cover;
      color: #fff;
      font-size: 24rpx;
      text-align: center;
      font-weight: normal;
    }
  }
  .content {
    .icon {
      flex-shrink: 0;
      margin-top: 4rpx;
      margin-right: 20rpx;
      width: 50rpx;
      height: 40rpx;
    }
    text-align: justify;
    padding: 20rpx 20rpx 50rpx 0;
    font-size: 30rpx;
    line-height: 1, 5;
    white-space: pre-wrap;
  }
}
</style>