import Vue from "vue";
import App from "./App";

import glNavbar from "./components/navbar";
import tabBar from "./components/tabbar";
import goodsList from "./components/goodsList";
import goodsListSchool from "./components/goodsList/schoolIndex.vue";
import wishList from "./components/wish/list.vue";
import glList from "./components/glList";
import actionSheet from "./components/actionSheet";
import messageIcon from "./components/messageIcon";
import slPPT from "./components/sl-ppt";
import notification from "./components/notification";

import util from "./common/util";

import "./sdk/ald-stat";

Vue.config.productionTip = false;

Vue.prototype.$common = {
  util,
};

Vue.component("gl-navbar", glNavbar);
Vue.component("tab-bar", tabBar);
Vue.component("goods-list", goodsList);
Vue.component("goods-list-school", goodsListSchool);
Vue.component("wish-list", wishList);
Vue.component("gl-li", glList);
Vue.component("action-sheet", actionSheet);
Vue.component("message-icon", messageIcon);
Vue.component("sl-ppt", slPPT);
Vue.component("notification", notification);

App.mpType = "app";

const app = new Vue({
  ...App,
});
app.$mount();
