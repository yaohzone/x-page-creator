
import pages from '@/pages';

export default [
    {
        path: '/',
        name: 'index',
        redirect: '/page/editor',
        component: pages.Index,
        meta: {
            title: 'Xpage Editor'
        }
    },
    {
        path: '/page',
        component: {
            render(h) {
                return h('router-view', {key: this.$route.fullPath})
            }
        },
        children: [
            {
                path: '',
                name: 'page.home',
                component: pages.PageHome,
                meta: {
                    title: 'Home'
                }
            },
            {
                path: 'editor/:id?',
                name: 'page.editor',
                component: pages.PageEditor,
                meta: {
                    title: '内容编辑'
                }
            }
        ]
    },
    {
        path: '/document',
        name: 'document',
        component: pages.Document,
        meta: {
            title: '使用文档'
        }
    },
    {
        path: '/404',
        name: 'notFound',
        component: pages.NotFound,
        alias: '*',
        // redirect: '/',
        meta: {
            title: '404'
        }
    }
];
