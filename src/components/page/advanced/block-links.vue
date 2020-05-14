<style lang="less">
@import (reference) "~@/assets/style/reference";

.advanced-link-list {
    overflow: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: stretch;
    align-content: flex-start;
    .link-item {
        flex-basis: auto;
        flex-grow: 0;
        flex-shrink: 0;
        min-width: 0;
        min-height: 0;
        padding: 0 10px;
        .ellipsis-oneline();
        text-align: center;
        font-size: 14px;
        transition: 0.2s;
        &::before {
            content: '';
            display: inline-block;
            vertical-align: middle;
            width: 0;
            height: 100%;
        }
        &:first-child {
            margin-left: 0!important;
            margin-top: 0!important;
        }
        &:last-child {
            margin-right: 0!important;
            margin-bottom: 0!important;
        }
        &:hover {
            opacity: 0.8;
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
                        isAnchor: false,
                        href: '',
                        target: false,
                        icon: ''
                    }
                ]
            }
        },
        // row / column
        direction: {
            type: String,
            default: 'row'
        },
        // flex-start | flex-end | center | space-between | space-around;
        justifyContent: {
            type: String,
            default: 'flex-start'
        },
        // // flex-start | flex-end | center | baseline | stretch
        // alignItems: {
        //     type: String,
        //     default: 'stretch'
        // },
        itemAutoadaptation: {
            type: Boolean,
            default: false
        },
        hideScrollbar: {
            type: Boolean,
            default: false
        },
        itemWidth: [Number, String],
        itemHeight: [Number, String],
        itemSpace: {
            type: [Number, String],
            default: 20
        },
        itemAlign: {
            type: String,
            default: 'center'
        },
        itemSize: {
            type: [Number, String],
            default: 14
        },
        itemBackgroundColor: {
            type: String,
            default: '#eee'
        },
        itemColor: {
            type: String,
            default: '#222'
        },
        hoverEffect: {
            type: String,
            default: ''
        }
    },
    computed: {
        listStyle() {
            let flexDirection = this.direction;
            let justifyContent = this.justifyContent;
            let height;
            if(flexDirection === 'column') {
                height = '100%';
            }

            return {
                height,
                flexDirection,
                flexWrap: 'nowrap',
                justifyContent,
                alignItems: 'stretch'
            }
        },
        itemStyle() {
            let [width, height, space] = [calcDisplaySize(this.itemWidth), calcDisplaySize(this.itemHeight), calcDisplaySize(this.itemSpace)];
            let marginBottom;
            let marginTop;
            let marginLeft;
            let marginRight;
            let flexGrow = 0;
            let flexShrink = 0;
            let flexBasis = width;
            let isColumn = this.direction === 'column';
            if(isColumn) {
                flexBasis = height;
                switch(this.justifyContent) {
                    case 'flex-end':
                        marginTop = space;
                        break;
                    case 'flex-start':
                    case 'center':
                        marginBottom = space;
                        break;
                }
            } else {
                if(this.itemAutoadaptation) {
                    flexGrow = 1;
                    flexShrink = 1;
                }
                switch(this.justifyContent) {
                    case 'flex-end':
                        marginLeft = space;
                        break;
                    case 'flex-start':
                    case 'center':
                        marginRight = space;
                        break;
                }
            }

            return {
                flexGrow,
                flexShrink,
                flexBasis,
                width,
                height,
                marginLeft,
                marginRight,
                marginBottom,
                marginTop,
                textAlign: this.itemAlign,
                backgroundColor: this.itemBackgroundColor,
                color: this.itemColor,
                fontSize: calcDisplaySize(this.itemSize)
            }
        }
    },
    render(h) {
        let items = this.list.map((item, index) => {
            return h('a', {
                staticClass: 'link-item',
                style: this.itemStyle,
                attrs: {
                    href: this.linkHref(item),
                    title: item.title,
                    target: !item.isAnchor && item.target ? '_blank' : void 0
                }
            }, item.title);
        })

        return h('div',
            {
                staticClass: 'advanced-link-list',
                class: {
                    'g-hide-scrollbar': this.hideScrollbar
                },
                style: this.listStyle
            },
            items
        );
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
