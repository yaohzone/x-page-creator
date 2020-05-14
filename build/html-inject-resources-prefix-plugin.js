class HtmlInjectResourcesPrefixPlugin {
    constructor(options) {
        this.options = Object.assign({
            prefix: ''
        }, options);
    }

    apply(compiler) {
        compiler.hooks.compilation.tap('HtmlInjectResourcesPrefixPlugin', compilation => {
            compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap(
            'htmlWebpackPluginBeforeHtmlProcessing',
            data => {
                let prefix = this.options.prefix || '';
                data.assets.js = (data.assets.js || []).map(path => prefix + path);
                data.assets.css = (data.assets.css || []).map(path => prefix + path);
            })
        })
    }
}

module.exports = HtmlInjectResourcesPrefixPlugin;
