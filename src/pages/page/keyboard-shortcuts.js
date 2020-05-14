import Vue from 'vue';
import {Message} from 'element-ui';
import uniq from 'lodash/uniq';
import store from '@/store';
import {
    isInnerElement,
    cacheEditorPageTree,
    tabFocusComponent,
    reverseTabFocusComponent,
    commondCutComponent,
    commondCopyComponent,
    commondPasteComponent,
    commondRemoveComponent,
    commondTogglePageEditeState,
    commondMoveUpComponent,
    commondMoveDownComponent,
    commondMoveToTopComponent,
    commondMoveToBottomComponent,
    commondMoveToBeParentPrevSiblingComponent,
    commondMoveToBeParentNextSiblingComponent,
    commondToggleComponentEditor,
    getEndPointComponentMovePosition,
    mousePointCurrentPositionX,
    mousePointCurrentPositionY,
    undoEditorPageTreeCache
} from '@/utils';

export function createKeyboardShortcutsListener(context) {
    return evt => {
        const keyCode = evt.keyCode || evt.charCode || evt.which;
        let {key, altKey, ctrlKey, metaKey, shiftKey} = evt;
        key = (key || '').toLowerCase();
        let focusComponent = store.state.pageEditor.focusComponent;
        // console.log('[keyboardShortcutsListener]', keyCode, key, ctrlKey, focusComponent, evt.target, evt.currentTarget);
        let matchs = matchShortcuts(evt);
        // console.log('[keyboardShortcutsListener] matchs >>', matchs);
        if(matchs.length) {
            matchs.forEach(actionKey => {
                let action = actionsMap[actionKey];
                typeof action === 'function' && action.call(context, evt);
            });
        }
    }
}

const keyAlias = {
    shift: 'shiftKey',
    ctrl: 'ctrlKey',
    alt: 'altKey',
    meta: 'metaKey'
}

// ~ -> 严格匹配
const shortcutSettingsMap = {
    toggleEditState: ['~Ctrl+`'], // --Ctrl + Tab被浏览器占用了
    hideComponentEditor: ['~escape'],
    // cachePage: ['~Ctrl+S'],
    // undeCachePage: ['~Ctrl+Z'],
    savePageContent: ['~Ctrl+S'],
    tabFocusComponent: ['~Tab'],
    reverseTabFocusComponent: ['~Shift+Tab'],
    cutComponent: ['~Ctrl+X'],
    copyComponent: ['~Ctrl+C'],
    pasteComponent: ['~Ctrl+V'],
    removeComponent: ['~Ctrl+Delete'],
    moveupComponent: ['~Ctrl+arrowup', '~Ctrl+arrowleft'],
    moveToTopComponent: ['~Ctrl+Shift+arrowup', '~Ctrl+Shift+arrowleft'],
    movedownComponent: ['~Ctrl+arrowdown', '~Ctrl+arrowright'],
    moveToBottomComponent: ['~Ctrl+Shift+arrowdown', '~Ctrl+Shift+arrowright'],
    moveToBeParentPrevSiblingComponent: ['~Ctrl+Alt+arrowup', '~Ctrl+Alt+arrowleft'],
    moveToBeParentNextSiblingComponent: ['~Ctrl+Alt+arrowdown', '~Ctrl+Alt+arrowright']
}

function isInWorkspace(el) {
    return isInnerElement(el, document.getElementById('editorWorkspace'), window.Infinity);
}

function focuscomponentEventActionAssert(evt) {
    if(!store.state.pageEditor.editing) return;
    if(!isInWorkspace(evt.target)) return;
    let focusComponent = store.state.pageEditor.focusComponent;
    if(!focusComponent) return;
    evt.preventDefault();
    return focusComponent;
}

