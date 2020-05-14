<style lang="less">
@import (reference) '~@/assets/style/reference';

.layout-column {
    position: relative;
    min-width: 0; // 解决超长单词导致内容宽度计算过长
    &.empty-width {
        width: 100px;
    }
    &.empty-height {
        height: 100px;
    }
    &.align-left {
        text-align: left;
    }
    &.align-center {
        text-align: center;
    }
    &.align-right {
        text-align: right;
    }
}
</style>

<script>
import {
    calcDisplaySize,
    hasFlowChildComponent
} from '@/utils/tool.js';
import {
    marginProps,
    marginStyle,
    paddingProps,
    paddingStyle,
    borderProps,
    borderStyle,
    backgroundProps,
    backgroundStyle,
    overflowProps,
    animateProps,
    animateComputedClasses
} from '@/components/options.js'

export default {
    props:{
        autoadaptation: {
            type: Boolean,
            default: true
        },
        width: [Number, String],
        height: [Number, String],
        ...marginProps('left,right'),
        ...paddingProps(),
        ...backgroundProps(),
        ...borderProps(),
        ...overflowProps(),
        innerAlign: {
            type: String,
            default: 'left'
        },
        ...animateProps(),
        hoverEffect: {
            type: String,
            default: ''
        }
    },
    computed: {
        animateComputedClasses,
        style() {
            // 固定宽度
            let flexGrow = 0;
            let flexShrink = 0;
            if(this.autoadaptation) {
                flexGrow = 1;
                flexShrink = 1;
            }
            let width = calcDisplaySize(this.width);

            return {
                flexGrow,
                flexShrink,
                flexBasis: width,
                width,
                height: calcDisplaySize(this.height),
                ...marginStyle(this),
                ...paddingStyle(this),
                ...borderStyle(this),
                ...backgroundStyle(this),
                overflow: this.overflow
            }
        }
    },
    render(h) {
        let children = this.$slots.default;
        return h('div', {
                staticClass: 'layout-column',
                class: {
                    'g-hide-scrollbar': this.hideScrollbar,
                    [`align-${this.innerAlign}`] : this.innerAlign,
                    ['hover-effect-'+this.hoverEffect]: this.hoverEffect,
                    ...this.animateComputedClasses
                    // 'empty-width': !hasFlowChildComponent(children),
                    // 'empty-height': isEmptyHeight(this)
                },
                style: this.style
            }, children)
    }
}

// // 是否无高度
// function isEmptyHeight(vm) {
//     let sameHeight = vm.$parent.alignItems === 'stretch';
//     if(!sameHeight) {
//         // 不等高 --仅关注当前组件
//         return !hasFlowChildComponent(vm.$slots.default);
//     }
//     // 等高 --判断所有同级columns都未设置固定高度 且 column内没有正常流组件
//     return vm.$parent.$slots.default.every(vnode => {
//         let props = vnode.data.props || {};
//         return (
//             !props.height &&
//             !hasFlowChildComponent(vnode.componentOptions && vnode.componentOptions.children)
//         )
//     })
// }
</script>
