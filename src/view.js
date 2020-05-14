/* 展示界面资源入口 */

import "./assets/style/view.less";

import Vue from 'vue';
// import filters from "./filters";
import pageComponents from "@/components/view.js";
import vstorage from '@/libs/storage';
import PageParser from '@/components/page-parser.js';
import {GLOBAL_STATE_VARIABLE} from '@/constants.js';

// // 全局filter
// Vue.use(filters);

// 注册页面组件
Vue.use(pageComponents);

// 安装localStorage/sessionStorage封装工具
Vue.use(vstorage, {
    localStorage: {
        name: 'localStore' // 添加 $localStore 工具对象
    },
    sessionStorage: {
        name: 'session' // 添加 $session 工具对象
    }
});

// vue 在启动时生成生产提示 开关
Vue.config.productionTip = false;

const STATE = window[GLOBAL_STATE_VARIABLE];

/* eslint-disable no-new */
new Vue({
    render: h => h(PageParser, { props: {tree: STATE, edit: false}})
}).$mount("#app");
