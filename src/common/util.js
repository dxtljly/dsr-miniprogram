//let __URL = "https://dsrdev.grecycle.com.cn";
let __URL = "https://dsrprd.grecycle.com.cn";
let imgHOST = "https://www.grecycle.com.cn/src/sli/images";
let __XML = "https://jfmall.grecycle.com.cn"

let xhr = {
  get(url, data, func, awt) {
    this.send(url, data, func, awt, "GET");
  },
  post(url, data, func, awt) {
    this.send(url, data, func, awt, "POST");
  },
  delete(url, data, func, awt) {
    this.send(url, data, func, awt, "DELETE");
  },
  put(url, data, func, awt) {
    this.send(url, data, func, awt, "PUT");
  },
  send(url, data, func, awt, tp) {
    let header = {
      "content-type": "application/json",
    };
    if (uni.getStorageSync("access_token")) {
      header.Authorization = "Bearer " + uni.getStorageSync("access_token");
      header.cookie =
        "access_token_cookie=" + uni.getStorageSync("access_token");
    }
    if (!url.match("^http")) {
      url = __URL + url;
    }
    uni.request({
      url: url,
      header: header,
      data: data,
      method: tp,
      success(res) {
        function sendRes(res, toLogin) {
          if (String(res.statusCode).match(/^5/) || res.statusCode == 400) {
            uni.showToast({
              title: res.data.message ? res.data.message : "未知错误",
              icon: "none",
            });
          } else if (
            String(res.statusCode).match(/^4/) &&
            res.statusCode != 400
          ) {
            //403  未授权授权登录
            if (toLogin) {
              uni.navigateTo({
                url: "/pages/my/auth/login",
              });
            }
          }
          func({
            statusCode: res.statusCode,
            data: res.data,
          });
        }
        if (String(res.statusCode).match(/^4/) && res.statusCode != 400) {
          uni.getProvider({
            service: "oauth",
            success: (res) => {
              uni.login({
                provider: res.provider[0],
                success: (res) => {
                  uni.request({
                    url: __URL + "/user/login/" + res.code,
                    data: {},
                    method: "GET",
                    success(res) {
                      if (res.statusCode == 200) {
                        uni.setStorageSync(
                          "access_token",
                          res.data.access_token
                        );
                        local.set("user", res.data.user);
                        if (uni.getStorageSync("access_token")) {
                          header.Authorization =
                            "Bearer " + uni.getStorageSync("access_token");
                          header.cookie =
                            "access_token_cookie=" +
                            uni.getStorageSync("access_token");
                        }
                        uni.request({
                          url: url,
                          header: header,
                          data: data,
                          method: tp,
                          success(res) {
                            sendRes(res);
                          },
                        });
                      }
                    },
                  });
                },
                fail: (err) => {
                  console.error(err);
                },
              });
            },
          });
        } else {
          sendRes(res, true);
        }
      },
      fail(res) {
        func(res);
        console.log("请求失败");
        console.log(res);
        uni.showToast({
          title: "请求超时",
          icon: "none",
        });
      },
    });
  },
};

// 积分任务
let request = {
  get(url, data, func, awt) {
    this.send(url, data, func, awt, "GET");
  },
  post(url, data, func, awt) {
    this.send(url, data, func, awt, "POST");
  },
  delete(url, data, func, awt) {
    this.send(url, data, func, awt, "DELETE");
  },
  put(url, data, func, awt) {
    this.send(url, data, func, awt, "PUT");
  },
  send(url, data, func, awt, tp) {
    let header = {
      "content-type": "application/json",
    };
    if (uni.getStorageSync("integral_token")) {
      header.Authorization = "Bearer " + uni.getStorageSync("integral_token");
      // header.cookie =
      //   "access_token_cookie=" + uni.getStorageSync("access_token");
    }
    if (!url.match("^http")) {
      url = __XML + url;
    }
    uni.request({
      url,
      header,
      data,
      method: tp,
      success(res) {
        function sendRes(res) {
          if (String(res.code).match(/^5/) || res.code == 400) {
            uni.showToast({
              title: res.data.message ? res.data.message : "未知错误",
              icon: "none",
            });
          }
          func({
            code: res.data.code,
            data: res.data,
          });
        }
        if (String(res.code).match(/^4/) && res.code != 400) {
          uni.request({
            url: __XML + "/mall-auth/oauth/token",
            data: {
              "client_id": "portal-app",
              "client_secret": 123456,
              "grant_type": "password",
              "password": local.get("user").telephone,
              "username": local.get("user").telephone
            },
            method: "POST",
            success(res) {
              if (res.code == 200) {
                uni.setStorageSync(
                  "integral_token",
                  res.data.token
                );
                if (uni.getStorageSync("integral_token")) {
                  header.Authorization =
                    "Bearer " + uni.getStorageSync("integral_token");
                  // header.cookie =
                  //   "access_token_cookie=" +
                  //   uni.getStorageSync("access_token");
                }
                uni.request({
                  url,
                  header,
                  data,
                  method: tp,
                  success(res) {
                    sendRes(res);
                  },
                });
              }
            },
          });
        } else {
          sendRes(res);
        }
      },
      fail(res) {
        func(res);
        console.log("请求失败");
        console.log(res);
        uni.showToast({
          title: "请求超时",
          icon: "none",
        });
      },
    });
  },
};

