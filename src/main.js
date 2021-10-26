// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import create from "./utils/Create";

import lui from "@ylliu/lui";
import "@ylliu/lui/lib/lui.css";
Vue.use(lui);
// import "liuyang223/lui/lib/lui.css";
Vue.config.productionTip = false;
import Element from "element-ui";
Vue.use(Element, { size: "small", zIndex: 3000 });
import "element-ui/lib/theme-chalk/index.css";

const baseURL = "https://mock.mengxuegu.com/mock/6163a9208cf3bb7ca95955f4";

// 引入本组件
import WtiForm from "./pages/package";
// import {baseURL} from '@/config/env.js';
// 这里是配置字典请求接口。如果没有字典接口的话，Vue.use 的时候可以不传第二个参数
const props = {
  dynamicSelectOption: {
    type: Object,
    default: () => ({
      batchRequest: false, //是否进行批量请求-默认不批量。(批量请求，接口需要配合)
      // 这是字典接口的 url。baseURL 指开发和生产环境下，不同的前缀。
      dictUrl: `https://mock.mengxuegu.com/mock/6163a9208cf3bb7ca95955f4/ceshi/api/dict`,
      //不批量时的接口前缀
      baseURL,
      // 异步请求时，请求内容是一个对象或一个数组。
      // 如果是对象，那么包含一个 key 和一个数组。
      // 如果是数组，那么只有这个数组。
      // 数组是所有字典 FormItem 的 parentKey 的集合
      queryKey: "search", // 这是请求时那个 key。如果为空，则请求时是一个数组，而不是一个对象
      parentKey: "parentKey", // 这是返回结果的 parentKey。意思是，同一个 parentKey 归属于同一个下拉框选项
      value: "value", // 这是下拉框选项的值
      label: "label" // 这是下拉框选项的 label,
    })
  }
};
Vue.use(WtiForm, props);

Vue.prototype.$create = create;
/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});
