import {Message} from 'element-ui';
import cloneDeep from 'lodash/cloneDeep';
import store from '@/store';
import {
    noop,
    getPageComponent,
    getComponentSetting,
    allowPutComponent,
    allowAppendChild,
    allowBeSibling,
    cacheEditorPageTree,
    commondCutComponent,
    commondCopyComponent,
    commondPasteComponent,
    commondRemoveComponent,
    commondClearComponentChildren,
    commondPutNewComponent,
    commondAppendNewComponent,
    commondInsertBeforeComponent,
    commondInsertAfterComponent,
    commondShowComponentEditor,
    getPrevSiblingComponent,
    getNextSiblingComponent,
    commondMoveUpComponent,
    commondMoveDownComponent,
    getFirstSiblingComponent,
    getLastSiblingComponent,
    commondMoveToTopComponent,
    commondMoveToBottomComponent,
    commondMoveToBeParentPrevSiblingComponent,
    commondMoveToBeParentNextSiblingComponent,
    getEndPointComponentMovePosition,
    allowUndoEditorPageTreeCache,
    undoEditorPageTreeCache
} from '@/utils';



// 操作命令集 --新指令在此增加，且需要增加
const contextmenuCommonds = {
    cache: {
        label: '缓存'
    },
    undoCache: {
        label: '撤销',
        disabled() {
            return !allowUndoEditorPageTreeCache();
        }
    },
    edit: {
        label: '编辑'
    },
    cut: {
        label: '剪切',
        disabled() {
            return this.context.component.role === 'root'
        }
    },
    copy: {
        label: '复制',
        disabled() {
            return this.context.component.role === 'root'
        }
    },
    paste: {
        label: '粘贴',
        disabled() {
            let clipboardComponent = store.state.pageEditor.clipboardComponent;
            if(!clipboardComponent) return true;
            if(clipboardComponent.role === 'fixed') return false; // 允许在任意位置粘贴fixed
            return !allowPutComponent(this.context.component, clipboardComponent)
        }
    },
    clearChildren: {
        label: '置空',
        disabled() {
            let children = this.context.component.children;
            return !children || !children.length;
        }
    },
    remove: {
        label: '移除',
        disabled() {
            return this.context.component.role === 'root';
        }
    },
    appendContainer : {
        label: '插入普通容器',
        disabled() {
            return !allowAppendChild(this.context.component, 'layout-container')
        }
    },
    appendAbsoluteContainer : {
        label: '插入定位容器',
        disabled() {
            return !allowAppendChild(this.context.component, 'layout-absolute-container')
        }
    },
    appendFixedContainer : {
        label: '插入悬浮容器'
    },
    appendRow: {
        label: '插入行容器',
        disabled() {
            return !allowAppendChild(this.context.component, 'layout-row')
        }
    },
    appendColumn: {
        label: '插入列容器',
        disabled() {
            return !allowAppendChild(this.context.component, 'layout-column')
        }
    },
    insertColumnBefore: {
        label: '在之前插入列容器',
        disabled() {
            return !allowBeSibling(this.context.component, 'layout-column')
        }
    },
    insertColumnAfter: {
        label: '在之后插入列容器',
        disabled() {
            return !allowBeSibling(this.context.component, 'layout-column')
        }
    },
    moveUp: {
        label: '前移',
        disabled() {
            return !getPrevSiblingComponent(this.context.component);
        }
    },
    moveDown: {
        label: '后移',
        disabled() {
            return !getNextSiblingComponent(this.context.component);
        }
    },
    moveToTop: {
        label: '置首',
        disabled() {
            return !getFirstSiblingComponent(this.context.component);
        }
    },
    moveToBottom: {
        label: '置尾',
        disabled() {
            return !getLastSiblingComponent(this.context.component);
        }
    },
    moveToBeParentPrevSibling: {
        label: '前外移',
        disabled() {
            let component = this.context.component;
            let parent = component.parent;
            if(!parent || parent.role === 'root') return true;
            return !allowBeSibling(parent, component);
        }
    },
    moveToBeParentNextSibling: {
        label: '后外移',
        disabled() {
            let component = this.context.component;
            let parent = component.parent;
            if(!parent || parent.role === 'root') return true;
            return !allowBeSibling(parent, component);
        }
    }

}


class Commond {
    constructor(name, label, context) {
        this.name = name;
        this.label = label;
        this.context = context;
    }

    get commond() {
        return this[this.name] || noop;
    }

    cache() {
        if(cacheEditorPageTree()) {
            Message.success('页面内容已缓存至历史记录');
        }else {
            Message.error('页面内容缓存失败');
        }
    }

    undoCache() {
        undoEditorPageTreeCache();
    }

    edit() {
        commondShowComponentEditor(this.context.component);
    }

    cut() {
        commondCutComponent(this.context.component);
    }

    copy () {
        commondCopyComponent(this.context.component);
    }

    paste() {
        let clipboardComponent = store.state.pageEditor.clipboardComponent;
        let customData;
        if(clipboardComponent.position) {
            let position = getEndPointComponentMovePosition(this.context.event, clipboardComponent, this.context.component);
            position && (customData = {props: position});
        }
        commondPasteComponent(this.context.component, {data: customData});
    }

    clearChildren() {
        commondClearComponentChildren(this.context.component);
    }

    remove() {
        commondRemoveComponent(this.context.component);
    }

    appendContainer() {
        commondAppendNewComponent(this.context.component, {name: 'layout-container'});
    }

    appendAbsoluteContainer() {
        let componentSetting = getComponentSetting('layout-absolute-container');
        let component = cloneDeep(componentSetting);
        let position = getEndPointComponentMovePosition(this.context.event, component, this.context.component);
        position && (component.initialData = {props: position});
        commondAppendNewComponent(this.context.component, component);
    }

