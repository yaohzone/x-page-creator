import directives from "./directives";
import filters from "./filters";
import innerComponents from "./components/index.js";
import elementUI from "./element-ui.js";
import vstorage from '@/libs/storage';
import axios from '@/libs/axios';
import api from '@/libs/api';
import apis from '@/libs/apis';
import Contextmenu from '@/components/contextmenu';

export default function globalConfig(Vue) {

    // 全局注册指令
    Vue.use(directives);

    // 全局filter
    Vue.use(filters);

    // 应用全局组件
    Vue.use(innerComponents);

    // element-ui
    Vue.use(elementUI);

    Object.defineProperties(Vue.prototype, {
        // $axios <axios 实例>
        '$axios': {
            get() {
                return axios
            }
        },
        // $api <根据本地接口需求封装的api请求方法>
        '$api': {
            get() {
                return api
            }
        },
        // $apis <基于api方法封装的并行apis请求方法>
        '$apis': {
            get() {
                return apis
            }
        },
        // $contextmenu <右键菜单>
        '$contextmenu': {
            get() {
                return Contextmenu
            }
        }

    });

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

    // 忽略Vue之外的自定义元素
    // Vue.config.ignoredElements = ['my-component'];

    // 渲染和观察期未捕获错误的处理函数
    // Vue.config.errorHandler = function(err, vm, info) {
    //     console.log(err, vm, info)
    // }

    // 给v-on 自定义键位别名 (camelCase 不可用，应当使用kebab-case)
    Vue.config.keyCodes = {
        'f1': 112,
        'up': [38, 87]
    }
}
