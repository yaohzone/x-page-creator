<script>
import {
    calcDisplaySize
} from '@/utils/tool.js';
import {
    paddingProps,
    paddingStyle,
    marginProps,
    marginStyle
} from '@/components/options.js';

export default{
    props: {
        value: String,
        height: [Number, String],
        ...marginProps('top,bottom'),
        ...paddingProps(),
    },
    computed: {
        style() {
            return {
                height: calcDisplaySize(this.height),
                ...marginStyle(this),
                ...paddingStyle(this)
            }
        }
    },
    render(h) {
        let domProps = {}
        if(!this.$slots.default) {
            domProps.innerHTML = this.value;
        }
        return h(
                'div',
                {
                    staticClass: 'basic-rich-content ql-container ql-snow',
                    style: this.style
                },
                [
                    h('div', {staticClass: "ql-editor", domProps}, this.$slots.default)
                ]
            )
    }
};
</script>

<style lang="less">
@import '~quill/dist/quill.core.css';
@import '~quill/dist/quill.snow.css';
// @import '~quill/dist/quill.bubble.css';

.basic-rich-content {
    &.ql-container {
        height: auto;
        overflow: auto;
        &.ql-snow {
            border: none;
        }
        .ql-editor {
            height: auto;
            padding: 0;
        }
    }
}
</style>
