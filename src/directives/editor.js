
/**
 * 组件编辑指令
 * 为普通组件添加编辑操作
 *
 * */

import defaultsDeep from 'lodash/defaultsDeep';
import intersection from 'lodash/intersection';
import Contextmenu from '@/components/contextmenu';
import store from '@/store';
import {
    CREATE_DATATRANSFER_TYPE,
    MOVE_DATATRANSFER_TYPE,
    POS_DATATRANSFER_TYPE,
    HANDLE_RELATED_DATATRANSFER_TYPES,
    DRAG_EFFECT_ALLOWED,
    DRAG_BE_FOCUS_CHILD,
    DRAG_BE_FOCUS_SIBLING
} from '@/constants.js';
import {
    allowPutComponent,
    getPageComponent,
    createPageComponent,
    getContextmenuOptions,
    commondPutNewComponent,
    commondMoveComponent,
    commondShowComponentEditor,
    commondEditComponent,
    commondSetFocusComponent,
    setStartPointOffsetInComponent,
    resetStartPointOffsetInComponent,
    getEndPointComponentMovePosition
} from '@/utils';

// 当前enter组件
export let currentEnterComponentElement;

export default {
    bind: componentEditorInit,
    unbind(el, dir, vnode) {
        let component = dir.value;
        el.removeAttribute('data-editor');
        el.removeAttribute('data-role');
        el.removeAttribute('tabindex');
        el.removeAttribute('draggable');

        el.removeEventListener('click', componentClickFocusListener, false);
        el.removeEventListener('dblclick', componentEditListener, false);

        el.removeEventListener('dragstart', componentDragstartListener, false);
        el.removeEventListener('dragenter', componentDragenterListener, false);
        el.removeEventListener('dragover', componentDragoverListener, false);
        el.removeEventListener('dragleave', componentDragleaveListener, false);
        el.removeEventListener('drop', componentDropListener, false);
        el.removeEventListener('dragend', componentDragendListener, false);

        el.removeEventListener('contextmenu', componentContextmenuListener, false);

        if(component.position) {
            let movers = el.querySelectorAll('[data-mover]');
            Array.prototype.forEach.call(movers, mover => {
                if(mover.parentNode === el) {
                    mover.removeEventListener('dragstart', positionMoverDragstartListener, false);
                    mover.removeEventListener('dragend', positionMoverDragendListener, false);
                    el.removeChild(mover);
                }
            });
        }
    }
}

function componentEditorInit(el, dir, vnode) {
    // console.log('[editor::componentEditorInit]', el, dir, vnode)

    const component = dir.value;
    el.setAttribute('data-editor', component.id);
    el.setAttribute('data-role', component.role);
    el.setAttribute('tabindex', 0);

    // 聚焦
    el.addEventListener('click', componentClickFocusListener, false);
    // 双击编辑
    el.addEventListener('dblclick', componentEditListener, false);

    // 拖拽功能
    component.role !== 'root' && el.setAttribute('draggable', true);
    el.addEventListener('dragstart', componentDragstartListener, false);
    el.addEventListener('dragover', componentDragoverListener, false);
    el.addEventListener('dragleave', componentDragleaveListener, false);
    el.addEventListener('dragenter', componentDragenterListener, false);
    el.addEventListener('drop', componentDropListener, false);
    el.addEventListener('dragend', componentDragendListener, false);

    // 右键菜单
    el.addEventListener('contextmenu', componentContextmenuListener, false);

    // 拖动 --偏移定位
    if(component.position) {
        let mover = document.createElement('div');
        mover.setAttribute('data-mover', component.role);
        mover.setAttribute('draggable', true);
        mover.addEventListener('dragstart', positionMoverDragstartListener, false);
        mover.addEventListener('dragend', positionMoverDragendListener, false);
        el.appendChild(mover);
    }
}

// 设置聚焦
function componentClickFocusListener(evt) {
    if(evt.ctrlKey) {
        evt.stopPropagation();
        evt.preventDefault();
        commondSetFocusComponent(evt.currentTarget.dataset['editor']);
    }
}

function componentEditListener(evt) {
    evt.stopPropagation();
    let componentId = evt.currentTarget.dataset['editor'];
    componentId && commondShowComponentEditor(componentId);
}


/**
 * 拖拽事件注意：
 * dragstart 事件中设置effectAllowed，标记允许的拖拽行为，以便配合dropEffect生效；
 * dragover 事件中设置dropEffect控制当前拖拽行为，不设置则默认允许拖拽行为生效；
 *
*/

