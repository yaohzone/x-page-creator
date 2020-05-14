<style lang="less">
@import (reference) "~@/assets/style/reference";

.advanced-image-text {
    .image {
        text-align: center;
        overflow: hidden;
        img {
            display: inline-block;
            width: 100%;
            height: 100%;
            vertical-align: middle;
        }
    }
    .text {
        padding: 10px;
    }
}
</style>

<template>
    <div class="advanced-image-text" :style="wrapperStyle" :class="hoverEffect && 'hover-effect-'+hoverEffect || ''">
        <div class="image"><img :src="src" :style="{'object-fit': fit}" :alt="alt"></div>
        <div class="text">
            <basic-rich-text :value="text"></basic-rich-text>
        </div>
    </div>
</template>

<script>
import defaultImage from '@/assets/images/pic_default_image.jpg';
import {
    calcDisplaySize
} from '@/utils/tool.js';
import {
    marginProps,
    marginStyle
} from '@/components/options.js';

export default {
    props: {
        src: {
            type: String,
            default: defaultImage
        },
        fit: {
            type: String,
            default: 'fill'
        },
        alt: String,
        href: String,
        target: {
            type: Boolean,
            default: true
        },
        text: {
            type: String,
            default: '<p>文本内容~~~！</p>'
        },
        width: [Number, String],
        ...marginProps('top,bottom'),
        hoverEffect: {
            type: String,
            default: ''
        }
    },
    computed: {
        wrapperStyle() {
            return {
                width: calcDisplaySize(this.width),
                ...marginStyle(this)
            }
        }
    }
}
</script>
