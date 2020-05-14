import Vue from 'vue';
import Router from 'vue-router';
import routes from './routes';

Vue.use(Router);

const router = new Router({
    // mode: 'history',
    mode: 'hash', // 项目资源放置在静态资源服务，没有配置代理，这里用hash模式
    linkActiveClass: 'active',
    routes,
});

router.afterEach((to, from) => {
    window.document.title = to.meta.title || process.env.VUE_APP_TITLE;
});

export default router;
