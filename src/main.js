import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import * as VueGoogleMaps from "vue2-google-maps";
const gmKey = "AIzaSyBBhRndXNS_Cku1RAnv5w5ggGbkbK7Zn1Q";

Vue.use(VueGoogleMaps, {
  load: {
    key: gmKey,
    libraries: "places" // necessary for places input
  }
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
