<template>
   <view
    :style="'position:relative;height:calc(100% - ' + (statusBarHeight + navigationHeight) +'px);'"
   >
      <gl-navbar back home text="支付记录"></gl-navbar>
      <view class="table">
        <view class="tr-th">
          <view class="th">订单编号</view>
          <view class="th">预付邮费</view>
          <view class="th">实际邮费</view>
          <view class="th">退（欠）款</view>
        </view>
        <block>
          <view class="tr-td" v-for="item in tableList" :key="item">
            <view class="td" style="left:10rpx;">{{item.id}}</view>
            <view class="td">{{item.name}}</view>
            <view class="td">{{item.age}}</view>
            <view class="td">{{item.hobby}}</view>
          </view>
        </block>
      </view>
   </view>
</template>
<script>
  export default{
    data() {
        return {
          tableList: [{
              id: 123456,
              name: '张三',
              age: '19',
              hobby: '游泳'
            },
            {
              id: 123456,
              name: '李四',
              age: '21',
              hobby: '绘画'
            },
            {
              id: 123456,
              name: '王二',
              age: '29',
              hobby: '滑板'
            },
            {
              id: 123456,
              name: '码字',
              age: '20',
              hobby: '蹦极'
            }
          ]
        };
      }
    }
</script>
<style lang="scss" scoped>
.table {
  margin-top: 20rpx;
  border: 0px solid darkgray;
  background-color: #fff;
  .tr-th {
    display: flex;
    justify-content: space-between;
    justify-content: space-around; 
    width: 100%;
    border-bottom: 1rpx solid rgb(219, 219, 219);
    //justify-content: center;
    height: 3rem;
    //align-items: center;
  }
  .tr-td {
    display: flex;
    justify-content: space-between;
    justify-content: space-around; 
    width:100%;
    //justify-content: center;
    //text-align: center;
    }
}
</style>
