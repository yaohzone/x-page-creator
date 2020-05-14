/**
 * 注册全局指令
 */

export default function registerGlobalDirectives(Vue) {
    let requireFn = require.context('.', false, /\.js$/);
    requireFn.keys().forEach(fileName => {
        let options = requireFn(fileName);
        options = options.default || options;
        let name = fileName.replace(/^.+\//, '').replace(/\.\w+$/, '');
        if (name !== 'index') {
            Vue.directive(name, options);
        }
    });
}
