import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
// import omitBy from 'lodash/omitBy';
// import photosManager from '@/components/photos';

import {
    // isUndefined,
    commondEditComponent
} from '@/utils';

import {
    ANIMATE_NAMES,
    ANIMATE_DELAYS,
    ANIMATE_SPEEDS,
    IMAGE_FITS
} from '@/constants.js';

const animateNames = cloneDeep(ANIMATE_NAMES)
const animateDelays = cloneDeep(ANIMATE_DELAYS)
const animateSpeeds = cloneDeep(ANIMATE_SPEEDS)
const imageFits = cloneDeep(IMAGE_FITS)

export default {
    // name: 'base-editor',
    // 提供给props-editor，便于封装通用
    provide() {
        return {
            context: this.context, // props每次更新都是完全不同的对象，通过作为响应对象context的属性[props]来保证props内外一致
            base: this.base,
            pageMode: this.pageMode
        }
    },
    props: {
        component: {
            type: Object,
            required: true
        },
        componentProps: {
            type: Object
        }
    },
    data() {
        return {
            context: {
                props: {}
            },
            base: {
                animateNames,
                animateDelays,
                animateSpeeds,
                imageFits
            }
        }
    },
    computed: {
        props: {
            get () {
                return this.context.props
            },
            set (value) {
                this.context.props = value;
            }
        },
        pageMode() {
            return this.$store.state.pageEditor.pageMode;
        }
    },
    watch: {
        componentProps: {
            immediate: true,
            deep: true,
            handler(value, oldValue) {
                // 编辑器外部对组件属性变更，更新编辑器props
                let _isEqual = isEqual(value, this.props);
                // console.log('[watch::componentProps] _isEqual ->', _isEqual, this.$options.name, this.component.id, this.component.name,
                // JSON.stringify(value), '\n', JSON.stringify(this.props), '\n', JSON.stringify(oldValue));
                if(_isEqual) return;
                this.props = cloneDeep(value);
                // console.log('[watch::componentProps] props updated ->', this.$options.name, this.component.id, this.component.name);
            }
        },
        props: {
            deep: true,
            handler(value, oldValue) {
                // 编辑器内部更新组件props
                let _isEqual = isEqual(value, this.componentProps);
                // console.log('[watch::props] _isEqual ->', _isEqual, this.$options.name, this.component.id, this.component.name,
                // JSON.stringify(value), '\n', JSON.stringify(this.componentProps), '\n', JSON.stringify(oldValue));
                if(_isEqual) return;
                commondEditComponent(this.component, {data: {props: value}});
                // console.log('[watch::props] component updated ->', this.$options.name, this.component.id, this.component.name);
            }
        }
    }
}
