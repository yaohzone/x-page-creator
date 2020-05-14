<style lang="less">
@import (reference) '~@/assets/style/reference';

.layout-absolute-container{
    position: absolute !important;
}
</style>

<template>
    <div class="layout-absolute-container" :style="style" :class="classes">
        <slot></slot>
    </div>
</template>

<script>
import {
    calcDisplaySize,
    backgroundImage,
    backgroundImageFill
} from '@/utils/tool.js';
import {
    positionProps,
    positionStyle,
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
        ...positionProps(),
        zIndex: {type: Number, default: 100},
        // auto / full / fixed
        widthType: {
            type: String,
            default: 'auto'
        },
        width: [Number, String],
        // auto / full / fixed
        heightType: {
            type: String,
            default: 'auto'
        },
        height: [Number, String],
        ...paddingProps(),
        ...backgroundProps(),
        ...borderProps(),
        ...overflowProps(),
        ...animateProps(),
        hoverEffect: {
            type: String,
            default: ''
        }
    },
    computed: {
        style() {
            let width = this.widthType === 'fixed' ? calcDisplaySize(this.width) : this.widthType === 'full' ? '100%' : void 0;
            let height = this.heightType === 'fixed' ? calcDisplaySize(this.height) : this.heightType === 'full' ? '100%' : void 0;
            return {
                zIndex: typeof this.zIndex === 'number' ? this.zIndex : void 0,
                ...positionStyle(this),
                width,
                height,
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
                'g-hide-scrollbar': this.hideScrollbar,
                ...this.animateClasses
            }
        }
    }
}
</script>
