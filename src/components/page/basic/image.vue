<style lang="less">
@import (reference) "~@/assets/style/reference";

.basic-image-wrapper, .basic-image {
    display: inline-block;
    vertical-align: middle;
    max-width: 100%;
}

</style>

<script>
import defaultImage from '@/assets/images/pic_default_image.jpg';
import {calcDisplaySize} from '@/utils/tool.js';
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
        ...marginProps('top,bottom'),
        href: String,
        target: {
            type: Boolean,
            default: false
        },
        hoverEffect: {
            type: String,
            default: ''
        }
    },
    render(h) {
        let wrapperAttrs = {};
        if(this.href) {
            wrapperAttrs.href = this.href;
            wrapperAttrs.target = this.target ? '_blank' : void 0;
            wrapperAttrs.title = this.alt;
        }
        let width = this.widthType === 'fixed' ? calcDisplaySize(this.width) : this.widthType === 'full' ? '100%' : void 0;
        let height = this.heightType === 'fixed' ? calcDisplaySize(this.height) : this.heightType === 'full' ? '100%' : void 0;
        return h(this.href ? 'a' : 'div', {
            staticClass: 'basic-image-wrapper',
            class: {
                ['hover-effect-'+this.hoverEffect]: this.hoverEffect
            },
            attrs: wrapperAttrs,
            style: {
                width,
                height,
                ...marginStyle(this)
            }
        }, [
            h('img', {
                staticClass: 'basic-image',
                attrs: {
                    src: this.src,
                    alt: this.alt
                },
                style: {
                    'object-fit': this.fit,
                    width: width ? '100%' : void 0,
                    height: height ? '100%' : void 0
                }
            })
        ]);
    }
}
</script>
