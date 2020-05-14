<style lang="less">
@import (reference) "~@/assets/style/reference";

.advanced-image-list {
    .image-list {
        display: flex;
        flex-flow: row nowrap;
        justify-content: stretch;
        align-content: flex-start;
        .image-item {
            flex: 1 1 0;
            min-width: 0;
        }
        .image-wrapper {
            display: block;
            // border: 1px solid transparent;
            img {
                width: 100%;
                vertical-align: top;
            }
            &:hover {
                // border-color: @theme-error;
            }
        }
    }
}
</style>

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
        list: {
            type: Array,
            default() {
                return [
                    {
                        src: defaultImage,
                        alt: '图片',
                        href: '',
                        target: true
                    }
                ]
            }
        },
        column: {
            type: Number,
            default: 2
        },
        space: {
            type: Number,
            default: 20
        },
        ...marginProps('top,bottom'),
        itemHeight: [Number, String],
        hoverEffect: {
            type: String,
            default: ''
        }
    },
    computed: {
        groups() {
            let column = this.column;
            let _groups = [];
            let list = this.list;
            let length = list.length;
            let index = 0;
            while(index < length) {
                let items = list.slice(index, index + column);
                let length = items.length;
                if(length < column) {
                    let emptys = Array.apply(null, {length: column-length}).map(i => ({isEmpty: true}));
                    items = items.concat(emptys);
                }
                _groups.push(items);
                index = index + length;
            }
            return _groups
        },
        wrapperStyle() {
            return {
                ...marginStyle(this)
            }
        },
        realItemHeight() {
            return calcDisplaySize(this.itemHeight)
        },
        realSpace() {
            return calcDisplaySize(this.space)
        }
    },
    render(h) {
        let realSpace = this.realSpace;
        let realItemHeight = this.realItemHeight;
        let hoverEffect = this.hoverEffect;
        let groups = this.groups.map((group, gIdx) => {
            let list = group.map((item, index) => {
                let image;
                if(!item.isEmpty) {
                    image = h(item.href ? 'a' : 'div', {
                        staticClass: 'image-wrapper',
                        style: {
                            height: realItemHeight
                        },
                        attrs: item.href ? {
                            href: item.href,
                            title: item.alt,
                            target: item.target && '_blank' || void 0
                        } : void 0
                    }, [
                        h('img', {
                            style: {
                                height: realItemHeight ? '100%' : void 0
                            },
                            attrs: {
                                src: item.src,
                                alt: item.alt
                            }
                        })
                    ])
                }

                return h('div', {
                    key: index,
                    staticClass: 'image-item',
                    class: {
                        ['hover-effect-' + hoverEffect]: hoverEffect
                    },
                    style: {marginLeft: index ? realSpace : void 0}
                }, [image])
            })

            return h('div', {
                key: gIdx,
                staticClass: 'image-list',
                style: { marginTop: gIdx ? realSpace : void 0}
            }, list);
        })

        return h('div', {
            staticClass: 'advanced-image-list',
            style: this.wrapperStyle
        }, groups);
    },
    methods: {
        calcDisplaySize
    }
}
</script>
