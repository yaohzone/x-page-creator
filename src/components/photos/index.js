/**
 * alert组件调用服务 <单例模式>
 * author: cyy <cyy00891@vipmro.net>
 * datetime: 2018/05/2
 */

import Vue from 'vue';
import PhotosOptions from './component.vue';

let PhotosComponent = Vue.extend(PhotosOptions);
let instance;

PhotosComponent.prototype.close = function(){
    instance.visible = false;
}

export default function(options){
    let opts = Object.assign({
        target: '',
        visible: false,
        isPicker: true
    }, options || {});

    if (!instance) {
        instance = new PhotosComponent().$mount();
    }
    let target = document.getElementById(opts.target) || document.body;
    if(instance.$el.parentNode !== target) {
        target.appendChild(instance.$el);
    }

    Vue.nextTick(() => {
        instance.visible = true;
        instance.isPicker = opts.isPicker;
    });

    return instance;
}
