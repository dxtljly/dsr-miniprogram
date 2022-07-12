<template>
  <view
    :style="'position:relative;height:calc(100% - ' + (statusBarHeight + navigationHeight) +'px);'"
  >
    <gl-navbar back :backFn="isShowSaveContainer" home text="详情"></gl-navbar>
    <view style="height:100%;">
      <block v-if="detail">
         <!-- vertical :current="currentIndex" -->
        <swiper style="height:calc(100% - 112rpx);">
          <swiper-item>
            <scroll-view @scrolltolower="getList" scroll-y enable-back-to-top style="height:100%;">
              <view class="container">
                <view class="avatar-info flx fx-middle fx-justify">
                  <navigator
                    hover-class="none"
                    :url="'/pages/my/goods/publish/publish?id='+detail.seller.id+'&nickName='+detail.seller.nickName+'&avatarUrl='+detail.seller.avatarUrl"
                    class="flx fx-middle"
                  >
                    <image
                      mode="aspectFill"
                      :src="detail.seller.avatarUrl?detail.seller.avatarUrl:imgHOST+'/logo.jpg'"
                    />
                    <view>
                      <view
                        class="nickname"
                      >{{detail.int_id ? detail.seller.nickName : detail.seller.nickName[0] + '**'}}</view>
                      <view class="info">
                        <text>{{update_time}}</text>
                      </view>
                    </view>
                  </navigator>
                  <view
                    class="flx fx-middle"
                    style="padding:20rpx 10rpx;"
                    @click="showComplainModal"
                  >
                    <image
                      mode="widthFix"
                      :src="imgHOST+'/icon/complain.png'"
                      style="width:36rpx;height:36rpx;margin-right:8rpx;"
                    />
                    <text style="color:#24775F;font-size:32rpx;">举报</text>
                  </view>
                </view>
                <navigator
                  class="flx fx-middle"
                  hover-class="none"
                  target="miniProgram"
                  appId="wx95f56ab0dffe2772"
                  path="pages/index/index?&ald_media_id=53433&ald_link_key=095c43aa8cad1139"
                  style="display:block;margin:10px 15px;padding:8px 10px 8px 20px;background:rgba(255,111,106,.15);border-radius:12rpx;"
                >
                  <image
                    mode="widthFix"
                    :src="imgHOST+'/TB-logo.png'"
                    style="width:100px;height:0;"
                  />
                  <view style="height:10px;border-left:1px solid #FF6F6A;margin:0 10px;"></view>
                  <view
                    class="fx1"
                    style="font-size:10px;color:#FF6F6A;white-space:nowrap;"
                  >花一件的钱买够一季的穿搭</view>
                  <image
                    mode="widthFix"
                    :src="imgHOST+'/arrow-TB.gif'"
                    style="width:16px;height:0;"
                  />
                </navigator>
                <view class="detail">
                  <view class="price">
                    <text>￥{{detail.show_price ? detail.show_price/100 : 0}}</text>
                    <text class="origin">￥ {{detail.original_price/100}}</text>
                  </view>
                  <view class="title flx">
                    <view v-if="detail.brand_new == '100'" class="label new">全新</view>
                    <view v-if="detail.brand_new == '0'" class="label not-new">非全新</view>
                    <!-- <view
                            v-if="detail.only_pickup"
                            class="label pick_up"
                            :class="[isSchool ? 'school' : '']"
                    >自提</view>-->
                    <text>{{detail.title}}</text>
                  </view>
                  <view class="txt">{{detail.detail}}</view>
                  <view class="label">
                    <image
                      mode="widthFix"
                      :src="imgHOST+'/detail/icon-weight' + (isSchool ? '-school' : '') + '.png'"
                    />
                    <view class="label-li">
                      <view class="label-key">预估重量：</view>
                      <view>{{detail.weight}}kg内</view>
                    </view>
                  </view>
                  <view class="label">
                    <image
                      mode="widthFix"
                      :src="imgHOST+'/detail/icon-location' + (isSchool ? '-school' : '') + '.png'"
                    />
                    <view class="label-li">
                      <view class="label-key">发货地点：</view>
                      <view>{{detail.place[0]}}{{detail.place[1]}}{{detail.place[2]}}</view>
                    </view>
                  </view>
                  <view class="imgs-content">
                    <block v-for="(item,index) in detail.pic" :key="index">
                      <image mode="widthFix" :src="item" @click="previewImgs(index)" :data-index="index" />
                    </block>
                    <!-- <view class="info">
                          <text>10人想要</text>
                          <view class="line"></view>
                          <text>180次浏览</text>
                    </view>-->
                  </view>
                </view>
              </view>
              <view>
                <ad unit-id="adunit-57671a1c530759e8"></ad>
                <!-- <view
                  class="fcmain tx-center"
                  style="font-size:16px;padding:60rpx;"
                  @click="()=>this.currentIndex=1"
                >点击查看留言哩~</view> -->
              </view>
              <view id="makereadmsg" class="container" style="height:800rpx;">
                <view class="message" style="height:100%;">
                  <view class="title">
                    <block v-if="detail.only_pickup && isOwner">
                      <view
                        class="tab-li"
                        :class="[currentMessageIndex == 0 ? 'on' : '',isSchool ? 'school':'']"
                        @click="changeCurrentMessageIndex(0)"
                      >
                        <view>全部留言</view>
                      </view>
                      <view
                        v-if="detail.only_pickup"
                        class="tab-li"
                        :class="[currentMessageIndex == 1 ? 'on' : '',isSchool ? 'school':'']"
                        @click="changeCurrentMessageIndex(1)"
                      >
                        <view>领取申请</view>
                      </view>
                    </block>
                    <block v-else>
                      <view class="label" :class="{'school':isSchool}">全部留言</view>
                    </block>
                  </view>
                  <swiper
                    style="height:calc(100% - 120rpx);"
                    @change="changeMessageSwiper"
                    :current="currentMessageIndex"
                  >
                    <swiper-item>
                      <block v-if="!message.length">
                        <view style="text-align: center;margin-right: 80rpx;">
                          <image mode="widthFix" :src="imgHOST+'/icon/留言-icon.png'" style="height:25%;width:25%;" />
                        </view>
                        <view class="empty">
                          快来询问更多好物细节吧，<view @click="openMessage" style="color:#f1625a;">点击留言~</view>
                        </view>
                      </block>
                      <block v-else>
                        <scroll-view scroll-y enable-back-to-top style="height:100%;">
                          <block v-for="(item,index) in message" :key="index">
                            <view class="content">
                              <view class="list flx">
                                <navigator
                                  hover-class="none"
                                  :url="'/pages/my/goods/publish/publish?id='+item.sender.id+'&nickName='+item.sender.nickName+'&avatarUrl='+item.sender.avatarUrl"
                                >
                                  <image
                                    class="avatar"
                                    mode="aspectFill"
                                    :src="item.sender.avatarUrl ? item.sender.avatarUrl : imgHOST+'/logo.jpg'"
                                  />
                                </navigator>
                                <view class="txt">
                                  <view class="nickname flx">
                                    <navigator
                                      hover-class="none"
                                      :url="'/pages/my/goods/publish/publish?id='+item.sender.id+'&nickName='+item.sender.nickName+'&avatarUrl='+item.sender.avatarUrl"
                                    >{{item.sender.nickName[0]}}**</navigator>
                                    <text>{{$common.util.formatDate(new Date(item.create_time),true)}}</text>
                                  </view>
                                  <view
                                    class="message-1"
                                    @click="openMessage"
                                    :data-id="item.id"
                                    :data-index="index"
                                    :data-receiver="item.sender.id"
                                  >
                                    <text class="pre-wrap">{{item.contents}}</text>
                                  </view>
                                  <view v-if="item.responses[0].contents" class="message-2">
                                    <block v-for="(res,i) in item.responses" :key="i">
                                      <view class="nickname mb flx" :class="{'school':isSchool}">
                                        <navigator
                                          hover-class="none"
                                          :url="'/pages/my/goods/publish/publish?id='+item.sender.id+'&nickName='+item.sender.nickName+'&avatarUrl='+item.sender.avatarUrl"
                                        >{{res.sender.nickName[0]}}**</navigator>
                                        <text>{{$common.util.formatDate(new Date(res.create_time),true)}}</text>
                                      </view>
                                      <view class="mb">
                                        回复了
                                        <navigator
                                          hover-class="none"
                                          :url="'/pages/my/goods/publish/publish?id='+item.receiver.id+'&nickName='+item.receiver.nickName+'&avatarUrl='+item.receiver.avatarUrl"
                                          class="nickname"
                                          :class="{'school':isSchool}"
                                          style="display:inline-block"
                                        >@{{res.receiver.nickName[0]}}** ：</navigator>
                                        <text
                                          class="pre-wrap"
                                          @click="openMessage"
                                          :data-id="item.id"
                                          :data-receiver="res.sender.id"
                                          :data-index="index"
                                          :data-i="i"
                                        >{{res.contents}}</text>
                                      </view>
                                    </block>
                                  </view>
                                </view>
                              </view>
                            </view>
                          </block>
                        </scroll-view>
                      </block>
                    </swiper-item>
                    <!--  -->
                    <swiper-item v-if="detail.only_pickup && isOwner">
                      <scroll-view scroll-y enable-back-to-top style="height:100%;">
                        <block v-if="!pickupList.length">
                          <view class="empty">
                            <text>暂无申请~</text>
                          </view>
                        </block>
                        <block v-else>
                          <block v-for="(item,index) in pickupList" :key="index">
                            <view class="content">
                              <view class="list flx">
                                <navigator
                                  hover-class="none"
                                  :url="'/pages/my/goods/publish/publish?id='+item.user.id+'&nickName='+item.user.nickName+'&avatarUrl='+item.user.avatarUrl"
                                >
                                  <image
                                    class="avatar"
                                    mode="aspectFill"
                                    :src="item.user.avatarUrl ? item.user.avatarUrl : imgHOST+'/logo.jpg'"
                                  />
                                </navigator>
                                <view class="txt">
                                  <view class="nickname flx">
                                    <navigator
                                      hover-class="none"
                                      :url="'/pages/my/goods/publish/publish?id='+item.user.id+'&nickName='+item.user.nickName+'&avatarUrl='+item.user.avatarUrl"
                                    >{{isOwner ? item.user.nickName : item.user.nickName[0]+'**'}}</navigator>
                                    <!-- <text>{{$common.util.formatDate(new Date(item.create_time),true)}}</text> -->
                                  </view>
                                  <view class="message-1">
                                    <text class="pre-wrap">{{item.reason}}</text>
                                  </view>
                                  <view class="message-1">
                                    <text class="pre-wrap">{{item.contact}}</text>
                                    <view
                                      class="copy-btn"
                                      :class="{'school':isSchool}"
                                      @click="copy(item.contact)"
                                    >复制手机</view>
                                  </view>
                                  <!-- <view class="audit-btns" :class="{'school':isSchool}">
                                <view v-if="isOwner && item.status == 1 && !hasAudit" class="btns">
                                  <view class="on" @click="auditOn(item._id,index)">审核通过</view>
                                  <view class="off" @click="auditOff(item._id,index)">审核不通过</view>
                                </view>
                                <view class="audit-txt">
                                  <view v-if="item.status == 1 && !isOwner" class="on">等待审核</view>
                                  <view v-if="item.status == 2" class="on">审核通过</view>
                                  <view v-if="item.status == 3" class="off">审核不通过</view>
                                </view>
                                  </view>-->
                                </view>
                              </view>
                            </view>
                          </block>
                        </block>
                      </scroll-view>
                    </swiper-item>
                  </swiper>
                </view>
              </view>
              <view class="message" style="height:100%;">
                <view class="title" style="padding:0 26rpx;background:#fff;">
                  <view class="label" :class="{'school':isSchool}">猜你喜欢</view>
                </view>
              </view>
              <view
                style="height:100%;transform: translateY(-89%);"
              >
                <block v-if="!isSchool">
                  <goods-list :list="list" :isLastPage="isLastPage"></goods-list>
                </block>
                <block v-else>
                  <goods-list-school :list="list" :isLastPage="isLastPage"></goods-list-school>
                </block>
              </view>
              <!-- <view class="message" style="height:100%;transform: translateY(-89%);">
                <view style="height:100%;">
                  <scroll-view
                    scroll-y
                    style="height:100%;position: relative;overflow: hidden;"
                    enable-back-to-top
                    @scrolltolower="getList"
                  >
                    <block v-if="!isSchool">
                      <goods-list :list="list" :isLastPage="isLastPage"></goods-list>
                    </block>
                    <block v-else>
                      <goods-list-school :list="list" :isLastPage="isLastPage"></goods-list-school>
                    </block>
                  </scroll-view>
                </view>
              </view> -->
            </scroll-view>
          </swiper-item>
        </swiper>
        <view class="tool-bar-placeholder"></view>
        <view class="tool-bar z-depth-1">
          <block v-if="isOwner">
            <block v-if="detail.status==1">
              <view v-if="detail.pickupList.length" class="auth-saled">
                <view>若已寄出，请下架</view>
                <view class="triangle"></view>
              </view>
              <view class="flx fx-middle">
                <view class="icon-txt" @click="soldOut">
                  <image :src="imgHOST+'/icon/sold-out.png'" />
                  <view>下架</view>
                </view>
                <navigator hover-class="none" :url="'/pages/goods/add/add?id='+id" class="icon-txt">
                  <image :src="imgHOST+'/icon/goods-edit.png'" />
                  <view>编辑</view>
                </navigator>
                <!-- <view class="icon-txt" @click="showWechatGroup">
                  <image :src="imgHOST+'/icon/group.png'" />
                  <view>进群</view>
                </view> -->
                <view class="icon-txt" @click="previewWechat(imgHOST+'/seli群_2.jpg')">
                  <image mode="widthFix" :src="imgHOST+'/icon/group.png'" />
                  <view>进群</view>
                </view>
                <view class="icon-txt" @click="toggleFav">
                  <image :src="imgHOST+(detail.isFav ? '/icon/fav-on.png' : '/icon/fav.png')" />
                  <view>{{detail.isFav ? '已收藏' : '收藏'}}</view>
                </view>
              </view>
              <view class="flx">
                <!-- <view
                  class="btn"
                  style="margin-right:16rpx;"
                  :class="[isSchool ? 'school' : '']"
                  @click="update"
                >擦亮</view>-->
                <view class="btn" :class="[isSchool ? 'school' : '']" @click="showShare">分享好物</view>
              </view>
            </block>
            <block v-if="canSaleable">
              <block v-if="detail.only_pickup">
                <view
                  class="btn order"
                  :class="[isSchool ? 'school' : '']"
                  @click="toAuditList"
                >查看审核记录</view>
              </block>
              <block v-else>
                <navigator
                  hover-class="none"
                  :url="'/pages/order/detail?id='+ orderList.id"
                  class="btn order"
                  :class="[isSchool ? 'school' : '']"
                >已卖出，去订单页查看</navigator>
              </block>
            </block>
            <block v-if="hasSaleOut">
              <view class="btn order disable">已下架</view>
            </block>
          </block>
          <block v-else>
            <view class="flx fx-middle">
              <view class="icon-txt" @click="openMessage">
                <image :src="imgHOST+'/icon/message.png'" />
                <view>留言</view>
              </view>
              <view class="icon-txt" @click="showShare">
                <image :src="imgHOST+'/icon/share.png'" />
                <view>分享</view>
              </view>
              <!-- <view class="icon-txt" @click="showWechatGroup">
                <image :src="imgHOST+'/icon/group.png'" />
                <view>进群</view>
              </view> -->
              <view class="icon-txt" @click="previewWechat(imgHOST+'/seli群_2.jpg')">
                <image mode="widthFix" :src="imgHOST+'/icon/group.png'" />
                <view>进群</view>
              </view>
              <view class="icon-txt" @click="toggleFav">
                <image :src="imgHOST+(detail.isFav ? '/icon/fav-on.png' : '/icon/fav.png')" />
                <view>{{detail.isFav ? '已收藏' : '收藏'}}</view>
              </view>
            </view>
            <block v-if="detail.status == 1">
              <block v-if="!detail.int_id">
                <view
                  class="btn"
                  :class="[isSchool ? 'school' : '']"
                  @click="toBuy"
                >{{detail.only_pickup ? '马上申领' : '马上领'}}</view>
              </block>
              <block v-else>
                <navigator
                  class="btn"
                  :class="[isSchool ? 'school' : '']"
                  hover-class="none"
                  target="miniProgram"
                  :path="navigateToMiniProgramAppIdList[detail.int_id - 1].path + detail.int_item_id"
                  :appId="navigateToMiniProgramAppIdList[detail.int_id - 1].appId"
                >马上领</navigator> 
              </block>
            </block>
            <block v-else-if="detail.status==6">
              <navigator
                hover-class
                url="/pages/FAQ/FAQ?q=12"
                class="reject-btn"
                style="font-size:12px;"
              >违规商品，已被管理员下架</navigator>
            </block>
            <block v-else>
              <view class="btn disable">已被领</view>
            </block>
          </block>
        </view>

        <view v-if="isShowMessage" class="message-content-bg" @click="closeMessage"></view>
        <view v-if="isShowMessage" class="message-content flx">
          <textarea
            type="text"
            class="fx1"
            auto-height
            :show-confirm-bar="false"
            :maxlength="999"
            :placeholder="messageData.type == '1' ? '输入留言' : '输入回复'"
            placeholder-style="color:#bbb;"
            :focus="isShowMessage"
            v-model="messageData.contents"
            @confirm="notification"
          ></textarea>
          <view class="send" @click="notification">发送</view>
        </view>

        <view
          class="save-container"
          :class="{'on':isShowSaveContainer}"
          :style="'height:calc(100% - ' +(statusBarHeight+navigationHeight)+ 'px);'"
        >
          <view
            class="bg"
            :style="'background-image:url(' + imgHOST + '/detail/bg' + (isSchool ? '-school' : '') + '.png);'"
            @click="closeSaveContainer"
          ></view>
          <canvas
            canvas-id="show-card"
            class="show-card"
            :style="'width:'+canvasW+'px;height:'+canvasH+'px;'"
          ></canvas>
          <canvas
            canvas-id="save-card"
            class="save-card"
            :style="'width:'+(canvasW*canvasScale)+'px;height:'+(canvasH*canvasScale)+'px;'"
          ></canvas>
          <view class="btn" :class="{'school':isSchool}" @click="saveImg">保存图片分享</view>
        </view>
        <action-sheet :list="actionSheetList" :on="actionSheetListOn"></action-sheet>
        <action-sheet :isSchool="isSchool" share :on="isShowShare"></action-sheet>
      </block>
      <block v-if="isNull">
        <view
          class="null flx fx-middle fx-center"
          :style="'height:calc(100% - '+(statusBarHeight+navigationHeight)+'px);'"
        >
          <view class="tx-center">
            <image
              mode="widthFix"
              :src="imgHOST+'/icon/null.png'"
              style="width:400rpx;height:400rpx;margin-bottom:30rpx;"
            />
            <view>未匹配到数据哩~</view>
          </view>
        </view>
      </block>
    </view>
    <!-- ---tips--- -->
    <view v-if="isShowTips" class="modal">
      <view class="modal-content">
        <view class="modal-title">购买须知</view>
        <view class="modal-info">
          <view>1.公平起见，目前每日每个账户仅限购买一件免费商品。</view>
          <view>2、运费收取标准按物品预估重量多加2公斤计算，多退少补（多收款项在确认实际运费后原路退回）。</view>
          <view>3、拍下物品15分钟内如您没有支付运费，订单将被关闭，请记得及时付款。</view>
        </view>
        <view class="modal-btns flx fx-justify">
          <view class="btn cancel" @click="closeModal">关闭</view>
          <view
            class="btn confirm"
            :class="[isSchool ? 'school' : '']"
            @click="closeModal"
            :data-key="true"
          >不再提示</view>
        </view>
      </view>
    </view>
    <!-- ===tips=== -->

    <!-- audit modal -->
    <view v-if="isShowAuditModal" class="audit-modal">
      <view class="audit-container">
        <view class="label">申请理由</view>
        <textarea v-model="auditData.reason" placeholder="诚恳的填写您想要的申请理由，可以大大增加成功几率哩~"></textarea>
        <view class="label">联系方式</view>
        <textarea
          v-model="auditData.contact"
          placeholder="请填写您的微信号或手机号等，方便卖家联系到您哩~"
          style="height:120rpx;"
        ></textarea>
        <view class="btns" :class="{'school':isSchool}">
          <view class="btn reject" @click="closeAuditModal">取消</view>
          <view class="btn accept" @click="toAuditBuy">提交</view>
        </view>
      </view>
    </view>

    <!-- wechat group modal -->
    <view v-if="isShowWechatGroupModal" class="wechat-group-modal">
      <view class="bg" @click="()=>this.isShowWechatGroupModal=false"></view>
      <!--   -->
      <!-- <image
        mode="widthFix"
        :src="imgHOST+'/进入闲置群.png'"
        @click.stop="copyWechat"
        @longpress.stop="saveWechatGroup"
      />-->
      <image mode="widthFix" :src="imgHOST+'/seli群_2.jpg'" @longtap.stop="saveGroupQR" />
    </view>

    <!-- complain modal  -->
    <block v-if="isShowComplainModal">
      <view class="complain-modal">
        <view class="bg" @click="()=>isShowComplainModal=false"></view>
        <view class="content z-depth-1">
          <view class="title">举报</view>
          <view class="form">
            <view class="li">
              <view class="label">理由</view>
              <picker
                @change="changeComplainReason"
                :value="complainData.reason"
                :range="complainData.reasonList"
              >
                <view class="input">{{complainData.reasonList[complainData.reason]}}</view>
              </picker>
            </view>
            <view class="li">
              <view class="label">补充说明</view>
              <textarea v-model="complainData.content" type="text" class="input" />
            </view>
            <view class="imgs-content">
              <block v-for="(item,index) in complainData.uploadImgs" :key="index">
                <view
                  v-if="item.flag"
                  class="img"
                  inertia
                  :data-index="index"
                  :data-url="item.upload ? item.upload : item.temp"
                  @click="previewImg"
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

              <view class="img img-add" @click="chooseImgs"></view>
            </view>
          </view>
          <view class="flx fx-center">
            <view class="btn" @click="toComplain">提交</view>
          </view>
        </view>
      </view>
    </block>

    <block v-if="isShowOlay">
      <view
        class="flx fx-middle fx-center"
        style="position:fixed;z-index:999;top:0;width:100%;height:100%;background:rgba(30,30,30,.4);"
        @click="closeOlay"
      >
        <navigator hover-class="none" url="/pages/spa/qr/list">
          <image mode="widthFix" :src="imgHOST+'/olay/sli-举报.png'" style="width:250px;height:0" />
        </navigator>
      </view>
    </block>
  </view>