var local = {
  get: function(name) {
    var o = uni.getStorageSync(name) || "",
      cut = o.indexOf(";expiretime=");
    var val = o.substring(0, cut < 0 ? o.length : cut);
    if (cut < 0) {
      return this.back(val);
    } else {
      var exp = o.substring(cut + 12);
      if (exp < this.time()) {
        local.clear(name);
        return "";
      } else {
        return this.back(val);
      }
    }
  },
  back: function(val) {
    if (val === "" || (val.indexOf("{") < 0 && val.indexOf("[") < 0)) {
      return val;
    } else {
      return JSON.parse(val);
    }
  },
  set: function(name, val, sec) {
    val = typeof val === "object" ? JSON.stringify(val) : val;
    if (sec) {
      val += ";expiretime=" + (this.time() + sec * 1000);
    }
    uni.setStorageSync(name, val);
  },
  clear: function(name) {
    uni.removeStorageSync(name);
  },
  time: function() {
    return Date.parse(new Date());
  },
};

let Host = __URL;
let allowImgs = [".png", ".jpg", ".jpeg", ".bmp", ".gif"];
let allowVedios = [".avi", ".wmv", ".mpeg", ".mp4", ".mov", ".flv", ".rmvb"];

let allowTypes = {
  imgs: allowImgs,
  videos: allowVedios,
};

let appId = "wxcc3db3276c670a74";

let getUrlParam = function(str) {
  let params = {};
  let array = str.split("&");
  array.map((val, index) => {
    let arr = val.split("=");
    params[arr[0]] = arr[1];
  });
  return params;
};

let formatDate = function(date, isTime) {
  let Y = date.getFullYear();
  let M = date.getMonth() + 1;
  M = M < 10 ? "0" + M : M;
  let D = date.getDate();
  D = D < 10 ? "0" + D : D;
  if (isTime) {
    let h = date.getHours() >= 10 ? date.getHours() : "0" + date.getHours();
    let m =
      date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes();
    let s =
      date.getSeconds() >= 10 ? date.getSeconds() : "0" + date.getSeconds();
    return Y + "-" + M + "-" + D + "  " + h + ":" + m + ":" + s;
  }

  return Y + "-" + M + "-" + D;
};

let navigateToMiniProgramAppIdList = [
  {
    name: "咕哩",
    appId: "wx3d47228a9de3c21a" /* 咕哩闲置母婴  int_id = 1*/,
    path: "/page_details/details?id=",
  },
];

let Qr = require("./qrCode/weapp-qrcode");

let shareContent = {
  title: "一个只送不卖的闲置分享平台",
  img: imgHOST + "/share.png",
  schoolTitle: "让好物循环",
  schoolImg: imgHOST + "/share-school.png",
  wishTitle: "一个只送不卖的闲置分享平台",
  wishImg: imgHOST + "/share-wish.jpg",
};

module.exports = {
  appId,
  Host,
  imgHOST,
  xhr,
  local,
  allowTypes,
  getUrlParam,
  formatDate,
  navigateToMiniProgramAppIdList,
  Qr,
  shareContent,
  request
};
