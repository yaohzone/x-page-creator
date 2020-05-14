import {getVueComponent} from '@/utils';

export default {
    functional: true,
    props: {
        component: {
            type: Object,
            required: true
        }
    },
    render(h, {props, slots}) {
        let component = props.component;
        let EditorComponent = getVueComponent('editor-' + component.name);
        // console.log('[component-editor::render]', component.name, component.id);
        if(!EditorComponent) return slots().default;
        return h(EditorComponent, {
            key: component.id,
            props: {
                component,
                componentProps: component.vnode.componentInstance.$props
            }
        }, []);
    }
}
