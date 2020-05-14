import SystemError from './system/error';
import NotFound from './system/404';

export default {
    PageHome: () => import(/* webpackChunkName: "page-home" */ './page/index'),
    PageEditor: () => import(/* webpackChunkName: "page-editor" */ './page/editor'),
    Document: () => import(/* webpackChunkName: "document" */ './document'),

    SystemError,
    NotFound
}
