/**
 * 注册全局组件
 */

import registerGlobalPageComponents from './view.js';

import baseEditorOptions from './editor-base';
import propsEditorOptions from './editor-props';

function regGlobalComponent(Vue, componentRequire, prefix, suffix){
    componentRequire.keys().forEach(fileName => {
        let options = componentRequire(fileName);
        options = options.default || options
        let name = fileName.replace(/^.+\//, '').replace(/\.\w+$/, '');
        let componentName = (prefix ? prefix + '-' : '') + name + (suffix ? '-' + suffix : '');
        Vue.component(componentName, options);
    });
}


// 组件编辑器组件注册
function regGlobalEditorComponent(Vue, componentRequire, prefix, suffix){
    let BaseEditor = Vue.extend(baseEditorOptions);
    componentRequire.keys().forEach(fileName => {
        let options = componentRequire(fileName);
        options = options.default || options;
        let name = fileName.replace(/^.+\//, '').replace(/\.\w+$/, '');
        let componentName = (prefix ? prefix + '-' : '') + name + (suffix ? '-' + suffix : '');
        options.name = componentName;
        let EditorComponent = BaseEditor.extend(options);
        Vue.component(componentName, EditorComponent);
    });
}

// 属性编辑器组件注册
function regGlobalPropsEditorComponent(Vue, componentRequire, prefix, suffix){
    let BaseEditor = Vue.extend(propsEditorOptions);
    componentRequire.keys().forEach(fileName => {
        let options = componentRequire(fileName);
        options = options.default || options;
        let name = fileName.replace(/^.+\//, '').replace(/\.\w+$/, '');
        let componentName = (prefix ? prefix + '-' : '') + name + (suffix ? '-' + suffix : '');
        options.name = componentName;
        let EditorComponent = BaseEditor.extend(options);
        Vue.component(componentName, EditorComponent);
    });
}

export default function registerGlobalComponents(Vue) {

    /* ---------------- 页面组件 ---------------- */
    registerGlobalPageComponents(Vue);

    /* ---------------- 通用组件 ---------------- */
    let commonComponent = require.context('./common', false, /\.(vue|js)$/);
    regGlobalComponent(Vue, commonComponent);

    /* ------------- 编辑组件 editor ------------ */
    let editorComponent = require.context('./page/editor', false, /\.(vue|js)$/);
    regGlobalEditorComponent(Vue, editorComponent, 'editor');

    let propsEditorComponent = require.context('./page/props-editor', false, /\.(vue|js)$/);
    regGlobalPropsEditorComponent(Vue, propsEditorComponent, null, 'props-editor');

}
