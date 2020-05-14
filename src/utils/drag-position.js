import {
    DRAG_BE_FOCUS_CHILD,
    DRAG_BE_FOCUS_SIBLING
} from '@/constants.js';

import {
    allowPutComponent
} from '@/utils';


export let mousePointCurrentPositionX = 0;
export let mousePointCurrentPositionY = 0;

// 更新记录当前鼠标指针位置
window.addEventListener('mousemove', evt => {
    evt = evt || window.event;
    mousePointCurrentPositionX = evt.pageX || evt.clientX;
    mousePointCurrentPositionY = evt.pageY || evt.clientY;
}, false);

/**
 * 拖拽定位行为方法
 *
 * */

let startPointOffsetLeftInComponent = 0;
let startPointOffsetTopInComponent = 0;

// 设置鼠标指针初始位置在组件内位移
export function setStartPointOffsetInComponent(evt, componentEl) {
    if(!componentEl) return;
    evt = evt || window.event;
    let pointX = evt.pageX || evt.clientX || evt.x;
    let pointY = evt.pageY || evt.clientY || evt.y;
    let componentRect = componentEl.getBoundingClientRect();
    let {left, top} = componentRect;
    // console.log(pointX - left, pointX, left);
    // console.log(pointY - top, pointY, top);
    startPointOffsetLeftInComponent = pointX - left;
    startPointOffsetTopInComponent = pointY - top;
}

// 重置鼠标指针初始位置在组件内位移
export function resetStartPointOffsetInComponent() {
    startPointOffsetLeftInComponent = 0;
    startPointOffsetTopInComponent = 0;
}

// 设置鼠标指针结束时组件放置定位（设置第三个参数时为放置目标组件）
export function getEndPointComponentMovePosition(evt, component, targetComponent) {
    if(!component) return;
    evt = evt || window.event;
    let pointX = evt.pageX || evt.clientX || evt.x;
    let pointY = evt.pageY || evt.clientY || evt.y;
    let el = component.vnode && component.vnode.componentInstance.$el;
    let elRect = el && el.getBoundingClientRect();
    if(component.role === 'fixed') {
        // 悬浮定位 fixed --相对于视口
        let left = pointX - startPointOffsetLeftInComponent;
        let top = pointY - startPointOffsetTopInComponent;
        let position = {left, top};
        if(elRect) {
            position.right = window.innerWidth - (left + elRect.width),
            position.bottom = window.innerHeight - (top + elRect.height)
        }
        // console.log('[fixed] -> position:', position);
        return position;
    }

    if(!targetComponent && !component.id) return; // component为新组件则必须设置放置目标组件targetComponent
    // console.log(component, targetComponent, targetComponent === component);
    if(component.id && !component.parent && !targetComponent) return; // component为粘贴板组件时，必须设置targetComponent

    let parentComponent = component.parent;
    // 绝对定位 absolute --相对于父组件
    if(targetComponent) {
        // 放置目标组件
        let dropType = allowPutComponent(targetComponent, component);
        if(dropType === DRAG_BE_FOCUS_CHILD) {
            parentComponent = targetComponent;
        }else if(dropType === DRAG_BE_FOCUS_SIBLING) {
            parentComponent = targetComponent.parent;
        }else {
            return;
        }
    }

    let parentEl = parentComponent.vnode.componentInstance.$el;
    let parentRect = parentEl.getBoundingClientRect();
    {

        let left = pointX - parentRect.left - startPointOffsetLeftInComponent;
        let top = pointY - parentRect.top - startPointOffsetTopInComponent;
        let position = {left, top};
        // console.log('left:::>', left, pointX, parentRect.left, startPointOffsetLeftInComponent)
        // console.log('top:::>', top, pointY, parentRect.top, startPointOffsetTopInComponent)
        if(elRect) {
            position.right = parentRect.width - (left + elRect.width),
            position.bottom = parentRect.height - (top + elRect.height)
        }
        // console.log('[absolute] -> position:', position);
        return position;
    }
}