    appendFixedContainer() {
        let componentSetting = getComponentSetting('layout-fixed-container');
        let component = cloneDeep(componentSetting);
        let position = getEndPointComponentMovePosition(this.context.event, component, this.context.component);
        position && (component.initialData = {props: position});
        commondAppendNewComponent(store.state.pageEditor.pageTree, component);
    }

    appendRow () {
        commondAppendNewComponent(this.context.component, {name: 'layout-row'});
    }

    appendColumn() {
        commondAppendNewComponent(this.context.component, {name: 'layout-column'});
    }

    insertColumnBefore() {
        commondInsertBeforeComponent(this.context.component, {name: 'layout-column'});
    }

    insertColumnAfter() {
        commondInsertAfterComponent(this.context.component, {name: 'layout-column'});
    }

    moveUp() {
        commondMoveUpComponent(this.context.component);
    }

    moveDown() {
        commondMoveDownComponent(this.context.component);
    }

    moveToTop() {
        commondMoveToTopComponent(this.context.component);
    }

    moveToBottom() {
        commondMoveToBottomComponent(this.context.component);
    }

    moveToBeParentPrevSibling() {
        commondMoveToBeParentPrevSiblingComponent(this.context.component)
    }

    moveToBeParentNextSibling() {
        commondMoveToBeParentNextSiblingComponent(this.context.component)
    }
}

class ContextmenuOptions {
    constructor(context) {
        this.context = context || {};
        this.options = commonCommonds.slice();
    }
    get commonds() {
        return this.evalute();
    }
    // a放置到b之前
    before(a, b) {
        if(!a) return;
        if(!b) {
            this.add(a);
            return;
        }

        if(a !== '|') this.remove(a); // a存在则移除 --原位移除 & 避免重复
        let idx = this.options.indexOf(b);

        // b不存在则add
        if(idx === -1) {
            this.add(a);
            return;
        }
        a = Array.isArray(a) ? a : [a];
        this.options.splice(idx, 0, ...a);
    }
    // 添加
    add(option) {
        if(Array.isArray(option)) {
            option.forEach(this.add.bind(this));
            return;
        }
        this.remove(option);
        this.options.push(option);
    }
    // 移除
    remove(option) {
        if(Array.isArray(option)) {
            option.forEach(this.remove.bind(this));
            return;
        }
        if(option === '|') return;
        let idx = this.options.indexOf(option);
        if(idx > -1) {
            this.options.splice(idx, 1);
        }
    }
    evalute() {
        let options = this.options;
        let commonds = []
        for(let i=0, len=options.length; i<len; i++) {
            let key = options[i];
            if(key === '|' && i !== 0 && commonds[commonds.length-1] !== '|') {
                commonds.push(key);
                continue;
            }
            let {name, label, disabled} = contextmenuCommonds[key] || {};
            if(!name) continue;
            if(commonds.indexOf(name) > -1) continue;
            let commond = new Commond(name, label, this.context);
            commond.disabled = !!(typeof disabled === 'function' && disabled.call(commond));
            commonds.push(commond);
        }
        if(commonds[commonds.length-1] === '|') commonds.length = commonds.length-1;
        return commonds
    }
}


const commondKeys = Object.keys(contextmenuCommonds);
commondKeys.forEach(key => {
    let commond = contextmenuCommonds[key];
    commond.name = key;
});
// 分隔符
commondKeys.push('|');

// 通用项
const commonCommonds = [
    'edit',
    'cut',
    'copy',
    'paste',
    'remove',
    '|',
    'appendFixedContainer',
    '|',
    'moveUp',
    'moveToTop',
    'moveDown',
    'moveToBottom',
    'moveToBeParentPrevSibling',
    'moveToBeParentNextSibling',
    // '|',
    // 'cache',
    // 'undoCache'
];

export function getContextmenuOptions(event) {
    let targetComponent = getPageComponent(event.currentTarget.dataset['editor']);
    if(!targetComponent) return [];

    const options = new ContextmenuOptions({event, component: targetComponent});

    // 特殊处理
    if(targetComponent.role === 'root') {
        options.before(['appendContainer', 'appendAbsoluteContainer'], 'appendFixedContainer');
        options.remove(['cut', 'copy', 'remove', 'moveUp', 'moveDown', 'moveToTop', 'moveToBottom', 'moveToBeParentPrevSibling', 'moveToBeParentNextSibling']);
    }
    if(targetComponent.role === 'container') {
        options.before('clearChildren', 'remove');
        options.before(['appendContainer', 'appendRow', 'appendAbsoluteContainer'], 'appendFixedContainer');
    }
    if(targetComponent.role === 'row') {
        options.before('clearChildren', 'remove');
        options.before(['appendColumn'], 'appendFixedContainer');
    }
    if(targetComponent.role === 'column') {
        options.before('clearChildren', 'remove');
        options.before(['appendContainer', 'insertColumnBefore', 'insertColumnAfter', 'appendAbsoluteContainer'], 'appendFixedContainer');
    }
    if(targetComponent.role === 'fixed' || targetComponent.role === 'absolute') {
        options.before('clearChildren', 'remove');
        options.before(['appendContainer'], 'appendFixedContainer');
        options.remove(['moveUp', 'moveDown', 'moveToTop', 'moveToBottom']);
        if(targetComponent.role === 'fixed') {
            options.remove(['moveToBeParentPrevSibling', 'moveToBeParentNextSibling']);
        }
    }
    if(store.state.pageEditor.pageMode === 'mobile') {
        // 移动模式不允许使用fixed容器
        options.remove('appendFixedContainer');
    }
    return options.commonds;
}
