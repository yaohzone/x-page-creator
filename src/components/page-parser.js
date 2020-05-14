import {createPageComponentVNode, createPageRoot} from '@/utils/common.js';

export default {
    props: {
        edit: {
            type: [Boolean, Number],
            default: false
        },
        tree: {
            type: Object,
            default: () => createPageRoot()
        }
    },
    render(h) {
        console.log('[page-parser::render] > edit:', this.edit, ' tree:', this.tree);
        return createPageComponentVNode(this.tree, h, !!this.edit);
    }
}
