import Vue from 'vue';

export function noop () {}

export function isUndefined(v) {
    return v === void 0
}

export function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

// 转驼峰格式
export function camelCase(value) {
    if (typeof value !== 'string') return '';
    return value.split('-').map(word => (word[0] || '').toUpperCase() + word.slice(1)).join('');
}

// 获取Vue组件构造器
export function getVueComponent(name) {
    let component = Vue.component(name);
    if(!component) component = Vue.component(camelCase(name));
    return component;
}

// 是否内部元素
export function isInnerElement(node, parentNode, level) {
    if (!parentNode) return false;
    if (parentNode === node) return true;
    let count = 0;
    level = Number(level) || 10;
    while ((node = node.parentNode) && count < level) {
        if (parentNode === node) return true;
        count++;
    }
    return false;
}

// 确认离开页面事件函数
export function beforeunloadListener(evt) {
    let confirmationMessage = '\\o/';
    (evt || window.event).returnValue = confirmationMessage;
    return confirmationMessage;
}

// 阻止默认事件监听函数
export function preventDefaultListener(evt) {
    evt.preventDefault();
}

// 展开children到平级
export function spreadChildrenWithSelf(parent) {
    if(!Array.isArray(parent.children)) {
        return [parent];
    }
    const children = parent.children;
    return children.reduce((collection, item) => {
        if(!item || typeof item !== 'object') return collection;
        item.parent = parent;
        // item._pId = parent.id;
        // item._level = parent._level + 1;
        return collection.concat(spreadChildrenWithSelf(item));
    }, [parent]);
}

// 树形结构平展转换
export function transformTreeToList(tree) {
    if(!tree || typeof tree !== 'object') return [];

    tree.parent = null;
    // tree._level = 0;
    // tree._pId = null;
    return spreadChildrenWithSelf(tree);
}


// 显示大小计算
export function calcDisplaySize(value) {
    if(typeof value === 'number') return !value ? value : value + 'px';
    if(typeof value !== 'string') return ;

    let num = Number(value);
    if(num !== num) return value;
    return !value ? value : value + 'px';
}

// 背景图
export function backgroundImage(value) {
    return value ? `url(${value})` : void 0;
}

// 背景填充方式
export function backgroundImageFill(value) {
    let options = {
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat'
    }
    switch(value) {
        case 'cover':
            // 填充
            options.backgroundSize = 'cover';
            break;
        case 'contain':
            // 适应
            options.backgroundSize = 'contain';
            break;
        case 'center':
            // 居中
            options.backgroundPosition = 'center center';
            break;
        case 'stretch':
            // 拉伸
            options.backgroundSize = '100% 100%';
            break;
        case 'tile':
        default:
            // 平铺
            options.backgroundPosition = 'left top';
            options.backgroundRepeat = 'repeat';
            break;
    }
    return options;
}

/**
 * 计算字符串所占的内存字节数，默认使用UTF-8的编码方式计算，也可制定为UTF-16
 * UTF-8 是一种可变长度的 Unicode 编码格式，使用一至四个字节为每个字符编码
 *
 * 000000 - 00007F(128个代码)      0zzzzzzz(00-7F)                             一个字节
 * 000080 - 0007FF(1920个代码)     110yyyyy(C0-DF) 10zzzzzz(80-BF)             两个字节
 * 000800 - 00D7FF
 * 00E000 - 00FFFF(61440个代码)    1110xxxx(E0-EF) 10yyyyyy 10zzzzzz           三个字节
 * 010000 - 10FFFF(1048576个代码)  11110www(F0-F7) 10xxxxxx 10yyyyyy 10zzzzzz  四个字节
 *
 * 注: Unicode在范围 D800-DFFF 中不存在任何字符
 *
 * http://zh.wikipedia.org/wiki/UTF-8
 *
 * UTF-16 大部分使用两个字节编码，编码超出 65535 的使用四个字节
 * 000000 - 00FFFF  两个字节
 * 010000 - 10FFFF  四个字节
 *
 *
 * http://zh.wikipedia.org/wiki/UTF-16
 *
 * @param  {String} str
 * @param  {String} charset utf-8, utf-16
 * @return {Number}
 */
export function sizeOf(str, charset) {
    let total = 0;
    let charCode;

    if(typeof str !== 'string') {
        try {
            str = JSON.stringify(str);
        } catch (e) {
            return;
        }
    }

    charset = charset && charset.toLowerCase() || 'utf-8';

    if (charset === 'utf-16' || charset === 'utf16') {
        for (let i = 0, len = str.length; i < len; i++) {
            charCode = str.charCodeAt(i);
            if(charCode <= 0xffff){
                total += 2;
            } else {
                total += 4;
            }
        }
    } else {
        for(let i = 0, len = str.length; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode <= 0x007f) {
                total += 1;
            } else if (charCode <= 0x07ff) {
                total += 2;
            } else if (charCode <= 0xffff) {
                total += 3;
            } else{
                total += 4;
            }
        }
    }

    return total;
}


// 是否包含正常流组件
export function hasFlowChildComponent(children) {
    if(!children || !children.length) return false;
    // 子组件非全为layout-absolute-container
    return !children.every(vnode => {
        return (
            vnode.componentOptions &&
            vnode.componentOptions.tag === 'layout-absolute-container'
        )
    });
}
