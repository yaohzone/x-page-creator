/**
 * 通用工具方法
 *
 * */
import Vue from 'vue';
import template from 'lodash/template';
import escapeRegExp from 'lodash/escapeRegExp'
import cloneDeep from 'lodash/cloneDeep';
import defaultsDeep from 'lodash/defaultsDeep';
import mergeWith from 'lodash/mergeWith';
import devalue from '@nuxt/devalue';
import store from '@/store';

import {
    DRAG_BE_FOCUS_CHILD,
    DRAG_BE_FOCUS_SIBLING,
    GLOBAL_STATE_VARIABLE
} from '@/constants';
import {
    isUndefined,
    hasOwnProperty,
    getComponentSetting,
    normalizeViewComponent,
    iterateHandleChildren,
} from '@/utils';
import PageParser from '@/components/page-parser.js';

// 组件数据合并
export function mergeComponentData(defaults, data) {
    let _defaults = cloneDeep(defaults);
    return mergeWith(_defaults, data, (a, b, key, objA, objB) => {
        if(isUndefined(b) && hasOwnProperty(objB, key)) {
            // 只要data中设置了key为undefined时，就返回undefined，而不是使用defaults中默认值
            return objA[key] = b;
        }
        if(Array.isArray(b)) {
            // 数组不做深入合并
            return objA[key] = cloneDeep(b);
        }
    })
}

// 获取页面组件数据对象
export function getPageComponent(componentId) {
    if(!componentId) return;
    return store.getters['pageEditor/pageComponentsMap'][componentId];
}

// 标准化存储的组件数据对象
export function normalizeStoreComponent(component, isRoot) {
    if(!isRoot && typeof component !== 'object') return component;
    let {id, name, children, data} = component || {};
    if(!id || !name) return;
    let componentSetting = getComponentSetting(name);
    if(!componentSetting) return; // 组件名必须在页面组件列表中存在

    // 过滤空data
    data = data && Object.keys(data).length ? data : void 0;

    // 递归处理子组件
    if(children && children.length) {
        children = iterateHandleChildren(children, normalizeStoreComponent, false);
    }
    children = children && children.length ? children : void 0;

    return {id, name, children, data};
}

// 创建组件数据对象
export function createPageComponent(componentName, initialData, initialChildren) {
    let componentSetting = getComponentSetting(componentName);
    return normalizeViewComponent({
        id: store.getters['pageEditor/pageMaxComponentId'],
        name: componentName,
        data: defaultsDeep(initialData, componentSetting.initialData),
        children: initialChildren ? initialChildren : componentSetting.initialChildren
    })
}

 /**
  * 复制组件数据对象：
  * 复制目标是树结构，即递归复制
  * */
 export function copyPageComponent(component) {
    if((typeof component !== 'object')) return component;

    let _copyed = normalizeViewComponent({
        id: component.id,
        name: component.name,
        data: cloneDeep(component.data || {})
    })
    if(!_copyed) return;

    let children = component.children;
    if(children && children.length) {
        children = iterateHandleChildren(children, copyPageComponent);
    }
    // 单独设置children，避免重复递归
    children && (_copyed.children = children);
    return _copyed;
}

 /**
  * 粘贴组件数据对象：
  * 粘贴目标是树结构，即递归复制，此时还未插入到页面树中，
  * 不能直接使用store.getters['pageEditor/pageMaxComponentId']获取maxId
  * */
export function pastePageComponent(component, recursion) {
    if((!component || typeof component !== 'object')) return component;
    if(!recursion || typeof recursion !== 'object') recursion = {maxId: 10000};

    let newComponent = normalizeViewComponent({
        id: recursion.maxId,
        name: component.name,
        data: cloneDeep(component.data || {})
    })
    if(!newComponent) return;

    recursion.maxId++;

    let children = component.children;
    if(children && children.length) {
        children = iterateHandleChildren(children, pastePageComponent, recursion);
    }
    // 单独设置children，避免重复递归
    children && (newComponent.children = children);
    return newComponent;
}

