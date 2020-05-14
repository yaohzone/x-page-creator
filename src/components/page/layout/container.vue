<style lang="less">
@import (reference) '~@/assets/style/reference';

.layout-container {
    position: relative;
    display: block;
    margin-left: auto;
    margin-right: auto;
    max-width: 100%;
    background-position: center top;
    background-repeat: no-repeat;
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
    backgroundImage,
    backgroundImageFill,
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
} from '@/components/options.js';

export default {
    props: {
        width: [Number, String],
        height: [Number, String],
        ...marginProps('top,bottom'),
        ...paddingProps(),
        ...backgroundProps(),
        ...borderProps(),
        ...overflowProps(),
        ...animateProps(),
        innerAlign: {
            type: String,
            default: 'left'
        },
        hoverEffect: {
            type: String,
            default: ''
        }
    },
    computed: {
        style() {
            return {
                width: calcDisplaySize(this.width),
                height: calcDisplaySize(this.height),
                ...marginStyle(this),
                ...paddingStyle(this),
                ...borderStyle(this),
                ...backgroundStyle(this),
                overflow: this.overflow
            }
        },
        animateClasses: animateComputedClasses,
        classes() {
            return {
                ['hover-effect-'+this.hoverEffect]: this.hoverEffect,
                ...this.animateClasses
            }
        }
    },
    render(h) {
        return h('div', {
                staticClass: 'layout-container',
                class: {
                    ...this.classes,
                    'g-hide-scrollbar': this.hideScrollbar,
                    [`align-${this.innerAlign}`] : this.innerAlign,
                    'empty-height': !hasFlowChildComponent(this.$slots.default)
                },
                style: this.style
            }, this.$slots.default)
    }
}
</script>
