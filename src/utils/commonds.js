
import {Message} from 'element-ui';
import store from '@/store';
import {session} from '@/libs/storage';
import {
    getPageComponent,
    normalizeStoreComponent,
    createPageComponent,
    sizeOf
} from '@/utils';
import {PAGE_CACHE_HISTORY_MAX_BYTES} from '@/constants.js';

export function getEditorPageTreeCache() {
    let cacheList = session.get('pageTreeCacheHistory');
    if(!Array.isArray(cacheList)) cacheList = [cacheList];
    return cacheList[0];
}

// 缓存页面内容
export function cacheEditorPageTree() {
    let cacheList = session.get('pageTreeCacheHistory');
    if(!Array.isArray(cacheList)) cacheList = cacheList ? [cacheList] : [];
    let storeData = normalizeStoreComponent(store.state.pageEditor.pageTree);
    cacheList.unshift(storeData);

    // 清理超限缓存历史
    let totalSize;
    while ((totalSize = sizeOf(cacheList)) > PAGE_CACHE_HISTORY_MAX_BYTES) {
        // console.log('[clear cache history]', totalSize);
        cacheList.pop();
    }

    // console.log('[cacheList size] >> ', sizeOf(storeData), totalSize, formatSize(totalSize));
    return session.set('pageTreeCacheHistory', cacheList);
}

// 是否允许撤销操作
export function allowUndoEditorPageTreeCache() {
    let cacheList = session.get('pageTreeCacheHistory');
    if(!Array.isArray(cacheList)) cacheList = [cacheList];
    if(cacheList.length > 1) {
        return cacheList
    }
    return false;
}

// 撤销页面内容缓存， 返回上一次缓存
export function undoEditorPageTreeCache() {
    let cacheList = allowUndoEditorPageTreeCache();
    if(!cacheList) return false;
    cacheList.shift();
    session.set('pageTreeCacheHistory', cacheList);
    commondSetPageTree(cacheList[0]);
    return cacheList[0];
}

// 清理编辑页面缓存
export function clearEditorPageTreeCacheHistory() {
    session.remove('pageTreeCacheHistory');
}

// 清空页面内容
export function commondClearPageTree() {
    store.commit('pageEditor/clearPageTree');
}

// 设置页面内容
export function commondSetPageTree(pageTree) {
    store.commit('pageEditor/setPageTree', pageTree);
}

// 设置页面编辑状态
export function commondTogglePageEditeState(value) {
    store.commit('pageEditor/editStateToggle', value);
}

// 页面类型切换
export function commondTogglePageModeState(value) {
    store.commit('pageEditor/pageModeToggle', value);
}


// 设置页面信息
export function commondSetPageInfo(pageInfo) {
    store.commit('pageEditor/updatePageInfo', pageInfo);
}

// 设置聚焦组件
export function commondSetFocusComponent(component) {
    if(!component) return;
    if(typeof component !== 'object') {
        component = getPageComponent(component);
        if(!component) return;
    }
    store.commit('pageEditor/setFocusComponent', component);
}

function getNextShouldFocusComponent(component) {
    if (!component) return store.getters['pageEditor/pageComponents'][0];
    let children = component.parent && component.parent.children;
    if (!children) return store.getters['pageEditor/pageComponents'][0];
    let index = children.indexOf(component);
    if (index === -1) return store.getters['pageEditor/pageComponents'][0];
    let nextComponent;
    if (index < children.length-1) {
        // 下一个
        nextComponent = children[index+1];
    } else if (index > 0) {
        // 上一个
        nextComponent = children[index-1];
    } else {
        // 父节点
        nextComponent = component.parent
    }
    return nextComponent;
}

// 移除等原因设置下一个焦点组件
export function setNextFocusComponent(component) {
    let nextComponent = getNextShouldFocusComponent(component);
    commondSetFocusComponent(nextComponent);
}

// 显示组件编辑器
export function commondShowComponentEditor(component) {
    commondSetFocusComponent(component);
    commondToggleComponentEditor(true);
}

// 切换组件编辑器显示状态
export function commondToggleComponentEditor(value) {
    store.commit('pageEditor/componentEditing', value);
}

