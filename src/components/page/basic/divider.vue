<style lang="less">
@import (reference) "~@/assets/style/reference";

.basic-divider {
    position: relative;
    display: block;
    border-bottom: 1px solid #eee;
    .divider-title {
        position: absolute;
        top: 50%;
        padding: 0 20px;
        background-color: #fff;
        font-weight: 500;
        font-size: 14px;
        color: #888;

        &.align-left {
            left: 20px;
            transform: translateY(-50%);
        }

        &.align-center {
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
        }

        &.align-right {
            right: 20px;
            transform: translateY(-50%);
        }
    }
}
</style>


<script>
import {
    marginStyle
} from '@/components/options.js';
import {calcDisplaySize} from '@/utils/tool.js';

export default {
    props: {
        marginTop: {
            type: [Number, String],
            default: 20
        },
        marginBottom: {
            type: [Number, String],
            default: 20
        },
        borderBottomWidth: {
            type: [Number, String],
            default: 1
        },
        borderBottomStyle: {
            type: String,
            default: 'solid'
        },
        borderBottomColor: {
            type: String,
            default: '#eee'
        },
        title: {
            type: String,
            default: '分隔线'
        },
        // left / right / center
        titleAligin: {
            type: String,
            default: 'center'
        },
        titleColor: {
            type: String,
            default: '#888'
        },
        titleBackgroundColor: {
            type: String,
            default: '#fff'
        },
        titleHeight: [Number, String],
        titleSize: {
            type: Number,
            default: 14
        }
    },
    render(h) {
        let titleHeight = calcDisplaySize(this.titleHeight);
        return h('div',
            {
                staticClass: 'basic-divider',
                style: {
                    ...marginStyle(this),
                    borderBottomWidth: calcDisplaySize(this.borderBottomWidth),
                    borderBottomStyle: this.borderBottomStyle,
                    borderBottomColor: this.borderBottomColor
                }
            },
            [
                this.title ? h('div', {
                    staticClass: 'divider-title',
                    class: {
                        [`align-${this.titleAligin}`]: this.titleAligin
                    },
                    style: {
                        height: titleHeight,
                        lineHeight: titleHeight,
                        marginTop: calcDisplaySize(this.borderBottomWidth/2),
                        backgroundColor: this.titleBackgroundColor,
                        fontSize: calcDisplaySize(this.titleSize),
                        color: this.titleColor,
                    }
                }, this.title) : void 0
            ]
        )
    }
};
</script>
