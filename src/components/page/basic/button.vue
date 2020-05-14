<style lang="less">
@import (reference) "~@/assets/style/reference";

.basic-button, .basic-button-link {
    display: inline-block;
    vertical-align: middle;
}
</style>

<script>
import {Button} from 'element-ui';
import {calcDisplaySize, backgroundImage, backgroundImageFill} from '@/utils/tool.js';
import {backgroundProps, backgroundStyle, marginProps, marginStyle} from '@/components/options.js';

export default {
    components: {ElButton: Button},
    props: {
        // medium / small / mini
        size: {
            type: String,
            default: 'small'
        },
        // primary / success / warning / danger / info / text
        type: {
            type: String,
            default: 'primary'
        },
        plain: {
            type: Boolean,
            default: false
        },
        round: {
            type: Boolean,
            default: false
        },
        circle: {
            type: Boolean,
            default: false
        },
        text: {
            type: String,
            default: '按钮'
        },
        href: String,
        target: {
            type: Boolean,
            default: false
        },
        icon: String,
        width: [Number, String],
        height: [Number, String],
        ...marginProps('left,right'),
        ...backgroundProps()
    },
    render(h) {
        let button = h('ElButton', {
            props: {
                size: this.size,
                type: this.type,
                plain: this.plain,
                round: this.round,
                circle: this.circle,
                icon: this.icon
            },
            attrs: {
                title: this.text
            },
            staticClass: 'basic-button',
            style: {
                width: calcDisplaySize(this.width),
                height: calcDisplaySize(this.height),
                marginLeft: !this.href ? calcDisplaySize(this.marginLeft) : void 0,
                marginRight: !this.href ? calcDisplaySize(this.marginRight) : void 0,
                ...backgroundStyle(this)
            }
        }, [this.text]);
        if(!this.href) return button;
        return h('a', {
                staticClass: 'basic-button-link',
                attrs: {
                    href: this.href,
                    target: this.target ? '_blank' : void 0,
                    title: this.title || this.text
                },
                style: {
                    ...marginStyle(this)
                }
            }, [button]);
    }
}
</script>