// 拖拽组件实例移动位置
function componentDragstartListener(evt) {
    // console.log('[componentDragstartListener]', evt.target, evt.currentTarget);
    evt.stopPropagation();

    let mover = evt.currentTarget.querySelector('[data-mover]');
    if(evt.target === mover) return; // 拖动定位操作

    // 改变嵌套关系
    let el = evt.currentTarget;
    let componentId = el.dataset['editor'];
    let component = getPageComponent(componentId);
    if(!component) return;

    if(component.role === 'fixed') return; // fixed组件不允许改变嵌套关系

    const dt = evt.dataTransfer;
    dt.clearData();
    dt.setData(MOVE_DATATRANSFER_TYPE, componentId);
    dt.effectAllowed = DRAG_EFFECT_ALLOWED[MOVE_DATATRANSFER_TYPE];

    el.setAttribute('dragging', true);
    store.commit('pageEditor/setDraggingComponent', component);

    if(component.position) {
        setStartPointOffsetInComponent(evt, el);
    }
    // console.log(MOVE_DATATRANSFER_TYPE, ' >> ', component, evt);
}

// 拖拽经过时，设置dropEffect决定是否可以放置组件
function componentDragoverListener(evt) {
    evt.preventDefault();
    // 这里为不频繁触发事件，不让事件继续向上传播，fixed组件的特殊行为在drop中处理
    evt.stopPropagation();

    const dt = evt.dataTransfer;
    dt.dropEffect = 'none';

    // 判断拖拽行为是否为定位组件偏移设置
    if(dt.types.indexOf(POS_DATATRANSFER_TYPE) > -1) {
        dt.dropEffect = DRAG_EFFECT_ALLOWED[POS_DATATRANSFER_TYPE];
        return ;
    }


    // 拖拽行为是组件嵌套或前后关系设置 ↓
    let handerTypes = intersection(dt.types, HANDLE_RELATED_DATATRANSFER_TYPES);
    if(!handerTypes.length) return;

    let enterComponent = getPageComponent(evt.currentTarget.dataset['editor']);
    if(!enterComponent) return;

    // 由于该事件无法获取event.dataTransfer的自定义数据，这里使用状态管理
    let currentComponent = store.state.pageEditor.draggingComponent;
    if(!currentComponent) return;

    let dropEffect = DRAG_EFFECT_ALLOWED[handerTypes[0]] || 'none';

    // fixed组件允许在任何位置放下
    if(currentComponent.role === 'fixed') {
        return dt.dropEffect = dropEffect;
    }

    // 是否允许放置组件
    let canDrop = allowPutComponent(enterComponent, currentComponent);
    dt.dropEffect = canDrop ? dropEffect : 'none';
}

// 拖拽移入时，标记enter组件
function componentDragenterListener(evt) {
    evt.preventDefault();

    let handerTypes = intersection(evt.dataTransfer.types, HANDLE_RELATED_DATATRANSFER_TYPES);
    if(!handerTypes.length) return;

    let enterComponent = getPageComponent(evt.currentTarget.dataset['editor']);
    if(!enterComponent) return;

    // 由于该事件无法获取event.dataTransfer的自定义数据，这里使用独立状态处理
    let currentComponent = store.state.pageEditor.draggingComponent;
    if(!currentComponent) return;

    let canDrop;
    if(currentComponent.role === 'fixed') {
        // fixed组件只允许插入root
        if(enterComponent.role !== 'root') return;
        canDrop = DRAG_BE_FOCUS_CHILD;
    } else {
        evt.stopPropagation();
        // 标记放置效果
        canDrop = allowPutComponent(enterComponent, currentComponent);
    }

    /**
     * 由于组件内部元素也会触发dragenter/dragleave，且dragenter先于dragleave触发，
     * 这里记录当前enter组件元素，用来判断在dragleave时是否真的离开了当前组件
     **/
    currentEnterComponentElement = evt.currentTarget;
    evt.currentTarget.setAttribute('drag-focus', canDrop);
}

// 拖拽离开时，清理enter状态
function componentDragleaveListener(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    /**
     * 离开组件元素为enter元素时清理enter效果；
     * 由于离开根容器时enter组件元素没有变更，也直接清理；
     **/
    if(evt.currentTarget !== currentEnterComponentElement || evt.currentTarget.dataset['role'] === 'root') {
        evt.currentTarget.removeAttribute('drag-focus');
    }
}

// 拖拽结束时，清理状态
function componentDragendListener(evt) {
    // console.log('[editor::dragend]', evt.currentTarget);
    evt.stopPropagation();

    // dragend事件currentTarget元素为拖拽元素而不是enter元素，这里使用enter元素
    currentEnterComponentElement && currentEnterComponentElement.removeAttribute('drag-focus');
    evt.currentTarget.removeAttribute('dragging');
    store.commit('pageEditor/clearDraggingComponent');

    resetStartPointOffsetInComponent();
}

