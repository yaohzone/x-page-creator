<style lang="less">
@import (reference) '~@/assets/style/reference';

.layout-root {
    position: absolute!important;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: auto;

    // position: relative;
    // min-height: 100%;
}
</style>

<script>
import Velocity from 'velocity-animate';
import {backgroundImage, backgroundImageFill, isInnerElement} from '@/utils/tool.js';
import {backgroundProps, backgroundStyle} from '@/components/options.js';

export default {
    props: {
        ...backgroundProps(),
        backgroundAttachment: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        style() {
            return {
                // minHeight: window.innerHeight + 'px',
                ...backgroundStyle(this),
                backgroundAttachment: this.backgroundAttachment ? 'fixed' : void 0
            }
        }
    },
    render (h) {
        return h('div', {
                staticClass: 'layout-root',
                style: this.style
            }, this.$slots.default)
    },
    mounted() {
        this.$el.addEventListener('click', this.linkActionListener, false);
        // this.$el.addEventListener('scroll', (evt) => {
        //     console.log('[scroll]', this.$el.scrollTop)
        // }, false);
    },
    destroyed() {
        this.$el.removeEventListener('click', this.linkActionListener, false);
    },
    methods: {
        // 锚点滚动行为
        linkActionListener(evt) {
            let el = evt.target;
            let href = el.getAttribute('href');
            let [ , target] = href && href.match(/#([^/#?=&]+)?$/) || [];
            let currentScrollTop = this.$el.scrollTop;
            let targetScrollTop;
            if(href === '#') {
                targetScrollTop = 0;
            } else if (target) {
                if(target) target = document.getElementById(target);
                if(target && isInnerElement(target, this.$el, 999)) {
                    let wrapperRect = this.$el.getBoundingClientRect();
                    let targetRect = target.getBoundingClientRect();
                    targetScrollTop = currentScrollTop + targetRect.top - wrapperRect.top;
                }
            }
            if(targetScrollTop == null) return;

            evt.preventDefault();
            Velocity(this.$el, 'scroll', { container: this.$el, duration: 400, offset: Math.ceil(targetScrollTop - currentScrollTop), easing: "swing"});
        }
    }
}
</script>
