<template>
   <view
    :style="'position:relative;height:calc(100% - ' + (statusBarHeight + navigationHeight) +'px);'"
   >
    <gl-navbar back home text="支付记录"></gl-navbar>
    <view style="width:100%;height:26rpx"></view>
    <view class="table">
      <view class="advance-area">
        <view class="flex-box thead">
          <view class="item item-1">订单编号</view>
          <view class="item item-2">预付邮费</view> 
          <view class="item item-3">实际邮费</view>
          <view class="item item-4">退 (欠) 款</view>
        </view>
        <view class="flex-box tbody">
          <block v-if="length == 0">
            <view class="table-tr-no">
              <view>暂无退 (欠) 款</view>
            </view>
          </block>
          <block v-else>
            <view class="table-tr" v-for="(item,index) in tableList" :key="index">
              <view class="item item-1">{{ item.id }}</view>
              <view class="item item-2">{{ item.name }}</view>
              <view class="item item-3">{{ item.age }}</view>
              <block v-if="item.hobby < 0">
                <view style="color:red;" class="item item-4">{{ item.hobby }}</view>
              </block>
              <block v-else>
                <view style="color:green;" class="item item-4">{{ item.hobby }}</view>
              </block>
            </view>
          </block>
        </view>
			</view>
   </view>
</template>
<script>
  export default{
    data() {
        return {
          tableList: [
            {
              id: 123456890,
              name: '20',
              age: '19',
              hobby: '2'
            },
            {
              id: 123456890,
              name: '20',
              age: '21',
              hobby: '-1'
            },
            {
              id: 123456890,
              name: '20',
              age: '29',
              hobby: '2'
            },
            {
              id: 123456890,
              name: '20',
              age: '20',
              hobby: '-2'
            },
            {
              id: 123456890,
              name: '20',
              age: '20',
              hobby: '-2'
            },
            {
              id: 123456890,
              name: '20',
              age: '20',
              hobby: '-2'
            },
            {
              id: 123456890,
              name: '20',
              age: '20',
              hobby: '-2'
            }
          ],
          length:1
        };
      }
    }
</script>
<style lang="scss" scoped>
.advance-area {
  background-color: #fff;
  .item {
    font-size: 28rpx;
    border: 1upx solid #e0e0e0;
    border-width: 0 0 1upx 0;
    box-sizing: border-box;
    text-align: center;
    padding: 10upx 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .thead {
    .item {
      font-weight: bold;
      padding: 16upx 0;
    }
  }
  .tbody {
    max-height: 1080upx;
    overflow-y: scroll;

    .table-tr {
      width: 100%;
      display: flex;
      font-size: 24upx;
    }

    .table-tr-no {
      width: 100%;
      height: 1060rpx;
      text-align: center;
      padding-top: 20upx;
    }
  }
  .flex-box {
    display: flex;
    flex-wrap: wrap;
    .item-1 {
      flex: 25%;
      height: 105rpx;
    }

    .item-2 {
      flex: 25%;
      height: 105rpx;
    }

    .item-3 {
      flex: 25%;
      height: 105rpx;
    }

    .item-4 {
      flex: 25%;
      height: 105rpx;
    }
  }
}
</style>
