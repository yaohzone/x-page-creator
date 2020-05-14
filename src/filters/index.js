/**
 * 注册全局filter
 */

 import {camelCase} from '@/utils';

export default function registerGlobalFilters(Vue) {
    let requireFn = require.context('.', false, /\.js$/);
    requireFn.keys().forEach(fileName => {
        let options = requireFn(fileName);
        options = options.default || options;
        let name = fileName.replace(/^.+\//, '').replace(/\.\w+$/, '');
        if (name !== 'index') {
            Vue.filter(camelCase(name), options);
        }
    });
}
