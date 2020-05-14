/**
 * 全局注册页面组件
 */


function regGlobalComponent(Vue, componentRequire, prefix){
    componentRequire.keys().forEach(fileName => {
        let options = componentRequire(fileName);
        options = options.default || options
        let name = fileName.replace(/^.+\//, '').replace(/\.\w+$/, '');
        Vue.component((prefix ? prefix + '-' : '') + name, options);
    });
}

export default function registerGlobalPageComponents(Vue) {

    let layoutComponent = require.context('./page/layout', false, /\.(vue|js)$/);
    regGlobalComponent(Vue, layoutComponent, 'layout');

    let basicComponent = require.context('./page/basic', false, /\.(vue|js)$/);
    regGlobalComponent(Vue, basicComponent, 'basic');

    let advancedComponent = require.context('./page/advanced', false, /\.(vue|js)$/);
    regGlobalComponent(Vue, advancedComponent, 'advanced');
}
