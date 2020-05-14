
/**
 * 搭建平台与页面展示共享方法
 * --注意搭建平台与展示页面资源分离打包,将展示页面需要用到的方法抽离到该文件内
 **/

import cloneDeep from 'lodash/cloneDeep';
import {componentsMap} from '@/page-components.js';
import {ANCHOR_PREFIX} from '@/constants.js';

// 获取组件配置数据 --注意避免将该配置数据设置为响应式属性
export function getComponentSetting(componentName) {
    return componentsMap[componentName];
}

// 迭代处理子组件
export function iterateHandleChildren(children, handler) {
    if(!Array.isArray(children)) return [];
    let _children = [];
    let args = Array.prototype.slice.call(arguments, 2);
    for(let i=0, len=children.length; i<len; i++) {
        let child = children[i];
        let type = typeof child;
        if(
            (child && type === 'object') ||
            (type === 'string' && child !== '') ||
            type === 'number'
        ) {
            // 只处理组件数据对象以及字符串和数字
            child = handler(child, ...args);
            child && _children.push(child);
        }
    }
    return _children;
}

/**
 * 标准化单组件数据
 * 组件数据属性：
 * {
 *  id: '从1开始++的页面唯一组件编号',
 *  name: '组件名',
 *  data: '组件数据',
 *  children: '子组件'
 * }
 *
 * */

export function normalizeViewComponent(component, isRoot) {
    if(!isRoot && typeof component !== 'object') return component;
    let {children, data={}} = component || {};
    // 根组件
    if(isRoot) {
        component = {id: 1, name: 'layout-root'};
    }
    if(!component.id || !component.name) return; // 组件数据必须包含id和name
    let componentSetting = getComponentSetting(component.name);
    if(!componentSetting) return; // 组件名必须在页面组件列表中存在

    component.data = data && typeof data === 'object' ? data : {};

    // 递归处理子组件
    if(Array.isArray(children)) {
        component.children = iterateHandleChildren(children, normalizeViewComponent, false);
    } else {
        delete component.children;
    }

    // 原型对象不是配置对象则设置原型为配置对象  --注意避免将该配置数据设置为响应式属性
    if(!component._componentSetting) {
        component = Object.assign(Object.create(componentSetting), component);
    }
    // console.log('normalizeViewComponent > ', component, componentSetting)
    return component;
}



// 创建页面vnode树
export function createPageComponentVNode(component, create, editMode) {
    if(typeof component !== 'object') return component;

    let data = cloneDeep(component.data || {});
    data.key = component.id;
    let attrs = data.attrs = data.attrs || {};
    attrs.id = `${ANCHOR_PREFIX}-${component.id}`;
    let dirs = data.directives = data.directives || [];
    let editorIdx = dirs.findIndex(dir => dir.name === 'editor');
    if(editMode) {
        // 添加/更新editor指令
        let editorDir = {name: 'editor', value: component};
        if(editorIdx > -1) {
            dirs.splice(editorIdx, 1, editorDir);
        } else {
            dirs.push(editorDir);
        }
    } else if(editorIdx > -1){
        // 清理editor指令
        dirs.splice(editorIdx, 1);
    }
    let children = component.children;
    if(children && children.length) {
        children = iterateHandleChildren(children, createPageComponentVNode, create, editMode);
    }

    let vnode = create(component.name, data, children || [])
    component.vnode = vnode;
    return vnode;
}

// 创建页面根容器数据对象
export function createPageRoot() {
    return normalizeViewComponent(null, true);
}
