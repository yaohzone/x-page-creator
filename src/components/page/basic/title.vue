<style lang="less">
@import (reference) "~@/assets/style/reference";

.basic-title {
    position: relative;
    line-height: 1.5em;
    .title {
        display: inline-block;
        margin: 0 0.8em 0 0;
        vertical-align: middle;
        font-size: 14px;
        color: @theme-dark;
    }
    .minor {
        display: inline-block;
        vertical-align: middle;
        font-size: 12px;
        color: #888;
    }
    .aside {
        position: absolute;
        right: 1em;
        bottom: 0;
        z-index: 2;
        font-size: 12px;
        color: @theme-ignore;
    }
    a.aside:hover {
        text-decoration: underline;
    }

    &.level-1 {
        .title {
            font-size: 22px;
        }
    }
    &.level-2 {
        .title {
            font-size: 20px;
        }
    }
    &.level-3 {
        .title {
            font-size: 18px;
        }
    }
    &.level-4 {
        .title {
            font-size: 16px;
        }
    }
    &.level-5 {
        .title {
            font-size: 14px;
        }
    }
    &.level-6 {
        .title {
            font-size: 12px;
        }
    }

    &.style-a {
        border-bottom: 1px solid #eee;
    }
    &.style-b {
        .title {
            padding-left: 0.8em;
            border-left: 0.3em solid @theme-error;
        }
    }
    &.style-c {
        border-bottom: 1px solid @theme-error;
        padding-bottom: 0!important;
        .title {
            padding: 0.2em 0.6em;
            border-radius: 0.2em 0.2em 0 0;
            background: @theme-error;
            color: #fff;
        }
    }
}
</style>

<script>
import {calcDisplaySize} from '@/utils/tool.js';
import {
    paddingStyle,
    marginStyle
} from '@/components/options.js';

export default {
    props: {
        level: {
            type: Number,
            default: 2
        },
        title: {
            type: String,
            default: '标题'
        },
        desc: String,
        asideText: String,
        asideHref: String,
        titleStyle: {
            type: String,
            default: ''
        },
        paddingLeft: [Number, String],
        paddingRight: [Number, String],
        paddingTop: {
            type: [Number, String],
            default: 10
        },
        paddingBottom: {
            type: [Number, String],
            default: 10
        },
        marginTop: [Number, String],
        marginBottom: {
            type: [Number, String],
            default: 15
        }
    },
    render(h) {
        let aside;
        if(this.asideText) {
            let bottom = calcDisplaySize(this.paddingBottom);
            let right = calcDisplaySize(this.paddingRight);
            aside = this.asideHref ?
                h('a', {staticClass: 'aside', attrs: {href: this.asideHref, target: '_blank'}, style: {bottom, right}}, this.asideText) :
                h('span', {staticClass: 'aside', style: {bottom, right}}, this.asideText)
        }
        return h('div',
            {
                staticClass: 'basic-title',
                class: {
                    [`level-${this.level}`]: true,
                    [`style-${this.titleStyle}`]: this.titleStyle
                },
                style: {
                    ...marginStyle(this),
                    ...paddingStyle(this)
                }
            },
            [
                h(`h${this.level}`, {staticClass: 'title'}, this.title),
                this.desc ? h('span', {staticClass: 'minor'}, this.desc) : void 0,
                aside
            ]
        )
    }
};
</script>