</template>
<script>
const app = getApp();
const rpxRatio = uni.getSystemInfoSync()["screenWidth"] / 750;
import {
  imgHOST,
  Host,
  xhr,
  allowTypes,
  local,
  formatDate,
  navigateToMiniProgramAppIdList,
  getUrlParam,
  shareContent
} from "@/common/util";

export default {
  data() {
    return {
      imgHOST,
      statusBarHeight: app.globalData.statusBarHeight,
      navigationHeight: app.globalData.navigationHeight,
      navigateToMiniProgramAppIdList,
      isSchool: false,
      id: null,
      detail: null,
      isNull: false,
      message: [],
      isOwner: false,
      actionSheetListOn: false,
      actionSheetList: [],
      isShowShare: false,
      isShowMessage: false,
      canvasW: 649 * rpxRatio,
      canvasH: 980 * rpxRatio,
      canvasScale: 3,
      loadImgs: {
        bg: imgHOST + "/detail/share-bg.png",
        content: imgHOST + "/detail/share-content-bg.png",
        avatar: "",
        txt: imgHOST + "/logo.png",
        img: "",
        qr: imgHOST + "/qr.jpg"
      },
      tempImgs: {},
      saveImgPath: null,
      finishCanvas: false,
      isShowSaveContainer: false,
      messageData: {
        item: "",
        receiver: "",
        reply_to: "",
        type: "", //1 2 3
        contents: "",
        i: "" //no send xhr
      },
      scrollToId: "",
      isShowTips: false,
      messageCanScroll: false,
      goodsCanScroll: false,
      currentMessageIndex: 0,
      pickupList: [],
      isShowAuditModal: false,
      auditData: {
        reason: "",
        contact: ""
      },
      isShowWechatGroupModal: false,
      rows: 10,
      skip: 0,
      list: [],
      itemIdList: [],
      isLastPage: false,
      isLoadEnd: true,
      currentIndex: 0,
      isShowComplainModal: false,
      complainData: {
        reasonList: ["广告内容", "色情低俗", "违法违规", "侵权投诉", "其他"],
        reason: 0,
        content: "",
        uploadImgs: [] //{temp:'',upload:'',flag:true}
      },
      isShowOlay: false,
      detailList: [],
      orderList: []
    };
  },
  methods: {
    checkOwner() {
      console.log(local.get("user").id);
      console.log(this.detail.seller.id);
      if (local.get("user").id == this.detail.seller.id) {
        this.isOwner = true;
      } else {
        this.isOwner = false;
      }
    },
    getDetail() {
      let url = "/item/unauth/" + this.id,
        data = {};
      uni.showLoading({
        mask: true
      });
      xhr.get(url, data, res => {
        console.log(res);
        uni.hideLoading();
        if (res.statusCode == 200 && res.data.id) {
          if (typeof res.data.isFav == "undefined") {
            res.data.isFav = false;
          }
          this.detail = res.data;
          console.log(this.detail,"this.detail");
          this.checkOwner();
          if (this.detail.applications) {
            this.pickupList = this.detail.applications;
          }
          this.getList();
        } else {
          this.isNull = true;
        }
      });
    },
    orderId(){
      let url = "/order/order_detail_by_item/" + this.id,
        data = {
        };
      xhr.get(url, data, res => {
        if (res.statusCode == 200) {
          this.orderList = res.data;
        }
      });
    },
    previewImgs(e) {
      let index = e.currentTarget.dataset.index;
      console.log(index);
      uni.previewImage({
        current: this.detail.pic[index],
        urls: [...this.detail.pic],
        indicator: "default",
        loop: true,
        longPressActions: true
      });
    },
    soldOut() {
      this.actionSheetList = [
        {
          title: "已卖出",
          status: "2-1"
        },
        {
          title: "不想卖了",
          status: "2-2"
        }
      ];
      this.actionSheetListOn = true;
      uni.$once("chooseActionSheet", res => {
        if (res.index == -1) {
          this.actionSheetListOn = false;
        } else {
          let status = this.actionSheetList[res.index].status;
          let url = "/item/" + this.id,
            data = {
              status
            };
          uni.showLoading();
          xhr.delete(url, data, res => {
            uni.hideLoading();
            if (String(res.statusCode)[0] == 2) {
              console.log(res);
              this.detail.status = status;
              this.actionSheetListOn = false;
            }
          });
        }
      });
    },
    showShare() {
      this.isShowShare = true;
      uni.$on("chooseActionSheet", data => {
        if (data.index == "save") {
          if (!this.finishCanvas) {
            this.getSaveImgPath();
          }

          this.showSaveContainer();
        }
        this.isShowShare = false;
      });
    },
    buy() {
      if (local.get("user").role != "telUser") {
        return uni.showToast({
          title: "需绑定手机后购买",
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
      let url = "/item/checklimit",
        data = {};
      xhr.get(url, data, res => {
        if (String(res.statusCode)[0] == 2 && res.data) {
        } else {
          return uni.showToast({
            title: "每个账号每天限购一件",
            icon: "none"
          });
        }
        console.log("11111111111")
          let id = this.id,
          img = this.detail.pic[0],
          title = this.detail.title,
          op = this.detail.original_price;
        local.set("orderGoods", this.detail);
        console.log(local.get("orderGoods"));
        uni.navigateTo({
          url: "/pages/order/createOrder"
        });
      });
    },
    closeAuditModal() {
      this.isShowAuditModal = false;
    },
    toAuditBuy() {
      let url = "/item/apply/" + this.id,
        data = this.auditData;
      if (!data.reason || !data.contact) {
        return uni.showToast({
          title: "缺少信息",
          icon: "none"
        });
      }
      uni.showLoading();
      xhr.post(url, data, res => {
        uni.hideLoading();
        if (String(res.statusCode)[0] == 2) {
          uni.showToast({
            title: "提交成功"
          });
          this.pickupList.push({
            user: local.get("user"),
            reason: data.reason,
            contact: data.contact,
            status: 1,
            create_time: new Date()
          });
          this.isShowAuditModal = false;
          this.auditData = {
            reason: "",
            contact: ""
          };
        }
      });
    },
    toBuy() {
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
      if (local.get("user").ad_level == 4 || local.get("user").ad_level >= 6) {
        return uni.showModal({
          title: "警告",
          content: "很抱歉，由于您存在违规操作，已被禁止申领/购买行为",
          showCancel: false,
          success: res => {}
        });
      }
      if (this.detail.only_pickup) {
        this.isShowAuditModal = true;
        // uni.showModal({
        //   title: '提示',
        //   content: `此商品仅限（${this.detail.place}）自提`,
        //   confirmText: '马上领',
        //   success: res => {
        //     if (res.confirm) {
        //       console.log('用户点击确定');
        //       this.isShowAuditModal = true;
        //     } else if (res.cancel) {
        //       console.log('用户点击取消');
        //     }
        //   }
        // });
      } else {
        this.buy();
      }
    },
    getSaveImgPath() {
      if (this.isSchool) {
        this.loadImgs.bg = imgHOST + "/detail/share-bg-school.png";
      }
      let _this = this;
      let getQr = new Promise(function(resolve, reject) {
        if (_this.detail.qr) {
          _this.loadImgs.qr = _this.detail.qr.replace(/^http:\/\//, "https://");
          resolve(_this.detail.qr);
        } else {
          let url = `/item/qr/${_this.id}`,
            data = {};
          xhr.get(url, data, res => {
            if (res.statusCode == 200) {
              _this.loadImgs.qr = res.data.replace(/^http:\/\//, "https://");
              resolve(res.data);
            } else {
              reject(res);
            }
          });
        }
      });
      this.loadImgs.img = this.detail.pic[0].replace(/^http:\/\//, "https://");
      this.loadImgs.avatar = local.get("user").avatarUrl
        ? local.get("user").avatarUrl
        : imgHOST + "/logo.jpg";

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
          _this.drawCanvas("save-card", _this.canvasScale);
        });
      }

      getQr
        .then(res => {
          getTempImgs();
        })
        .catch(err => {
          console.log(err);
          _this.failLoadQr = true;
          getTempImgs();
        });
    },
    drawCanvas(canvas, scale) {
      canvas = canvas ? canvas : "show-card";
      scale = scale ? scale : 1;
      let ctx = uni.createCanvasContext(canvas);
      // bg
      ctx.drawImage(
        this.tempImgs.bg.path,
        0,
        0,
        this.canvasW * scale,
        this.canvasH * scale
      );
      //content
      var x = 56 * rpxRatio * scale,
        y = 284 * rpxRatio * scale,
        bot = 56 * rpxRatio * scale;
      ctx.drawImage(
        this.tempImgs.content.path,
        x,
        y,
        this.canvasW * scale - x * 2,
        this.canvasH * scale - y - bot
      );

      //avatar
      var r = 60 * rpxRatio * scale,
        R = 4 * rpxRatio * scale + r,
        y = 284 * rpxRatio * scale;

      ctx.setFillStyle("#fff");
      ctx.arc((this.canvasW * scale) / 2, y, R, 0, 2 * Math.PI);
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc((this.canvasW * scale) / 2, y, r, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(
        this.tempImgs.avatar.path,
        (this.canvasW * scale) / 2 - r,
        y - r,
        r * 2,
        r * 2
      );
      ctx.restore();

      //txt

      var padding = (56 + 80) * rpxRatio * scale,
        x = padding,
        y = y + R + 20 * scale;

      ctx.setTextAlign("left");
      ctx.setFillStyle("#333");
      ctx.setFontSize(12 * scale);
      var txt1 = "我在断舍哩发现了一件",
        txt1W = ctx.measureText(txt1).width;
      ctx.fillText(txt1, x, y);
      ctx.setFillStyle("#FF5E41");
      ctx.setFontSize(14 * scale);

      var txt2 = this.detail.show_price ? "超值商品" : "免费商品",
        txt2W = ctx.measureText(txt2).width;
      ctx.fillText(txt2, x + txt1W, y);
      ctx.setFillStyle("#333");
      ctx.setFontSize(12 * scale);
      ctx.fillText(",", x + txt1W + txt2W, y);

      ctx.setTextAlign("center");
      ctx.fillText(
        "快来领回家呀！",
        (this.canvasW / 2) * scale,
        y + 18 * scale
      );

      //img
      var x = padding,
        y = (284 + 160) * rpxRatio * scale,
        dW = this.canvasW * scale - padding * 2,
        dH = 248 * rpxRatio * scale,
        ratio = this.tempImgs.img.width / this.tempImgs.img.height;

      if (dW / dH > ratio) {
        //图片高
        dW = dH * ratio;
        x = (this.canvasW * scale) / 2 - dW / 2;
      } else {
        var tempH = dH;
        dH = dW / ratio;
        y = y + tempH / 2 - dH / 2;
      }

      ctx.drawImage(this.tempImgs.img.path, x, y, dW, dH);

      //price
      ctx.setFillStyle("#FF5E41");
      ctx.setFontSize(20 * scale);
      ctx.fillText(
        this.detail.show_price ? "￥ " + this.detail.show_price / 100 : "￥ 0",
        (this.canvasW * scale) / 2,
        (284 + 160) * rpxRatio * scale + 290 * rpxRatio * scale
      );

      //line
      var x = 100 * rpxRatio * scale,
        y = 754 * rpxRatio * scale;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.setStrokeStyle("#175F4A");
      ctx.setLineDash([3 * scale, 6 * scale], 1 * scale);
      ctx.lineTo(this.canvasW * scale - x, y);
      ctx.stroke();
      ctx.closePath();

      //qr
      var w = 90 * rpxRatio * scale,
        x = 140 * rpxRatio * scale,
        y = this.canvasH * scale - 100 * rpxRatio * scale - w;
      ctx.drawImage(this.tempImgs.qr.path, x, y, w, w);

      ctx.drawImage(
        this.tempImgs.txt.path,
        x + w + 40 * rpxRatio * scale,
        y + 10 * rpxRatio * scale,
        90 * rpxRatio * scale,
        26 * rpxRatio * scale
      );

      ctx.setFillStyle("#333");
      ctx.setTextAlign("left");
      ctx.setFontSize(10 * scale);
      ctx.fillText(
        "长按识别二维码即可查看商品",
        x + w + 40 * rpxRatio * scale,
        y + 80 * rpxRatio * scale
      );

      ctx.draw(true);
      if (canvas == "save-card") {
        this.finishCanvas = true;
        uni.hideLoading();
      }
    },
    showSaveContainer() {
      this.isShowSaveContainer = true;
      if (!this.finishCanvas) {
        uni.showLoading();
      } else {
        uni.hideLoading();
      }
    },
    closeSaveContainer() {
      this.isShowSaveContainer = false;
      uni.hideLoading();
    },
    saveImg() {
      let _this = this;
      if (!this.finishCanvas) {
        return uni.showToast({
          title: "生成中",
          icon: "none"
        });
      }
      uni.showLoading();
      uni.canvasToTempFilePath({
        canvasId: "save-card",
        success: res => {
          this.saveImgPath = res.tempFilePath;
          uni.saveImageToPhotosAlbum({
            filePath: this.saveImgPath,
            success: res => {
              console.log(res);
              uni.showToast({
                title: "保存成功"
              });
            },
            fail: err => {
              console.log(err);
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
            },
            complete: res => {
              uni.hideLoading();
              this.closeSaveContainer();
            }
          });
        }
      });
    },
    getMessage(e) {
      let url = "/messages/item/" + this.id,
        data = {};
      xhr.get(url, data, res => {
        console.log(res);
        if (res.statusCode == 200) {
          this.message = res.data;
          console.log(this.message,"this.message");
        }
      });
    },
    closeMessage() {
      this.isShowMessage = false;
    },
    openMessage(e) {
      let reply_to = e.currentTarget.dataset.id,
        index = e.currentTarget.dataset.index,
        i = e.currentTarget.dataset.i,
        receiver = e.currentTarget.dataset.receiver;
      let messageData = { ...this.messageData };
      messageData.item = this.detail.id;
      messageData.contents = this.messageData.contents;
      messageData.index = null;

      messageData.receiver = receiver ? receiver : this.detail.seller.id;
      if (reply_to) {
        messageData.i = i;
        messageData.index = index;
        messageData.reply_to = reply_to;
        messageData.type = "2";
      } else {
        messageData.reply_to = "";
        messageData.type = "1";
      }
      this.messageData = messageData;
      this.isShowMessage = true;
    },
    notification() {
      uni.requestSubscribeMessage({
        tmplIds: ["D_Yj9r3d2UeUwxbsR870ubbc_LQFrHscU4oj9gWHfQ4"],
        success: res => {
        },
        fail: err => {},
        complete: res => {
          this.toMessage();
          this.getMessage();
          this.closeMessage();
        }
      });
    },
    toMessage() {
      if (["authUser", "telUser"].indexOf(local.get("user").role) < 0) {
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
      let index = null,
        i = null;
      let url = "/message/",
        data = { ...this.messageData };
      if (data.index || data.index === 0) {
        index = data.index;
        i = data.i;
      }
      delete data.index;
      delete data.i;
      if (!data.contents.replace(/\s/g, "")) {
        return uni.showToast({
          title: data.reply_to ? "回复不能为空" : "留言不能为空",
          icon: "none"
        });
      }
      if (!data.reply_to) {
        delete data.reply_to;
      }
      console.log(data);
      xhr.post(url, data, res => {
        console.log(res);
        if (String(res.statusCode)[0] == 2) {
          uni.showToast({
            title: "发送成功"
          });
          if (data.type == "1") {
            let message = [...this.message];
            data.id = res.data;
            data.create_time = String(new Date());
            data.receiver = { ...this.detail.seller };
            data.sender = local.get("user");
            console.log(message);
            message.unshift(data);
            this.message = message;
          } else if (data.type == "2") {
            let message = [...this.message];
            data.id = res.data;
            data.create_time = String(new Date());

            data.sender = local.get("user");
            if (
              !message[index].responses ||
              !message[index].responses[0].contents
            ) {
              message[index].responses = [];
              data.receiver = { ...message[index].sender };
            } else {
              if (i || i === 0) {
                data.receiver = { ...message[index].responses[i].sender };
              } else {
                data.receiver = { ...message[index].sender };
              }
            }
            message[index].responses.push(data);
            this.message = message;
          }
          this.messageData.contents = "";
        }
      });
    },
    makereadmsg() {
      let url = "/item/makereadmsg/" + this.id,
        data = {};
      xhr.put(url, data, res => {
        console.log(res);
        if (String(res.statusCode)[0] == 2) {
        }
      });
    },
    showTips() {
      if (local.get("newJson").showBuyTips) {
        return false;
      }
      if (!this.isSchool) {
        this.isShowTips = true;
      }
    },
    closeModal(e) {
      if (e.currentTarget.dataset.key) {
        let newJson = { ...local.get("newJson") };
        newJson.showBuyTips = true;
        console.log(newJson);
        local.set("newJson", newJson);
      }
      this.isShowTips = false;
    },
    contentScroll(e) {
      const query = uni.createSelectorQuery();
      query.select("#makereadmsg").boundingClientRect(data => {
        this.messageCanScroll =
          data.top <= this.statusBarHeight + this.navigationHeight + 2;
      });
      query.select("#goodsContent").boundingClientRect(data => {
        this.goodsCanScroll =
          data.top <= this.statusBarHeight + this.navigationHeight + 2;
      });
      query.exec();
    },
    changeMessageSwiper(e) {
      this.currentMessageIndex = e.target.current;
    },
    changeCurrentMessageIndex(i) {
      this.currentMessageIndex = i;
    },
    auditOn(apply_id, index) {
      uni.showModal({
        title: "提示",
        content: "是否已经与买家建立联系？",
        success: res => {
          if (res.confirm) {
            console.log("用户点击确定");
            let url = "/item/apply/accept",
              data = {
                item_id: this.id,
                apply_id
              };
            uni.showLoading();
            xhr.put(url, data, res => {
              uni.hideLoading();
              if (res.statusCode == 200) {
                this.pickupList[index].status = 2;
              }
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    auditOff(apply_id, index) {
      let url = "/item/apply/deny",
        data = {
          item_id: this.id,
          apply_id
        };
      uni.showLoading();
      xhr.put(url, data, res => {
        uni.hideLoading();
        if (res.statusCode == 200) {
          this.pickupList[index].status = 3;
        }
      });
    },
    toAuditList() {
      this.scrollToId = "makereadmsg";
      this.currentMessageIndex = 1;
    },
    showWechatGroup() {
      this.isShowWechatGroupModal = true;
    },
    previewImgs(index) {
      let photoList = this.detail.pic.map(item => {
				return item;
			});
			uni.previewImage({
				current: index,
				urls: photoList
			});
      // urls = urls || [current];
      // uni.previewImage({
      //   current,
      //   urls // 需要预览的图片http链接列表
      // });
    },
    copyWechat() {
      uni.setClipboardData({
        data: "salmonisaboy",
        success: res => {
          uni.showToast({
            title: "复制微信号成功"
          });
        }
      });
    },
    saveWechatGroup() {
      uni.getImageInfo({
        src: this.imgHOST + "/seli群_2.png",
        success: res => {
          console.log(res);
          uni.saveImageToPhotosAlbum({
            filePath: res.path,
            success: res => {
              uni.showToast({
                title: "保存成功"
              });
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
    // unauth() {
    //   let url = "/item/unauth/" + this.id,
    //     data = {};
    //   uni.showLoading({
    //     mask: true
    //   });
    //   xhr.get(url, data, res => {
    //     console.log(res);
    //     uni.hideLoading();
    //     if (res.statusCode == 200 && res.data.id) {
    //       if (typeof res.data.isFav == "undefined") {
    //         res.data.isFav = false;
    //       }
    //       this.detail = res.data;

    //       this.checkOwner();
    //       if (this.detail.applications) {
    //         this.pickupList = this.detail.applications;
    //       }
    //       this.getList();
    //     }
    //   });
    // },
    previewWechat() {
      uni.previewImage({
        current: imgHOST + "/seli群_2.jpg", // 当前显示图片的http链接
        urls: [imgHOST + "/seli群_2.jpg"] // 需要预览的图片http链接列表
      });
    },
    copy(phone) {
      uni.setClipboardData({
        data: phone,
        success: () => {
          uni.showToast({
            title: "复制成功"
          });
        }
      });
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
          cat: this.detail.category
        };
      xhr.get(url, data, res => {
        this.isLoadEnd = true;
        console.log(res);
        if (res.statusCode == 200) {
          res.data.items.forEach(v => {
            if (this.itemIdList.indexOf(v.id) < 0) {
              this.list.push(v);
              this.itemIdList.push(v.id);
            }
          });
          if (res.data.items.length < 10) {
            this.isLastPage = true;
          }
        }
      });
    },
    saveGroupQR() {
      let _this = this;
      uni.showActionSheet({
        itemList: ["保存图片"],
        success: res => {
          //res.tapIndex
          if (res.tapIndex === 0) {
            uni.getImageInfo({
              src: imgHOST + "/断舍离群二维码.jpg",
              success: res => {
                uni.saveImageToPhotosAlbum({
                  filePath: res.path,
                  success: res => {
                    uni.showToast({
                      title: "保存成功"
                    });
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
              },
              fail: err => {
                console.log(err);
                uni.showToast({
                  title: "加载失败，请重试",
                  icon: "none"
                });
              }
            });
          }
        },
        fail: err => {}
      });
    },
    update() {
      let url = "/item/update/" + this.id,
        data = {};
      uni.showLoading();
      xhr.put(url, data, res => {
        uni.hideLoading();
        if (res.statusCode == 204) {
          uni.showToast({
            title: "成功擦亮"
          });
        }
      });
    },
    toggleFav() {
      if (this.detail.isFav) {
        let url = "/user/fav",
          data = {
            id: this.id
          };
        xhr.delete(url, data, res => {
          if (res.statusCode == 200) {
            uni.showToast({ title: "取消收藏" });
            this.detail.isFav = false;
          }
        });
      } else {
        let url = "/user/fav",
          data = {
            id: this.id
          };
        xhr.post(url, data, res => {
          if (res.statusCode == 200) {
            uni.showToast({ title: "收藏成功" });
            this.detail.isFav = true;
          }
        });
      }
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

          uni.chooseImage({
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
              let len = this.complainData.uploadImgs.length;
              fileList.map((val, index) => {
                this.complainData.uploadImgs.push({
                  flag: true,
                  temp: val,
                  upload: ""
                });
              });

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
                    this.complainData.uploadImgs[i].flag = false;
                  },
                  complete: res => {
                    console.log("index:" + i);
                    if (String(res.statusCode)[0] == 2) {
                      this.complainData.uploadImgs[i].temp = "";
                      this.complainData.uploadImgs[i].upload = filename;
                    } else {
                      this.complainData.uploadImgs[i].flag = false;
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
      let index = e.currentTarget.dataset.index;
      let deleteItem = this.complainData.uploadImgs[index];
      deleteItem.flag = false;

      this.complainData.uploadImgs[index] = deleteItem;
    },
    previewImg(e) {
      let current = e.currentTarget.dataset.url;
      let imgList = [];
      this.complainData.uploadImgs.map(v => {
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
    showComplainModal() {
      if (!local.get("user") || local.get("user").role != "telUser") {
        return uni.navigateTo({ url: "/pages/my/auth/login" });
      }
      this.isShowComplainModal = true;
    },
    changeComplainReason(e) {
      this.complainData.reason = e.target.value;
    },
    toComplain() {
      let url = "/item/complain",
        data = {
          item_id: this.id,
          reason: this.complainData.reasonList[this.complainData.reason],
          content: this.complainData.content,
          images: []
        };

      if (!data.reason) {
        return uni.showToast({
          title: "未选择举报原因",
          icon: "none"
        });
      }
      if (!data.content) {
        return uni.showToast({
          title: "未填写举报说明",
          icon: "none"
        });
      }

      this.complainData.uploadImgs.forEach((v, i) => {
        if (v.flag && v.upload) {
          data.images.push(v.upload);
        }
      });

      xhr.post(url, data, res => {
        if (res.statusCode == 200) {
          uni.showToast({
            title: "举报成功，尽快为您处理",
            icon: "none"
          });
          this.isShowComplainModal = false;
          this.complainData.reason = "";
          this.complainData.content = "";
          this.complainData.uploadImgs = [];

          this.checkShowOlay();
        }
      });
    },
    checkShowOlay() {
      let url = "/spa/mymechs",
        data = {};
      xhr.get(url, data, res => {
        console.log(res.data);
        if (res.statusCode == 200) {
          let olayId = "6013903543baae664095a129"; //coupon
          let isShowOlay = true;

          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].id == olayId && res.data[i].coupon) {
              isShowOlay = false;
              break;
            }
          }
          this.isShowOlay = isShowOlay;
        }
      });
    },
    closeOlay() {
      this.isShowOlay = false;
    }
//     test(){
              
//       this.getDetail();
//       console.log('-->test')
//               console.log(this.isSchool,'-->this.isSchool')
// console.log(this.detail.show_price,'-->this.detail.show_price')
//       if(this.isSchool){
//         console.log(this.isSchool || this.detail.show_price
//           ? "让好物循环"
//           : "一个只送不卖的闲置分享平台",'title')
//       }
//         console.log(this.detail.pic[0],'imageUrl')
//     }
  },
  computed: {
    hasAudit() {
      let hasAudit = false;
      for (let i = 0; i < this.pickupList.length; i++) {
        if (this.pickupList[i].status == 2) {
          hasAudit = true;
          break;
        }
      }
      return hasAudit;
    },
    update_time() {
      let update_time = "";
      if (this.detail) {
        update_time = formatDate(new Date(this.detail.update_time), true);
      }
      return update_time;
    },
    canSaleable() {
      let canSaleable = false;
      if (this.detail) {
        if (["3", "4", "5", "3-5"].indexOf(this.detail.status) >= 0) {
          canSaleable = true;
        }
      }

      return canSaleable;
    },
    hasSaleOut() {
      let hasSaleOut = false;
      if (this.detail) {
        if (["2-1", "2-2"].indexOf(String(this.detail.status)) >= 0) {
          hasSaleOut = true;
        }
      }
      return hasSaleOut;
    }
  },
  mounted() {
    uni.$on("backFn", data => {
      this.closeSaveContainer();
    });
  },
  onLoad(options) {
    console.log(options);
    if (options.scene) {
      let scene = getUrlParam(
        decodeURIComponent(options.scene).replace(/^\?/, "")
      );
      options = scene;
    }

    if (!options.id) {
      return uni.redirectTo({
        url: "/pages/index/index"
      });
    }
    if (options.showShare) {
      this.showShare();
    }
    if (options.school) {
      this.isSchool = true;
    }
    this.id = options.id;
    // this.showTips();
    this.getDetail();
    this.getMessage();
    this.orderId();
    if (options.makereadmsg) {
      // this.makereadmsg();
      this.currentMessageIndex = options.makereadmsg - 1;

      // setTimeout(() => {
      //   this.currentIndex = 1;
      //   // this.scrollToId = 'makereadmsg';
      // }, 1000);
    }
  },
  onShow() {

  },
  onShareAppMessage(res) {
    //res.from
    return {
      title: this.detail.title,
      imageUrl: this.detail.pic[0],
      path: "/pages/goods/detail/detail?id=" + this.id
    };
  },
  onShareTimeline(res) {
    return {
      title: this.detail.title,
      imageUrl: this.detail.pic[0],
      path: "/pages/goods/detail/detail?id=" + this.id
    };
  }
};
</script>
<style lang="scss" scoped>
view {
  user-select: text;
}
.pre-wrap {
  white-space: pre-wrap;
}
.null {
  color: #666;
}
.container {
  padding: 0 26rpx;
  margin-bottom: 20rpx;
  background-color: #fff;
}
.avatar-info {
  padding: 30rpx 0;
  border-bottom: 1px solid #f3f3f3;
  image {
    width: 90rpx;
    height: 90rpx;
    border-radius: 50%;
    margin-right: 14rpx;
  }
  .nickname {
    font-size: 28rpx;
    font-weight: bold;
  }
  .info {
    font-size: 24rpx;
    color: #bbb;
    text {
      margin-right: 20rpx;
    }
  }
}

.detail {
  .price {
    font-size: 52rpx;
    font-weight: bold;
    .origin {
      margin-left: 30rpx;
      font-size: 32rpx;
      font-weight: normal;
      color: #666;
      text-decoration: line-through;
    }
  }
  .title {
    font-size: 36rpx;

    .label {
      height: 26rpx;
      padding: 2rpx 4rpx;
      margin: 12rpx 6rpx 0 0;
      font-weight: normal;
      font-size: 16rpx;
      color: #fff;
      border-radius: 4rpx;
      vertical-align: middle;
      white-space: nowrap;
      box-sizing: border-box;
      &.new {
        background-color: #ff5e41;
      }
      &.not-new {
        background-color: #ddd;
      }
      &.pick_up {
        background-color: $main-color;
        &.school {
          background-color: $school-main-color;
        }
      }
    }
  }
  .label {
    margin: 8rpx 0;
    display: flex;
    align-items: center;

    image {
      width: 24rpx;
      height: 0;
      margin-right: 10rpx;
    }

    .label-li {
      display: flex;
      align-items: center;
      white-space: nowrap;
      font-size: 24rpx;
      margin-right: 10rpx;
      color: #bbb;
    }
  }
  .txt {
    margin-top: 30rpx;
    white-space: pre-wrap;
    font-size: 28rpx;
    line-height: 1.5;
    user-select: all;
  }
  .imgs-content {
    padding-top: 30rpx;
    padding-bottom: 20rpx;
    image {
      display: block;
      width: 100%;
      height: 0;
      margin-bottom: 20rpx;
      border-radius: 20rpx;
    }
    .info {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 24rpx;
      color: #bbb;
      text {
        padding: 0 20rpx;
      }
      .line {
        width: 0;
        height: 18rpx;
        border-left: 1px solid #d8d8d8;
      }
    }
  }
}

.message {
  margin-top: 10rpx;
  .title {
    align-items: center;
    position: relative;
    height: 120rpx;
    // border-bottom: 1px solid #f9f9f9;
    .tab-li {
      position: relative;
      width: 50%;
      text-align: center;
      font-size: 30rpx;
      transition: 0.3s;
      view {
        transform: scale(1);
        transition: 0.1s;
      }
      &::before {
        content: "";
        display: block;
        position: absolute;
        margin: auto;
        left: 0;
        right: 0;
        bottom: -10rpx;
        width: 30rpx;
        height: 0;
        border-radius: 4px;
        border: 2px solid transparent;
        transition: 0.3s;
      }
      &.on {
        view {
          font-weight: 500;
          transform: scale(1.1);
        }
        &::before {
          border: 2px solid $main-color;
        }
        &.school::before {
          border: 2px solid $school-main-color;
        }
      }
    }
    .label {
      position: relative;
      padding: 30rpx;
      &::before {
        content: "";
        display: block;
        position: absolute;
        margin: auto;
        left: 0;
        top: 0;
        bottom: 0;
        width: 0;
        height: 16rpx;
        border: 4rpx solid $main-color;
        border-radius: 8rpx;
      }
      &.school {
        &::before {
          border: 4rpx solid $school-main-color;
        }
      }
    }
  }

  .empty {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow:hidden;
    text-overflow:ellipsis;
    height: 160rpx;
    font-size: 26rpx;
    color: #666;
  }
  .content {
    padding: 20rpx 0 40rpx;
    border-bottom: 1px solid #f3f3f3;
    .list {
      .avatar {
        flex-shrink: 0;
        width: 64rpx;
        height: 64rpx;
        margin-right: 20rpx;
        border-radius: 50%;
      }
      .txt {
        flex-grow: 1;
        font-size: 26rpx;
        .nickname {
          font-weight: bold;
          text {
            margin-left: 20rpx;
            color: #bbb;
            font-size: 20rpx;
            font-weight: normal;
          }
        }
        .message-1 {
          margin-top: 20rpx;
          line-height: 1.4;
        }
        .message-2 {
          margin-top: 20rpx;
          padding: 20rpx;
          border-radius: 8rpx;
          background-color: #f3f3f3;
          .nickname {
            color: $main-color;
            &.school {
              color: $school-main-color;
            }
          }
          .mb {
            margin-bottom: 10rpx;
          }
        }
      }
    }
  }
  .copy-btn {
    display: inline-block;
    margin-left: 30rpx;
    padding: 4rpx 10rpx;
    border-radius: 46rpx;
    border: 1px solid $main-color;
    color: $main-color;
    font-size: 12px;
    &.school {
      border: 1px solid $school-main-color;
      color: $school-main-color;
    }
  }
  .audit-btns {
    margin-top: 30rpx;
    .btns {
      display: flex;
      view {
        width: 170rpx;
        height: 46rpx;
        line-height: 46rpx;
        text-align: center;
        border-radius: 46rpx;
        &.on {
          color: #fff;
          background-color: $main-color;
          border: 1px solid $main-color;
          margin-right: 40rpx;
        }
        &.off {
          color: $main-color;
          border: 1px solid $main-color;
        }
      }
    }
    .audit-txt {
      display: flex;
      view {
        width: 170rpx;
        height: 46rpx;
        line-height: 46rpx;
        text-align: center;
        border-radius: 46rpx;
        &.on {
          color: $main-color;
        }
        &.off {
          color: #bbb;
        }
      }
    }
    &.school {
      .btns {
        view {
          &.on {
            background-color: $school-main-color;
            border: 1px solid $school-main-color;
          }
          &.off {
            color: $school-main-color;
            border: 1px solid $school-main-color;
          }
        }
      }
      .audit-txt {
        view {
          &.on {
            color: $school-main-color;
          }
        }
      }
    }
  }
}

$tool-bar-height: 112rpx;
.tool-bar-placeholder {
  height: $tool-bar-height;
}
.tool-bar {
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  bottom: 0;
  width: 100%;
  height: $tool-bar-height;
  padding: 0 20rpx;
  box-sizing: border-box;
  background-color: #fff;

  button {
    margin: 0;
    padding: 0;
    font-size: 32rpx;
    line-height: normal;
    background: none;
    &::after {
      border: none;
    }
  }
  .icon-txt {
    margin: 0 40rpx 0 20rpx;
    color: #666;
    font-size: 22rpx;
    text-align: center;
    image {
      width: 48rpx;
      height: 40rpx;
    }
  }

  .btn {
    padding: 0 40rpx;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    color: #fff;
    border-radius: 44rpx;
    background-color: $main-color;
    &.disable {
      background-color: #bbb;
    }
    &.order {
      position: relative;
      margin: auto;
      width: 560rpx;
    }
    &.school {
      background-color: $school-main-color;
    }
  }

  .auth-saled {
    position: fixed;
    bottom: $tool-bar-height + 10rpx;
    padding: 10rpx 20rpx;
    border-radius: 8rpx;
    font-size: 10px;
    background-color: rgba(30, 30, 30, 0.6);
    color: #fff;
    .triangle {
      position: absolute;
      bottom: 0;
      left: 40rpx;
      width: 0;
      height: 0;
      transform: translateY(100%);
      border-top: 8rpx solid rgba(30, 30, 30, 0.6);
      border-bottom: 8rpx solid transparent;
      border-left: 8rpx solid transparent;
      border-right: 8rpx solid transparent;
    }
  }
}

.message-content-bg {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(51, 51, 51, 0.5);
}

.message-content {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 20rpx;
  box-sizing: border-box;
  background-color: #fff;
  font-size: 28rpx;
  border-top: 1px solid #f3f3f3;
  border-bottom: 1px solid #f3f3f3;
  textarea {
    border-radius: 40rpx;
    border: 1px solid #f3f3f3;
    padding: 20rpx 40rpx;
    max-height: 100rpx;
    margin-bottom: 60rpx;
  }
  .send {
    padding: 20rpx 20rpx;
    color: #2196f3;
    white-space: nowrap;
  }
}

.save-container {
  position: fixed;
  bottom: 0;
  width: 100%;
  overflow: auto;
  transform: translateX(100%);
  transition: 0.1s;
  &.on {
    transform: translateX(0);
  }
  .bg {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .show-card {
    position: relative;
    margin: 54rpx auto 30rpx;
  }
  .save-card {
    position: absolute;
    opacity: 0;
    transform: translate(-1000%, -1000%);
  }
  .btn {
    position: relative;
    margin: auto;
    width: 556rpx;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    color: #fff;
    background-color: $main-color;
    border-radius: 44rpx;
    &.school {
      background-color: $school-main-color;
    }
  }
}

.modal {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(51, 51, 51, 0.4);

  .modal-content {
    position: relative;
    z-index: 999999999999999;
    margin: auto;
    top: 460rpx;
    width: 600rpx;
    background-color: #fff;
    border-radius: 10rpx;
    .modal-title {
      padding-top: 30rpx;
      text-align: center;
      font-size: 36rpx;
      font-weight: bold;
    }
    .modal-info {
      padding: 30rpx 30rpx 40rpx;
      font-size: 28rpx;
      color: #333;
      text-align: justify;
      view {
        margin-bottom: 20rpx;
      }
    }
    .modal-btns {
      text-align: center;
      height: 80rpx;
      line-height: 80rpx;
      border-top: 1px solid #f3f3f3;
      .btn {
        width: 50%;
      }
      .cancel {
        color: #bbb;
        border-right: 1px solid #f3f3f3;
      }
      .confirm {
        color: $main-color;
        &.school {
          color: $school-main-color;
        }
      }
    }
  }
}

.audit-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(51, 51, 51, 0.4);
  .audit-container {
    padding: 50rpx;
    width: 600rpx;
    background-color: #fff;
    border-radius: 10rpx;
    box-sizing: border-box;
    .label {
      margin-bottom: 20rpx;
      font-weight: bold;
    }
    textarea {
      margin-bottom: 30rpx;
      padding: 10rpx 20rpx;
      width: 100%;
      height: 180rpx;
      overflow: auto;
      box-sizing: border-box;
      border-radius: 10rpx;
      background-color: #f3f3f3;
      font-size: 24rpx;
      line-height: 1.6;
    }
    .btns {
      display: flex;
      justify-content: space-around;
      margin-top: 60rpx;
      .btn {
        padding: 16rpx 50rpx;
        border-radius: 40rpx;
        &.reject {
          border: 1px solid #bbb;
          color: #bbb;
        }
        &.accept {
          border: 1px solid $main-color;
          background-color: $main-color;
          color: #fff;
        }
      }
      &.school {
        .btn {
          &.accept {
            border: 1px solid $school-main-color;
            background-color: $school-main-color;
          }
        }
      }
    }
  }
}
.wechat-group-modal {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(30, 30, 30, 0.3);
  }
  image {
    width: 80%;
    z-index: 9;
  }
}
.reject-btn {
  position: relative;
  margin: auto;
  padding: 10rpx 60rpx;
  border-radius: 30rpx;
  background-color: #bbb;
  color: #fff;
}

.complain-modal {
  display: flex;
  align-items: center;
  justify-content: center;
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
    background: rgba(30, 30, 30, 0.6);
  }
  .content {
    z-index: 9;
    width: 80%;
    height: 65%;
    background: #fff;
    border-radius: 20rpx;
    box-sizing: border-box;
    padding: 20rpx;
    .title {
      padding: 20rpx 0;
      font-weight: 500;
      text-align: center;
    }
    .form {
      margin: 40rpx 30rpx;
      height: 66%;
      overflow: auto;
      .label {
        color: #707070;
        font-size: 13px;
      }
      .input {
        margin: 10rpx 0 20rpx;
        padding: 10rpx 20rpx;
        width: 100%;
        min-height: 70rpx;
        max-height: 180rpx;
        box-sizing: border-box;
        border-radius: 8rpx;
        border: 1px solid #dfdfdf;
        font-size: 13px;
      }
    }
    .imgs-content {
      display: flex;
      flex-wrap: wrap;
      position: relative;
      width: 100%;
      background-color: #fff;
      box-sizing: border-box;
      .img {
        display: block;
        position: relative;

        width: 100rpx;
        height: 100rpx;
        margin-right: 20rpx;
        margin-bottom: 20rpx;
        &.transition {
          transition: 0.3s;
        }
        &.on::after {
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

    .btn {
      width: 80%;
      text-align: center;
      padding: 18rpx 0;
      border-radius: 38rpx;
      background: $main-color;
      color: #fff;
    }
  }
}
</style>