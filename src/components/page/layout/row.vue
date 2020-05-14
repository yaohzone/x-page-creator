<style lang="less">
@import (reference) '~@/assets/style/reference';

.layout-row {
    &:empty {
        height: 100px;
    }
    &.flex {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: stretch;
        // overflow: auto;
    }
}
</style>

<script>
import {
    calcDisplaySize,
    backgroundImage,
    backgroundImageFill
} from '@/utils/tool.js';
import {
    overflowProps,
    marginProps,
    marginStyle,
    paddingProps,
    paddingStyle,
    borderProps,
    borderStyle,
    backgroundProps,
    backgroundStyle,
    animateProps,
    animateComputedClasses
} from '@/components/options.js'

export default {
    data() {
        return {}
    },
    props:{
        // flex-start | flex-end | center | space-between | space-around;
        justifyContent: {
            type: String,
            default: 'flex-start'
        },
        // flex-start | flex-end | center | baseline | stretch
        alignItems: {
            type: String,
            default: 'stretch'
        },
        width: [Number, String],
        height: [Number, String],
        ...marginProps('top,bottom'),
        ...overflowProps(),
        ...paddingProps(),
        ...borderProps(),
        ...backgroundProps(),
        ...animateProps(),
        hoverEffect: {
            type: String,
            default: ''
        }
    },
    computed: {
        style() {
            return {
                justifyContent: this.justifyContent,
                alignItems: this.alignItems,
                width: calcDisplaySize(this.width),
                height: calcDisplaySize(this.height),
                ...marginStyle(this),
                ...paddingStyle(this),
                ...backgroundStyle(this),
                ...borderStyle(this),
                overflow: this.overflow
            }
        },
        animateComputedClasses
    },
    render(h) {
        // row只允许放置column
        let children = this.$slots.default || [];
        let columns = children.filter(child => child.componentOptions && child.componentOptions.tag === 'layout-column');
        return h('div', {
            staticClass: 'layout-row flex',
            class: {
                'g-hide-scrollbar': this.hideScrollbar,
                ['hover-effect-'+this.hoverEffect]: this.hoverEffect,
                ...this.animateComputedClasses
            },
            style: this.style
        }, columns)
    }
}
</script>