// 编辑组件
export function commondEditComponent(component, {data, children}={}) {
    store.commit('pageEditor/editComponent', {component, data, children});
}

// 置空子组件
export function commondClearComponentChildren(component) {
    store.commit('pageEditor/clearComponentChildren', component);
}

// 剪切组件
export function commondCutComponent(component) {
    store.commit('pageEditor/setClipboardComponent', component);
    store.commit('pageEditor/removeComponent', component);
}

// 复制组件
export function commondCopyComponent(component) {
    store.commit('pageEditor/setClipboardComponent', component);
}

// 粘贴组件
export function commondPasteComponent(targetComponent, {data, children}={}) {
    store.commit('pageEditor/pasteClipboardComponent', {targetComponent, data, children});
}

// 删除组件
export function commondRemoveComponent(component) {
    let parentComponent = component && component.parent;
    if(!parentComponent) {
        // 根容器组件
        return Message.warning('不能删除跟容器');
    }
    store.commit('pageEditor/removeComponent', component)
}

// 放置新组件
export function commondPutNewComponent(targetComponent, {name, initialData, initialChildren}={}) {
    if(!name || !targetComponent) return;
    store.commit('pageEditor/putComponent', {
        currentComponent: createPageComponent(name, initialData, initialChildren),
        targetComponent
    });
}

// 插入新子组件
export function commondAppendNewComponent(targetComponent, {name, initialData, initialChildren}={}) {
    if(!name || !targetComponent) return;
    store.commit('pageEditor/appendChildComponent', {
        currentComponent: createPageComponent(name, initialData, initialChildren),
        targetComponent
    });
}

// 之前插入新相邻组件
export function commondInsertBeforeComponent(targetComponent, {name, initialData, initialChildren}={}) {
    if(!name || !targetComponent) return;
    store.commit('pageEditor/insertBeforeComponent', {
        currentComponent: createPageComponent(name, initialData, initialChildren),
        targetComponent
    });
}

// 之后插入新相邻组件
export function commondInsertAfterComponent(targetComponent, {name, initialData, initialChildren}={}) {
    if(!name || !targetComponent) return;
    store.commit('pageEditor/insertAfterComponent', {
        currentComponent: createPageComponent(name, initialData, initialChildren),
        targetComponent
    });
}

// 移动组件
export function commondMoveComponent(targetComponent, currentComponent) {
    store.commit('pageEditor/putComponent', {currentComponent, targetComponent});
}

// 上移组件
export function commondMoveUpComponent(component) {
    store.commit('pageEditor/moveUpComponent', component);
}

// 下移组件
export function commondMoveDownComponent(component) {
    store.commit('pageEditor/moveDownComponent', component);
}

// 置顶组件
export function commondMoveToTopComponent(component) {
    store.commit('pageEditor/moveToTopComponent', component);
}

// 置底组件
export function commondMoveToBottomComponent(component) {
    store.commit('pageEditor/moveToBottomComponent', component);
}

// 前外移组件
export function commondMoveToBeParentPrevSiblingComponent(component) {
    store.commit('pageEditor/moveToBeParentPrevSiblingComponent', component);
}

// 后移组件
export function commondMoveToBeParentNextSiblingComponent(component) {
    store.commit('pageEditor/moveToBeParentNextSiblingComponent', component);
}

// 切换FocusComponent
export function tabFocusComponent() {
    let focusComponent = store.state.pageEditor.focusComponent;
    let pageComponents = store.getters['pageEditor/pageComponents'];
    let index = pageComponents.indexOf(focusComponent);
    if(index > -1) {
        index++;
        if(index > pageComponents.length-1) index = 0;
        commondSetFocusComponent(pageComponents[index]);
    }
}

// 反向切换FocusComponent
export function reverseTabFocusComponent() {
    let focusComponent = store.state.pageEditor.focusComponent;
    let pageComponents = store.getters['pageEditor/pageComponents'];
    let index = pageComponents.indexOf(focusComponent);
    if(index > -1) {
        index--;
        if(index < 0) index = pageComponents.length - 1;
        commondSetFocusComponent(pageComponents[index]);
    }
}
