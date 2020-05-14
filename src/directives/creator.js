
/**
 * 拖拽组件指令
 *
 * */
import cloneDeep from 'lodash/cloneDeep';
import {
    getComponentSetting,
    getVueComponent
} from '@/utils';
import store from '@/store';
import {
    CREATE_DATATRANSFER_TYPE,
    DRAG_EFFECT_ALLOWED
} from '@/constants.js';
import {currentEnterComponentElement} from './editor.js';

export default {
    bind: componentCreatorInit,
    // update: componentEditorInit,
    unbind(el, dir, vnode) {
        const options = dir.value;
        el.removeEventListener('dragstart', getComponentDragStartFn(options, true), false);
        el.removeEventListener('dragend', componentDragend, false);
    }
}

function componentCreatorInit(el, dir, vnode) {
    const options = dir.value;
    el.setAttribute('data-creator', options.name);
    // el.setAttribute('tabindex', 0);
    el.setAttribute('draggable', true);

    el.addEventListener('dragstart', getComponentDragStartFn(options), false);
    el.addEventListener('dragend', componentDragend, false);
}

const componentDragCreateFns = {};

function getComponentDragStartFn(options, destroy) {
    let name = options.name;
    let fn = componentDragCreateFns[name];
    if(fn) return fn;
    if(destroy) return; // 销毁事件时没有该事件函数则退出
    fn = evt => componentDragstart(evt, options);
    componentDragCreateFns[name] = fn;
    return fn;
}

// 拖拽传递组件信息
function componentDragstart(evt, options) {
    evt.stopPropagation();
    if (evt.target !== evt.currentTarget) return;
    if(!options.name) return;
    let componentSetting = getComponentSetting(options.name);
    if(!componentSetting) return;
    let vueComponent = getVueComponent(options.name);
    if(!vueComponent) return;

    const dt = evt.dataTransfer;
    dt.clearData();
    dt.setData(CREATE_DATATRANSFER_TYPE, options.name);
    store.commit('pageEditor/setDraggingComponent', cloneDeep(componentSetting));

    if(options.dragImage) {
        // 拖拽显示图
        dt.setDragImage(options.dragImage, 0, 0);
    }
    // 允许的拖拽效果
    dt.effectAllowed = DRAG_EFFECT_ALLOWED[CREATE_DATATRANSFER_TYPE];

    // console.log(CREATE_DATATRANSFER_TYPE, componentSetting);
}

function componentDragend(evt) {
    // console.log('[creator::dragend]', evt.currentTarget);
    // dragend事件currentTarget元素为拖拽元素而不是enter元素，这里使用enter元素
    currentEnterComponentElement && currentEnterComponentElement.removeAttribute('drag-focus');
    store.commit('pageEditor/clearDraggingComponent');
}
