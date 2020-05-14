export default {
    // name: 'props-editor',
    inject: ['context', 'base', 'pageMode'],
    computed: {
        props() {
            return this.context.props
        }
    }
}