// child是否parent内部组件
export function isInnerComponent(child, parent) {
    if (!parent || !child || child === parent) return false;
    while ((child = child.parent)) {
        if (parent === child) return true;
    }
    return false;
}

// parent内是否允许放置child
export function allowAppendChild(parent, child) {
    if(!parent || !child || parent === child) return false;
    child = typeof child === 'string' ? getComponentSetting(child) : child;
    if(!child) return;
    if(isInnerComponent(parent, child)) return false; // parent处于child之中
    let allowRoles = parent.allowRoles;
    if(!allowRoles || !allowRoles.length) return false; // parent不允许嵌套子组件
    if(allowRoles.indexOf(child.role) === -1) return false; // parent不允许嵌套child
    return true;
}

// 是否允许成为同级组件
export function allowBeSibling(target, component) {
    if(!target || !component /* || target === component */) return false;
    component = typeof component === 'string' ? getComponentSetting(component) : component;
    if(!target.parent) return false; // 无父组件 --只能存在一个根组件
    if(!target.parent.children) return false; // 脏数据
    return allowAppendChild(target.parent, component);
}

// 是否允许放置组件逻辑
export function allowPutComponent(target, component) {
    if(!component || !target) return false;
    // 先判断target是否可插入component
    if(allowAppendChild(target, component)) return DRAG_BE_FOCUS_CHILD;
    // 否则判断target父组件是否可插入component
    if(allowBeSibling(target, component)) return DRAG_BE_FOCUS_SIBLING;
    return false;
}

// 插入子组件 --这里为原子操作，不进行特殊处理，特殊行为建议进行更高级封装
export function appendChildComponent(parent, child, forceAppend) {
    if(!allowAppendChild(parent, child)) return;

    let children = parent.children;
    if(!Array.isArray(children)) {
        children = Vue.set(parent, 'children', []);
    }

    // 非强制插入时，子组件已存在父组件中 --退出
    if(!forceAppend && children.indexOf(child) > -1) return;

    // -- 解绑原父子关系
    removeChildComponent(child.parent, child);
    // 插入&链接
    children.push(child);
    child.parent = parent;
    return true;
}

// 插入目标组件之前
export function insertBeforeComponent(target, component, skipCheck) {
    if(target === component) return;
    if(!skipCheck && !allowBeSibling(target, component)) return;

    let children = target.parent.children;
    let targetIndex = children.indexOf(target);
    if(targetIndex > -1) {
        let componentIndex = children.indexOf(component);
         // 位置未发生变化 --退出
        if(componentIndex > -1 && targetIndex === componentIndex + 1) return;
        // -- 解绑原父子关系
        let removed = removeChildComponent(component.parent, component);
        // 重新获取位置 --component在target之前时位置会发生变化
        removed && (targetIndex = children.indexOf(target));
        // 插入&链接
        children.splice(targetIndex, 0, component);
        component.parent = target.parent;
        return true;
    }
}

// 插入目标组件之后
export function insertAfterComponent(target, component) {
    if(target === component) return;
    if(!allowBeSibling(target, component)) return;

    let children = target.parent.children;
    let targetIndex = children.indexOf(target);
    if(targetIndex > -1) {
        let nextSibling = children[targetIndex+1];
        if(nextSibling) {
            // 跳过检查，直接插入
            return insertBeforeComponent(nextSibling, component, true);
        } else {
            // 强制插入末尾
            return appendChildComponent(target.parent, component, true);
        }
    }
}

// 删除子组件
export function removeChildComponent(parent, child) {
    if(!parent || !child) return;
    let children = parent.children;
    if(children && children.length) {
        let idx = children.indexOf(child);
        if(idx > -1) {
            children.splice(idx, 1);
            child.parent = null
            return true;
        }
    }
}