const actionsMap = {
    /* ------ 全局行为 -------- */
    // 编辑/预览模式切换
    toggleEditState(evt) {
        evt.preventDefault();
        commondTogglePageEditeState();
    },
    // 隐藏组件编辑面板
    hideComponentEditor(evt) {
        evt.preventDefault();
        commondToggleComponentEditor(false);
    },
    // 本地缓存页面数据
    cachePage(evt) {
        evt.preventDefault();
        if(cacheEditorPageTree()) {
            Message.success('页面内容已缓存至历史记录');
        }else {
            Message.error('页面内容缓存失败');
        }
    },
    // 保存页面内容
    savePageContent(evt) {
        evt.preventDefault();
        this.savePageContent();
    },
    // 撤销缓存
    undeCachePage(evt) {
        undoEditorPageTreeCache();
    },

    /* -------- 组件行为 --------- */
    // 切换focusComponent
    tabFocusComponent(evt) {
        let focusComponent = focuscomponentEventActionAssert(evt);
        if(!focusComponent) return;
        tabFocusComponent(focusComponent);
    },

    // 反向切换focusComponent
    reverseTabFocusComponent(evt) {
        let focusComponent = focuscomponentEventActionAssert(evt);
        if(!focusComponent) return;
        reverseTabFocusComponent(focusComponent);
    },

    // 剪切组件
    cutComponent(evt) {
        let focusComponent = focuscomponentEventActionAssert(evt);
        if(!focusComponent) return;
        if(focusComponent.role === 'root') return
        commondCutComponent(focusComponent);
        Message.success('已剪切');
    },
    // 复制组件
    copyComponent(evt) {
        let focusComponent = focuscomponentEventActionAssert(evt);
        if(!focusComponent) return;
        if(focusComponent.role === 'root') return;
        commondCopyComponent(focusComponent);
        Message.success('已复制');
    },
    // 粘贴组件
    pasteComponent(evt) {
        let focusComponent = focuscomponentEventActionAssert(evt);
        if(!focusComponent) return;
        let customData;
        let clipboardComponent = store.state.pageEditor.clipboardComponent;
        if(clipboardComponent.position) {
            let position = getEndPointComponentMovePosition(
                {
                    x: mousePointCurrentPositionX,
                    y: mousePointCurrentPositionY
                },
                clipboardComponent,
                focusComponent
            );
            position && (customData = {props: position});
        }
        commondPasteComponent(focusComponent, {data: customData});
    },
    // 移除组件
    removeComponent(evt) {
        let focusComponent = focuscomponentEventActionAssert(evt);
        if(!focusComponent) return;
        commondRemoveComponent(focusComponent);
    },
    // 组件前移
    moveupComponent(evt) {
        let focusComponent = focuscomponentEventActionAssert(evt);
        if(!focusComponent) return;
        commondMoveUpComponent(focusComponent);
    },
    // 组件置首
    moveToTopComponent(evt) {
        let focusComponent = focuscomponentEventActionAssert(evt);
        if(!focusComponent) return;
        commondMoveToTopComponent(focusComponent);
    },
    // 组件后移
    movedownComponent(evt) {
        let focusComponent = focuscomponentEventActionAssert(evt);
        if(!focusComponent) return;
        commondMoveDownComponent(focusComponent);
    },
    // 组件置尾
    moveToBottomComponent(evt) {
        let focusComponent = focuscomponentEventActionAssert(evt);
        if(!focusComponent) return;
        commondMoveToBottomComponent(focusComponent);
    },
    // 组件前外移
    moveToBeParentPrevSiblingComponent(evt) {
        let focusComponent = focuscomponentEventActionAssert(evt);
        if(!focusComponent) return;
        commondMoveToBeParentPrevSiblingComponent(focusComponent);
    },
    // 组件后外移
    moveToBeParentNextSiblingComponent(evt) {
        let focusComponent = focuscomponentEventActionAssert(evt);
        if(!focusComponent) return;
        commondMoveToBeParentNextSiblingComponent(focusComponent);
    }
}

const shortcutsMap = new Map();
Object.keys(shortcutSettingsMap).forEach(key => {
    let option = shortcutSettingsMap[key];
    if(typeof option === 'string') {
        shortcutsMap.set(parseShortcut(option), key);
    }else if(Array.isArray(option)) {
        option.forEach(item => {
            if(typeof item === 'string') {
                shortcutsMap.set(parseShortcut(item), key);
            }
        })
    }
});

function parseShortcut(dir) {
    let strict = /^~+/.test(dir);
    if(strict) dir = dir.replace(/^~+/, '');
    let keys = dir.split('+').map(i => i.toLowerCase());
    let desc = {strict};
    for(let i=0, len=keys.length; i<len; i++) {
        let keyword = keys[i];
        if(keyword in keyAlias) {
            // 辅助键
            desc[keyAlias[keyword]] = true;
        }else if(/\d+/.test(keyword)) {
            // keyCode
            desc.keyCode = Number(keyword);
        } else {
            // key
            (desc.keys = desc.keys || []).push(keyword);
        }
    }
    return desc
}

// 快捷键行为匹配
function matchShortcuts(evt) {
    let _keyCode = evt.keyCode || evt.charCode || evt.which;
    let {key: _key, shiftKey: _shiftKey, ctrlKey: _ctrlKey, altKey: _altKey, metaKey: _metaKey} = evt;
    _key = (_key || '').toLowerCase();

    let matchs = [];
    shortcutsMap.forEach((action, shortcut) => {
        let {strict, keyCode, keys: [keyword], shiftKey, ctrlKey, altKey, metaKey} = shortcut;
        if(keyCode) {
            // 优先判断keyCode
            if(keyCode !== _keyCode) return;
        } else if(keyword) {
            // 否则判断key
            if(keyword !== _key) return;
        }

        if(shiftKey && !_shiftKey) return;
        if(ctrlKey && !_ctrlKey) return;
        if(altKey && !_altKey) return;
        if(metaKey && !_metaKey) return;

        if(strict) {
            if(!shiftKey && _shiftKey) return;
            if(!ctrlKey && _ctrlKey) return;
            if(!altKey && _altKey) return;
            if(!metaKey && _metaKey) return;
        }

        matchs.push(action);
    });

    return uniq(matchs);
}
