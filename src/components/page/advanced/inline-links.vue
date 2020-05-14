<style lang="less">
@import (reference) "~@/assets/style/reference";

.advanced-inline-links {
    font-size: 14px;
    .link-item {
        display: inline-block;
        vertical-align: middle;
        opacity: 0.8;
        transition: 0.2s;
        &:hover {
            opacity: 1;
            text-decoration: underline;
        }
    }
}
</style>

<script>
import {
    calcDisplaySize
} from '@/utils/tool.js';
import {
    marginProps,
    marginStyle
} from '@/components/options.js';
import {ANCHOR_PREFIX} from '@/constants.js';

export default {
    props: {
        list: {
            type: Array,
            default() {
                return [
                    {
                        title: '链接项',
                        href: '',
                        target: false
                    }
                ]
            }
        },
        align: {
            type: String,
            default: 'left'
        },
        marginRight: {
            type: [Number, String],
            default: 10
        },
        marginBottom: [Number, String],
        fontSize: {
            type: [Number, String],
            default: 14
        },
        color: {
            type: String,
            default: '#222'
        },
        hoverEffect: {
            type: String,
            default: ''
        }
    },
    computed: {
        itemStyle() {
            return {
                marginRight: calcDisplaySize(this.marginRight),
                marginBottom: calcDisplaySize(this.marginBottom),
                fontSize: calcDisplaySize(this.fontSize),
                color: this.color
            }
        }
    },
    render(h) {
        let list = this.list.map((item, index) => {
            return h('a', {
                staticClass: 'link-item',
                style: this.itemStyle,
                attrs: {
                    href: this.linkHref(item),
                    title: item.title,
                    target: item.target ? '_blank' : void 0
                }
            }, item.title);
        })

        return h('div', {staticClass: 'advanced-inline-links', style: {textAlign: this.align}}, list);
    },
    methods: {
        linkHref(item) {
            let href = item.href;
            if(item.isAnchor) {
                return href ? `#${ANCHOR_PREFIX}-${href}` : '#';
            }
            return href ? href : 'javascript: void 0;';
        }
    }
}
</script>
