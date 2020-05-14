import defaultsDeep from 'lodash/defaultsDeep';
import cloneDeep from 'lodash/cloneDeep';
import Vue from 'vue';

import {
    transformTreeToList,
    normalizeViewComponent,
    copyPageComponent,
    pastePageComponent,
    createPageRoot,
    removeChildComponent,
    putComponent,
    appendChildComponent,
    getPrevSiblingComponent,
    getNextSiblingComponent,
    getFirstSiblingComponent,
    getLastSiblingComponent,
    insertBeforeComponent,
    insertAfterComponent,
    extractPageStateFromStoreTemplate,
    commondSetPageTree,
    mergeComponentData,
    setNextFocusComponent,
    commondSetFocusComponent
} from '@/utils';
import {SEO_KEYWORDS, SEO_DESCRIPTION} from '@/constants.js';

import request from '@/libs/api';

const pageEditor = {
    /**
     * mutations/actions内部this只向全局store，而getters中this没有值
     */
    namespaced: true,
    state: {
        // 编辑状态
        editing: 1,
        // 页面模式
        pageMode: 'pc', // pc / mobile
        // 页面信息
        pageInfo: {
            id: '',
            isNew: true, // 新版搭建系统
            name: '',
            isTemplate: 0, // 0/1
            op: 'add', // 'add'/'edit'
            isPublic: 0, // 0/1 私有/共享模板
            detail: {
                title: '', // title
                keywords: SEO_KEYWORDS || '', // keywords
                desc: SEO_DESCRIPTION || '', // description
                webContent: '', // PC HTML
                mobileContent: '' // mobile HTML
            }
        },
        // 页面数据
        pageTree: createPageRoot(),
        // 当前被拖拽组件
        draggingComponent: null,
        // 当前粘贴板组件
        clipboardComponent: null,
        // 当前焦点组件
        focusComponent: null,
        // 显示组件编辑框
        componentEditing: false
    },

    getters: {
        pageComponents(state) {
            return transformTreeToList(state.pageTree);
        },
        pageComponentsMap(state, getters) {
            return getters.pageComponents.reduce((map, component) => {
                map[component.id] = component;
                return map
            }, {});
        },
        pageMaxComponentId(state, getters) {
            let ids = getters.pageComponents.map(i => i.id);
            ids.push(0); // 保证有最大值
            return Math.max.apply(null, ids) + 1;
        }

    },

    mutations: {
        // 页面编辑状态切换
        editStateToggle(state, status){
            if(status !== void 0) {
                status = Number(!!status);
            } else {
                status = Number(!state.editing);
            }
            state.editing = status;
            // 预览模式清理焦点组件
            if(!status) state.focusComponent = null;
        },
        // 切换页面类型
        pageModeToggle(state, mode) {
            mode = (mode || '').toLowerCase();
            if(['pc', 'mobile'].indexOf(mode) === -1) mode = 'pc';
            if(mode === state.pageMode) return;
            state.pageMode = mode;
            // 设置相应类型页面树
            let {webContent='', mobileContent=''} = state.pageInfo.detail || {};
            let pageTree = extractPageStateFromStoreTemplate(mode === 'mobile' ? mobileContent : webContent);
            commondSetPageTree(pageTree);
            // 清理状态
            state.clipboardComponent = null;
            state.focusComponent = null;
        },
        componentEditing(state, status) {
            if(status !== void 0) {
                status = !!status;
            } else {
                status = !state.componentEditing;
            }
            state.componentEditing = status;
        },
        updatePageInfo(state, pageInfo) {
            if(pageInfo) {
                state.pageInfo = defaultsDeep(pageInfo, state.pageInfo);
            }
        },
        // 设置页面内容
        setPageTree(state, pageTree) {
            state.pageTree = normalizeViewComponent(pageTree, true);
        },
        // 清空页面组件
        clearPageTree(state) {
            commondSetPageTree(null);
            state.focusComponent = null;
            state.componentEditing = false;
        },
        // 设置当前被拖拽组件
        setDraggingComponent(state, component) {
            if(component && typeof component === 'object') {
                state.draggingComponent = component;
            }
        },
        // 清除当前被拖拽组件
        clearDraggingComponent(state) {
            state.draggingComponent = null;
        },
        // 设置当前焦点组件
        setFocusComponent(state, component) {
            if(component && typeof component === 'object') {
                let prevEl = state.focusComponent && state.focusComponent.vnode.componentInstance.$el;
                if(prevEl) prevEl.removeAttribute('focus');
                state.focusComponent = component;
                Vue.nextTick(() => {
                    let el = component.vnode.componentInstance.$el;
                    el.setAttribute('focus', true);
                    el.focus();
                })
            }
        },
        // 编辑页面组件
        editComponent(state, {component, data, children}) {
            if(data && typeof data === 'object') {
                component.data = mergeComponentData(component.data, data);
            }
            if(Array.isArray(children)) {
                component.children = cloneDeep(children);
            }
        },
        // 置空子组件
        clearComponentChildren(state, component) {
            if(component && component.children) {
                component.children = [];
            }
        },
        // 放置组件
        putComponent(state, {currentComponent, targetComponent}) {
            putComponent(targetComponent, currentComponent);
        },
        // 插入子组件
        appendChildComponent(state, {currentComponent, targetComponent}) {
            appendChildComponent(targetComponent, currentComponent);
        },
        // 之前插入相邻组件
        insertBeforeComponent(state, {currentComponent, targetComponent}) {
            insertBeforeComponent(targetComponent, currentComponent);
        },
        // 之后插入相邻组件
        insertAfterComponent(state, {currentComponent, targetComponent}) {
            insertAfterComponent(targetComponent, currentComponent);
        },
        // 组件位置上移
        moveUpComponent(state, component) {
            let targetComponent = getPrevSiblingComponent(component);
            if(!targetComponent) return;
            insertBeforeComponent(targetComponent, component);
            commondSetFocusComponent(component);
        },
        // 组件位置下移
        moveDownComponent(state, component) {
            let targetComponent = getNextSiblingComponent(component);
            if(!targetComponent) return;
            insertAfterComponent(targetComponent, component);
            commondSetFocusComponent(component);
        },
        // 组件位置置首
        moveToTopComponent(state, component) {
            let targetComponent = getFirstSiblingComponent(component);
            if(!targetComponent) return;
            insertBeforeComponent(targetComponent, component);
            commondSetFocusComponent(component);
        },
        // 组件位置置尾
        moveToBottomComponent(state, component) {
            let targetComponent = getLastSiblingComponent(component);
            if(!targetComponent) return;
            insertAfterComponent(targetComponent, component);
            commondSetFocusComponent(component);
        },
        // 组件上外移
        moveToBeParentPrevSiblingComponent(state, component) {
            let targetComponent = component.parent;
            if(!targetComponent || targetComponent.role === 'root') return;
            insertBeforeComponent(targetComponent, component);
            commondSetFocusComponent(component);
        },
        // 组件下外移
        moveToBeParentNextSiblingComponent(state, component) {
            let targetComponent = component.parent;
            if(!targetComponent || targetComponent.role === 'root') return;
            insertAfterComponent(targetComponent, component);
            commondSetFocusComponent(component);
        },
        // 设置剪贴板
        setClipboardComponent(state, component) {
            if(component && typeof component === 'object') {
                let copyed = copyPageComponent(component);
                copyed.parent = null;
                state.clipboardComponent = copyed;
            }
        },
        // 粘贴组件 --允许更新复制的组件
        pasteClipboardComponent(state, {targetComponent, data, children}) {
            if(!state.clipboardComponent) return;
            let newComponent = pastePageComponent(cloneDeep(state.clipboardComponent), {maxId: this.getters['pageEditor/pageMaxComponentId']});

            if(data && typeof data === 'object') {
                newComponent.data = mergeComponentData(newComponent.data, data);
            }
            if(Array.isArray(children)) {
                newComponent.children = cloneDeep(children);
            }
            // fixed组件时，重置targetComponent为根组件
            if(newComponent.role === 'fixed') targetComponent = state.pageTree;
            putComponent(targetComponent, newComponent);
            commondSetFocusComponent(newComponent);
        },
        // 移除页面组件
        removeComponent(state, component) {
            setNextFocusComponent(component);
            removeChildComponent(component.parent, component);
        }
    },

    actions: {
        updatePageFromServer({commit, state}, id) {
            if(!id) return Promise.reject();
            return request('/template/findById', {
                method: 'post',
                data: {id}
            }).then(pageInfo => {
                commit('updatePageInfo', pageInfo);
                // 解析pageTree
                let template = state.pageMode === 'mobile' ? pageInfo.detail.mobileContent : pageInfo.detail.webContent;
                let pageTree = extractPageStateFromStoreTemplate(template);
                commondSetPageTree(pageTree);
                return pageInfo
            })
        }
    },

    modules: {},

    plugins: []
}


export default pageEditor;
