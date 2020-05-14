import "./assets/style/index.less";

import Vue from 'vue';
import router from './router';
import store from './store';
import App from './App.vue';
import VueConf from "./vue-config.js";

// Vue配置
Vue.use(VueConf);

/* eslint-disable no-new */
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
