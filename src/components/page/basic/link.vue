<style lang="less">
@import (reference) "~@/assets/style/reference";

.basic-link {
    text-align: center;
    vertical-align: middle;
    color: @theme-info;
    transition: 0.2s;
    .text {
        display: inline-block;
        vertical-align: middle;
        margin-top: -0.2em;
    }
    &.type-inline {
        display: inline;
        &.underline {
            text-decoration: underline;
        }
    }
    &.type-button {
        display: inline-block;
        vertical-align: middle;
        &:before {
            content: '';
            display: inline-block;
            height: 100%;
            vertical-align: middle;
        }
    }
    &.type-full {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 1;
        &:before {
            content: '';
            display: inline-block;
            height: 100%;
            vertical-align: middle;
        }
    }

    &:hover {
        opacity: 0.8;
    }
}
</style>

<script>
import {calcDisplaySize} from '@/utils/tool.js';
import {
    marginProps,
    marginStyle,
    paddingProps,
    paddingStyle,
    borderProps,
    borderStyle,
    backgroundProps,
    backgroundStyle,
    overflowProps
} from '@/components/options.js';
import {ANCHOR_PREFIX} from '@/constants.js';

export default {
    props: {
        // inline / button / full
        type: {
            type: String,
            default: 'inline'
        },
        text: {
            type: String,
            default: '超链接'
        },
        // 是否锚点
        isAnchor: {
            type: Boolean,
            default: false
        },
        href: String,
        target: {
            type: Boolean,
            default: true
        },
        title: String,
        zIndex: Number,
        width: [Number, String],
        height: [Number, String],
        ...marginProps('left,right'),
        ...paddingProps(),
        ...borderProps(),
        ...overflowProps(),
        underline: {
            type: Boolean,
            default: false
        },
        fontSize: [String, Number],
        color: String,
        ...backgroundProps()
    },
    computed: {
        style() {
            let background = {};
            let layout = {};
            if(this.type !== 'inline') {
                layout = {
                    ...paddingStyle(this),
                    ...borderStyle(this),
                    overflow: this.overflow
                }
                if(this.type === 'button') {
                    layout.width = calcDisplaySize(this.width);
                    layout.height = calcDisplaySize(this.height);
                }
                if(this.type === 'full') {
                    layout.zIndex = this.zIndex;
                }
                background = backgroundStyle(this);
            }

            let margin = {};
            if(this.type !== 'full') {
                margin = {
                    ...marginStyle(this)
                }
            }
            return {
                ...layout,
                ...margin,
                ...background,
                fontSize: calcDisplaySize(this.fontSize),
                color: this.color
            }
        },
        link() {
            let href = this.href;
            if(this.isAnchor) {
                return href ? `#${ANCHOR_PREFIX}-${href}` : '#';
            }
            return href ? href : 'javascript: void 0;';
        }
    },
    render(h) {
        let text = this.text;
        if(this.type !== 'inline' && text) {
            text = h('span', {staticClass: 'text'}, [text]);
        }

        return h('a', {
            staticClass: 'basic-link',
            class: {
                'g-hide-scrollbar': this.hideScrollbar,
                [`type-${this.type}`]: !!this.type,
                underline: this.type === 'inline' && this.underline
            },
            attrs: {
                href: this.link,
                target: (!this.isAnchor && this.target) ? '_blank' : void 0,
                title: this.title || this.text
            },
            style: this.style
        }, [text]);
    }
}
</script>