/**
 * 放置组件并清理状态：
 * 事件中调用evt.preventDefault()，并且dropEffect值符合effectAllowed才会触发ondrop事件
 *
 **/
function componentDropListener(evt) {
    // console.log('[editor::drop]', evt.currentTarget);
    evt.preventDefault();
    evt.stopPropagation();

    let dt = evt.dataTransfer;
    // 判断拖拽行为是否为定位组件偏移设置
    if(dt.types.indexOf(POS_DATATRANSFER_TYPE) > -1) {
        let componentId = dt.getData(POS_DATATRANSFER_TYPE);
        let component = getPageComponent(componentId);
        let position = getEndPointComponentMovePosition(evt, component);
        if(!position) return;
        commondEditComponent(component, {
            data: {props: {...position}}
        });
        // 重置拖拽点位移信息
        resetStartPointOffsetInComponent();
        return ;
    }

    // 放置组件操作 ↓
    let handerTypes = intersection(dt.types, HANDLE_RELATED_DATATRANSFER_TYPES);
    if(!handerTypes.length) return;

    let targetEl = evt.currentTarget;
    let targetComponent = getPageComponent(targetEl.dataset['editor']);
    if(!targetComponent) return;

    // 由于该事件无法获取event.dataTransfer的自定义数据，这里使用独立状态处理
    let currentComponent = store.state.pageEditor.draggingComponent;
    if(!currentComponent || !currentComponent.name) return;

    if(currentComponent.role === 'fixed') {
        // 拖拽组件为fixed组件时，设置目标组件为根组件
        targetComponent = store.state.pageEditor.pageTree;
    }

    targetEl.removeAttribute('drag-focus');

    let customData;
    if(currentComponent.position){
        // 计算定位组件定位
        let position = getEndPointComponentMovePosition(evt, currentComponent, targetComponent)
        position && (customData = {props: {...position}});
    }
    // 重置拖拽点位移信息
    resetStartPointOffsetInComponent();

    switch(handerTypes[0]) {
        case CREATE_DATATRANSFER_TYPE:
            // 创建新组件
            commondPutNewComponent(targetComponent, defaultsDeep({initialData: customData}, currentComponent));
            break;
        case MOVE_DATATRANSFER_TYPE:
            {
                // 移动已有组件
                if(customData) {
                    let parentComponent;
                    let dropType = allowPutComponent(targetComponent, currentComponent);
                    if(dropType === DRAG_BE_FOCUS_CHILD) {
                        parentComponent = targetComponent;
                    }else if(dropType === DRAG_BE_FOCUS_SIBLING) {
                        parentComponent = targetComponent.parent;
                    }
                    if(parentComponent && currentComponent.parent !== parentComponent) {
                        // 嵌套关系不变时不改变组件属性数据
                        commondEditComponent(currentComponent, {data: customData});
                    }
                }
                commondMoveComponent(targetComponent, currentComponent)
            }
            break;
    }

    // console.log(`[drop::${handerTypes[0]}] >`, currentComponent, targetComponent);
}

// 右键菜单
function componentContextmenuListener(evt) {
    evt = evt || window.event;
    evt.stopPropagation();
    evt.preventDefault();
    let el = evt.currentTarget;
    if(!el) return;
    let componentId = el.dataset['editor'];
    if(!componentId) return;
    let targetComponent = getPageComponent(componentId);
    if(!targetComponent) return;

    const options = getContextmenuOptions(evt);

    Contextmenu({
        target: 'editorWorkspace',
        title: `${targetComponent.label} [ID:${targetComponent.id}]`,
        x: evt.pageX || evt.clientX,
        y: evt.pageY || evt.clientY,
        options
    });

    commondSetFocusComponent(componentId);

    return false;
}

// 拖动定位 开始
function positionMoverDragstartListener(evt) {
    evt.stopPropagation();
    let el = evt.target;
    let componentEl = el.parentNode;

    const dt = evt.dataTransfer;
    dt.clearData();
    dt.setData(POS_DATATRANSFER_TYPE, componentEl.dataset['editor']);
    dt.effectAllowed = DRAG_EFFECT_ALLOWED[POS_DATATRANSFER_TYPE];

    el.setAttribute('dragging', true);
    setStartPointOffsetInComponent(evt, componentEl);
}

// 拖动定位 放置
function positionMoverDragendListener(evt) {
    evt.target.removeAttribute('dragging');
    resetStartPointOffsetInComponent();
}
