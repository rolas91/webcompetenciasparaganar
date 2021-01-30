import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
import VueClipboard from "vue-clipboard2";
Vue.use(VueRouter);
Vue.use(VueClipboard);
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function(/* { store, ssrContext } */) {
  const router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  });

  router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth === "none")) {
      next();
      return;
    }
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (localStorage.getItem("token") == null) {
        next({
          path: "/login",
          params: { nextUrl: to.fullPath }
        });
      } else {
        let user = JSON.parse(localStorage.getItem("user"));
        if (to.matched.some(record => record.meta.is_admin)) {
          if (user.is_admin === 1) {
            next();
          } else {
            next({ name: "dashboard" });
          }
        } else {
          next();
        }
      }
    } else if (to.matched.some(record => record.meta.guest)) {
      if (localStorage.getItem("token") == null) {
        next();
      } else {
        next({ name: "dashboard" });
      }
    } else {
      next();
    }
  });

  return router;
}
