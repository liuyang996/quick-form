import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "drop",
      component: () => import("@/pages/form")
    },
    {
      path: "/fast_create",
      name: "fast_create",
      component: () => import("@/pages/fast_create")
    }
  ]
});
