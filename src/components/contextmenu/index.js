/**
 * alert组件调用服务 <单例模式>
 * author: cyy <cyy00891@vipmro.net>
 * datetime: 2018/05/2
 */

import Vue from 'vue'
import {hasOwnProperty, isInnerElement} from '@/utils';
import Contextmenu from './component.vue';

let ContextmenuComponent = Vue.extend(Contextmenu);
let instance;

ContextmenuComponent.prototype.close = function(){
    instance.visible = false;
}

export default function(options){

    let opts = Object.assign({
        target: '', // 插入元素ID
        x: 0,
        y: 0,
        title: '操作',
        options: [],
    }, options || {});

    if (!instance) {
        instance = new ContextmenuComponent().$mount();
        window.addEventListener('click', evt => {
            if(!isInnerElement(evt.target, instance.$el)) {
                instance.close();
            }
        }, false);
        instance.$on('completed', () => {
            instance.close();
        })
    }
    let target = document.getElementById(opts.target) || document.body;
    if(instance.$el.parentNode !== target) {
        target.appendChild(instance.$el);
    }

    let {scrollLeft, scrollTop, scrollWidth, scrollHeight} = target;
    let targetRect = target.getBoundingClientRect();

    opts.x += scrollLeft - targetRect.left;
    opts.y += scrollTop - targetRect.top;

    const props = instance.$options.props || {};
    Object.keys(opts).forEach(key => {
        if(hasOwnProperty(props, key)) {
            instance[key] = opts[key];
        }
    });

    Vue.nextTick(() => {
        instance.visible = true;
        Vue.nextTick(() => {
            let {clientWidth: contextmenuWidth, clientHeight: contextmenuHeight} = instance.$el;
            let maxX = scrollWidth - contextmenuWidth - 5;
            let maxY = scrollHeight - contextmenuHeight - 5;
            if(instance.x > maxX) instance.x = maxX;
            if(instance.y > maxY) instance.y = maxY;
        })
    });

    return instance;
}
