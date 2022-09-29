<template>
    <view class="tk-list">
        <view class="tk-top">
            <view class="greenLabel"></view>
            <view class="tk-title">{{title}}</view>
        </view>
        <view  :class="showAll?'openTask':'hidTask'">
            <view v-for="(item,index) in list" :key="index">
                <view v-if="item.showStatus == 1" class="list-li">
                    <view class="li-lft">
                        <view class="icons">
                            <image
                                :src=" imgHOST + '/task/taskIcon/' + item.name + '.png'"
                                mode="widthFix"
                            />
                        </view>
                        <view class="li-txt">
                            <view class="li-title">
                                {{item.name}}
                                <span v-if=" item.times != -1" class="finishNum">({{item.finishNum}}/{{item.times}})</span>
                                <image
                                    :src="imgHOST + '/task/taskIcon/哩币.png'"
                                    mode="widthFix"
                                />
                                <span>{{item.memberTaskIntegration.integration}}</span>
                            </view>
                            <view class="li-detail">
                                {{item.description}}
                            </view>
                        </view>
                    </view>
                    <view class="li-rht">
                        <view v-if="item.finishNum == item.times" class="finish">
                            已完成
                        </view>
                        <view v-else class="tofinish">
                            去完成
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
import {imgHOST} from "@/common/util";
export default {
    name:"tk-list",
    props: {
        title: {
            type: String,
            default: ""
        },
        list: {
            type : Array,
            default: []
        },
        showAll: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            imgHOST: this.$common.util.imgHOST
        }
    },
    methods: {
    },
}
</script>
<style lang="scss" scoped>
.tk-list{
    position: relative;
    box-sizing: border-box;
    width: 100%;
    background: #fff;
    border-radius: 30rpx;
    overflow: hidden;
    padding: 10rpx 20rpx 0;
    .tk-top{
        width: 100%;
        height: 54rpx;
        display: flex;
        align-items: center;
        .greenLabel {
            margin-left: 10rpx;
            width: 4rpx;
            height: 28rpx;
            background: linear-gradient(to bottom, #60E1E2, #45DB82);
        }
        .tk-title{
            margin-left: 10rpx;
            font-size: 32rpx;
            font-weight: 600;
        }
    }
    .hidTask{
        height: 600rpx;
        overflow: hidden;
    }
    .openTask{
        height: 100%;
    }
    .list-li{
        padding: 20rpx 0;
        border-bottom: 1rpx solid #F3F3F3;
        display: flex;
        justify-content: space-between;
        .li-lft, .li-rht{
            display: flex;
            .icons{
                width: 80rpx;
                height: 80rpx;
                image{
                    width: 100%;
                    height: 100%;
                }
            }
            .li-txt{
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 80rpx;
                margin-left: 20rpx;
                max-width: 400rpx;
                .li-title{
                    display: flex;
                    font-size: 32rpx;
                    line-height: 40rpx;
                    margin-right: 20rpx;
                    image{
                        margin: auto 6rpx;
                        width: 30rpx;
                        height: 30rpx;
                    }
                    span{
                        font-size: 30rpx;
                        color: #FAAD14;
                    }
                    .finishNum{
                        margin-left: 6rpx;
                        font-size: 26rpx;
                        color: #000;
                    }
                }
                .li-detail{
                    font-size: 24rpx;
                    color: #808080;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
        .li-rht{
            flex-direction: column;
            justify-content: center;
            .finish, .tofinish{
                padding: 2rpx 25rpx;
                line-height: 50rpx;
                font-size: 34rpx;
                border-radius: 30rpx;
                border: 1rpx solid #FAAD14;
            }
            .finish{
                background: #FAAD14;
                color: #fff;
            }
            .tofinish{
                background: #fff;
                color: #FAAD14;
            }
        }
    }
    
}
</style>