// 放置组件
export function putComponent(target, component) {
    let putAction = allowPutComponent(target, component);
    if(!putAction) return;
    switch(putAction) {
        case DRAG_BE_FOCUS_CHILD:
            // appendChild
            return appendChildComponent(target, component);
        case DRAG_BE_FOCUS_SIBLING:
            // be sibling
            {
                let children = target.parent.children;
                let componentIndex = children.indexOf(component);
                if(componentIndex > -1) {
                    // 同级位置调整
                    let targetIndex = children.indexOf(target);
                    if(targetIndex < componentIndex) {
                        // 上移 --放置目标组件之前
                        return insertBeforeComponent(target, component);
                    }
                }
                // 默认放置目标组件之后
                return insertAfterComponent(target, component);
            }
    }
}

// 获取前一个兄弟组件
export function getPrevSiblingComponent(component) {
    if(!component || !component.parent || !component.parent.children) return;
    let children = component.parent.children;
    if(children.length <= 1) return;
    if(children[0] === component) return;
    let idx = children.indexOf(component);
    if(idx > -1) return children[idx-1];
}

// 获取下一个兄弟组件
export function getNextSiblingComponent(component) {
    if(!component || !component.parent || !component.parent.children) return;
    let children = component.parent.children;
    if(children.length <= 1) return;
    if(children[children.length-1] === component) return;
    let idx = children.indexOf(component);
    if(idx > -1) return children[idx+1];
}

// 获取第一个兄弟组件
export function getFirstSiblingComponent(component) {
    if(!component || !component.parent || !component.parent.children) return;
    let children = component.parent.children;
    if(children.length <= 1) return;
    if(children[0] !== component) return children[0];
}

// 获取最后一个兄弟组件
export function getLastSiblingComponent(component) {
    if(!component || !component.parent || !component.parent.children) return;
    let children = component.parent.children;
    if(children.length <= 1) return;
    if(children[children.length-1] !== component) return children[children.length-1];
}


const storeTemplateSource = `<div id="app">{{HTMLTemplate}}</div><script>window.${GLOBAL_STATE_VARIABLE}={{pageState}}</script>`;
const mobileStyleResource = `<style>html, body { position: relative; max-width: 750px; margin-left: auto; margin-right: auto;}</style>`;
const extractPageStatePattern = new RegExp(escapeRegExp(`<script>window.${GLOBAL_STATE_VARIABLE}=`) + `([\\s\\S]+?)<\\/script>`);
const storeTemplateCompile = template(storeTemplateSource, {
    interpolate: /{{([\s\S]+?)}}/g,
    evaluate: /{%([\s\S]+?)%}/g
});
const PageParserComponent = Vue.extend(PageParser);

// 标准化存储模板
export function normalizeStoreTemplate(pageTree, mode) {
    return new Promise(resolve => {
        pageTree = normalizeStoreComponent(pageTree);
        let _pageTree = devalue(pageTree);

        const storeElement = document.createElement('div');
        storeElement.style.position = 'absolute';
        storeElement.style.left = 0;
        storeElement.style.right = 0;
        storeElement.style.top = 0;
        storeElement.style.bottom = 0;
        storeElement.style.zIndex = -1;
        storeElement.style.overflow = 'hidden';
        storeElement.style.opacity = 0;

        const innerElement = document.createElement('div');
        storeElement.appendChild(innerElement);
        document.body.appendChild(storeElement);
        let componentInstance = new PageParserComponent({
                propsData: {
                    tree: pageTree,
                    edit: false
                }
            }).$mount(innerElement);

        setTimeout(() => {
            let htmlTemplate = componentInstance.$el.outerHTML;

            let result = storeTemplateCompile({pageState: _pageTree, HTMLTemplate: htmlTemplate});
            if(mode === 'mobile') {
                result = mobileStyleResource + result;
            }

            // 销毁
            componentInstance.$destroy();
            document.body.removeChild(storeElement);

            resolve(result);
        }, 200);
    })
}

// 从存储模板提取pageTree
export function extractPageStateFromStoreTemplate(template) {
    let match = (template || '').match(extractPageStatePattern);
    match = match && match[1];
    let STATE;
    if(match) {
        try {
            STATE = (0, window.eval)(match);
        } catch (e) {
            console.error(e);
        }
    }
    return STATE;
}
