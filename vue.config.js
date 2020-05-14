const htmlWebpackPlugin = require('html-webpack-plugin');
// const HtmlInjectResourcesPrefixPlugin = require('./build/html-inject-resources-prefix-plugin');
const CopyAfterEmitPlugin = require('./build/copy-after-emit-plugin');
const {resolve} = require('./build/utils');
const {version} = require('./package.json');

// 资源放置目录
function resolveDist(...arg) {
    return resolve('../frontend/static/', ...arg);
}

const resourceDir = 'xpage-creator';
const viewResourceDir = 'view-resources';

const configs = {
    // 静态资源前缀，类比 output.publicPath
    publicPath: './', // 因为访问路由非根路径，这里资源引用使用相对路径，页面中使用base设置根链接以便正确访问到资源
    // 构建输出目录
    outputDir: resolveDist(resourceDir),
    // 生成静态资源 (js、css、img、fonts) 的目录名（相对于outputDir）
    assetsDir: "assets",
    // 生成模板index.html的路径（相对于outputDir）
    indexPath: "index.html",
    // 生成静态资源文件名是否包含hash
    filenameHashing: true,
    // 生产环境是否生成sourcemap
    productionSourceMap: false,
    // 多页面模式配置
    // pages: {
    //     index: {
    //         // page 的入口
    //         entry: 'src/index/main.js',
    //         // 模板来源
    //         template: 'public/index.html',
    //         // 在 dist/index.html 的输出
    //         filename: 'index.html',
    //         // 当使用 title 选项时，
    //         // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
    //         title: 'Index Page',
    //         // 在这个页面中包含的块，默认情况下会包含
    //         // 提取出来的通用 chunk 和 vendor chunk。
    //         chunks: ['chunk-vendors', 'chunk-common', 'index']
    //       }
    //     }
    // },
    css: {
        // CSS Modules 模块文件是否必须 *.module.[ext] 结尾
        requireModuleExtension: true,
        // 提取样式到css文件
        extract: process.env.NODE_ENV === 'production',
        // css sourceMap
        sourceMap: process.env.NODE_ENV !== 'production',
        // 样式loader options：css-loader/postcss-loader/sass-loader/less-loader/stylus-loader
        // loaderOptions: {
        //     scss: {
        //         prependData: `@import "~@/variables.scss";`
        //     },
        //     less: {
        //         sourceMap: process.env.NODE_ENV !== 'production',
        //         globalVars: {
        //             primary: '#fff'
        //         }
        //     }
        // }
    },
    // webpack-dev-server配置
    devServer: {
        port: 12345,
        host: '0.0.0.0',
        open: true,
        overlay: {
            warnings: true,
            errors: true
        },
        proxy: {
            '/api': {
                target: 'http://cms.uat.vipmro.org',
                changeOrigin: true
            }
        }
    },
    // 保存编译时lint
    lintOnSave: process.env.NODE_ENV !== 'production',
    // 要求babel-loader转换的依赖包（node_modules）
    transpileDependencies: [],
    // webpack配置，通过 webpack-merge 合并到最终的配置中
    configureWebpack: webpackConfig => {
        // webpackConfig.module.rules.push({
        //     test: /\.html$/,
        //     include: [resolve('src')],
        //     use: [
        //         {
        //             loader: 'html-loader',
        //             options: {
        //                 minimize: true
        //             }
        //         }
        //     ]
        // });

        webpackConfig.performance = {
            maxEntrypointSize: 1024 * 1024,
            maxAssetSize: 512 * 1024
        }
    },
    // webpack-chain 高级链式配置：https://github.com/neutrinojs/webpack-chain
    chainWebpack: config => {

        config.resolve.alias.set('@@', resolve());

        // 移除 prefetch 插件
        config.plugins.delete('prefetch');

        // html-loader
        config.module.rule('html').test(/\.html$/).include.add(resolve('src')).end().use('html').loader('html-loader').options({minimize: true});

        // vue-markdown-loader
        let mdRules = config.module.rule('md').test(/\.md/).use('vue-loader').loader('vue-loader').end();
        mdRules.use('vue-markdown-loader').loader('vue-markdown-loader/lib/markdown-compiler').options({
            // markdown-it config
            // preset: 'default',
            // breaks: true,
            raw: true,
            // typographer: true,
            // preprocess: function(markdownIt, source) {
            //     return parser.makeHtml(source);
            // }
        });

        config.plugin('copy').tap(args => {
            let copys = args[0] || [];
            if(copys && copys[0]) {
                copys[0].ignore.push({
                    glob: 'view.html',
                    matchBase: false
                });
            }
            return args
        });

        if(process.env.VUE_APP_RESOURCES) {
            // resources模式
            config.entry('app').clear().add(resolve('src/view.js'));

            /**
             * 为展示页面生成index.html模板，提供给后台作为页面生成模板
             * -- 这里更换htmlWebpackPlugin 4.x
             * */
            config.plugin('html').init((Plugin, args) => {
                let options = args[0] || {};
                options.template = resolve('public/view.html');
                options.inject = false; // 在模板中使用htmlWebpackPlugin.options.headTags/bodyTags进行注入
                options.minify = false;
                options.base = `{{STATIC_FILE_FLAG}}/${version}/`;
                return new htmlWebpackPlugin(...args)
            });
            // 替换了新的htmlWebpackPlugin，preload插件报错，删除该插件
            config.plugins.delete('preload');

            // --使用了base代替下方案
            // config.plugin('HtmlInjectResourcesPrefix').use(HtmlInjectResourcesPrefixPlugin, [{prefix: `{{STATIC_FILE_FLAG}}/${version}/`}])

            // copy backend generate template
            config.plugin('CopyAfterEmit').use(CopyAfterEmitPlugin, [{
                from: resolveDist(`${viewResourceDir}/${version}/index.html`),
                to: resolve('../backend/src/main/resources/template.html')
            }]);

        }

        // // 若不使用index.html模板
        // config.plugins.delete('html')
        // config.plugins.delete('preload')
        // config.plugins.delete('prefetch')
    },
    // 第三方插件配置
    // pluginOptions: { }
};

if(process.env.VUE_APP_RESOURCES) {
    // 构建展示资源 --resources模式
    // configs.publicPath = `./`;
    // 资源放置目录 vipmro-bosp-cms/frontend/static/{{viewResourceDir}}
    configs.outputDir = resolveDist(`${viewResourceDir}/${version}`);
}

module.exports = configs;
