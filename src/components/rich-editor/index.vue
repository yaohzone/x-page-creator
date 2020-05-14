<template>
    <div class="component-rich-editor">
        <div class="editor-container" ref="container"></div>
    </div>
</template>

<script>
import Quill from 'quill';
import defaultsDeep from 'lodash/defaultsDeep';
import quillSettings from './quill-settings';
import {Progress} from './upload-image';

// 扩展 ui/icons
defaultsDeep(Quill.imports['ui/icons'], {
    'undo': require('./icons/undo.html'),
    'redo': require('./icons/redo.html'),
    'header': {
        '1': require('./icons/header.html'),
        '2': require('./icons/header-2.html'),
        '3': require('./icons/header-3.html'),
        '4': require('./icons/header-4.html'),
        '5': require('./icons/header-5.html'),
        '6': require('./icons/header-6.html')
    },
});

export default{
	data() {
        return {
            toolbar: null,
            uploadImageConfig: typeof this.uploadImage === 'string' ? {url: this.uploadImage} : this.uploadImage
        };
    },
    props: {
        value: {
            type: String,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        toolbars: {
            type: Array,
            default() {
                return [
                    ['blockquote', {header: 1}, {header: 2}, {header: 3}, {header: 4}],
                    ['bold', 'italic', 'underline', 'strike'],
                    // [{script: 'sub'}, {script: 'super'}], // sup/sub
                    [{color: []}, {background: []}],
                    // [{header: [1, 2, 3, 4, false]}],
                    [{size: ['huge', 'large', false, 'small']}, {font: []}],
                    [{list: 'ordered'}, {list: 'bullet'}], // list
                    [{align: ''}, {align: 'center'}, {align: 'right'}, {align: 'justify'}], // align
                    [{indent: '-1'}, {indent: '+1'}], // indent
                    // [{ 'direction': 'rtl' }],    // text direction
                    ['link', 'image', 'video'],
                    ['clean'],
                    ['undo', 'redo']
                ]
            }
        },
        // // 编辑器高度
        // height: [String, Number],
        // 上传图片配置 String指即指定上传服务地址
        uploadImage: {
            type: [String, Object],
            default: '/api/imageInfo/uploadFile'
        }
    },
    model: {
        prop: 'value',
        event: 'change'
    },
    mounted() {
        this.initEditor();
    },
    watch: {
        disabled(value) {
            this.quill && this.quill.enable(!value);
        },
        value(val) {
            let currentHTML = this.getHTMLContent();
            // 富文本实际HTML与value值比较，避免change事件触发的value变更执行setHTMLContent而导致的BUG
            if(currentHTML !== val) {
                this.setHTMLContent(val);
            }
        }
    },
    methods: {
        // 初始化编辑器
        initEditor() {
            this.quill = new Quill(this.$refs.container, {
                theme: 'snow', // bubble|snow
                modules: {
                    syntax: false,
                    toolbar: {
                        container: this.toolbars,
                        handlers: {
                            'undo': value => {
                                this.quill.history.undo();
                            },
                            'redo': value => {
                                this.quill.history.redo();
                            }
                        }
                    },
                    history: {
                        // 添加历史记录间隔
                        delay: 10000,
                        // 历史记录上限
                        maxStack: 1000
                    }
                },
                placeholder: '请编辑...',
                debug: process.env.NODE_ENV === 'development',
                readOnly: this.disabled
            });

            quillSettings.call(this, this.quill);

            setTimeout(() => {
                this.setHTMLContent(this.value);
            }, 200)

        },

        // 获取纯文本内容
        getTextContent() {
            return this.quill && this.quill.getText() || '';
        },

        // 获取Delta格式内容
        getDeltaContent() {
            return this.quill && this.quill.getContents() || {};
        },

        // 获取html内容
        getHTMLContent() {
            return this.quill && this.quill.root.innerHTML || '';
        },

        // 设置html内容
        setHTMLContent(content) {
            this.clear();
            this.quill.pasteHTML(0, content, Quill.sources.API);
        },

        // 结尾添加html内容
        appendHTMLContent(content) {
            this.quill.pasteHTML(this.quill.getLength(), content, Quill.sources.API);
        },

        // 插入图片
        insertImage(url) {
            if(!url) return;
            const Delta = Quill.import('delta');
            let range = this.quill.getSelection(true);
            let delta = new Delta().retain(range.index).delete(range.length).insert({image: url});
            this.quill.updateContents(delta, Quill.sources.API);
            this.quill.setSelection(range.index + 1, Quill.sources.API);
        },

        // 清空内容
        clear() {
            this.quill.deleteText(0, this.quill.getLength(), Quill.sources.API);
        },

        // 清空样式
        clearFormat() {
            this.quill.removeFormat(0, this.quill.getLength()-1, Quill.sources.API);
        },

        // 当前选区
        getSelection() {
            return this.quill.getSelection(true);
        }
    }
};
</script>

<style lang="less">
@import '~quill/dist/quill.core.css';
@import '~quill/dist/quill.snow.css';
@import '~quill/dist/quill.bubble.css';

.ql-toolbar {
    .ql-picker.ql-size {
        .ql-picker-label::before,
        .ql-picker-item::before {
            content: '正常字号';
        }
        .ql-picker-label[data-value=small]::before,
        .ql-picker-item[data-value=small]::before {
            content: '小字号';
        }
        .ql-picker-label[data-value=large]::before,
        .ql-picker-item[data-value=large]::before {
            content: '大字号';
        }
        .ql-picker-label[data-value=huge]::before,
        .ql-picker-item[data-value=huge]::before {
            content: '超大字号';
        }
    }
    .ql-picker.ql-header {
        .ql-picker-label::before,
        .ql-picker-item::before {
            content: '段落 P'
        }
        each(range(6), {
            .ql-picker-label[data-value="@{value}"]::before,
            .ql-picker-item[data-value="@{value}"]::before {
                content: '标题 H@{value}'
            }
        });
    }
}

.ql-container {
    .ql-tooltip{
        &::before{
            content: '链接:';
        }
        &[data-mode=link]::before {
            content: '链接:';
        }
        a.ql-action::after {
            content: '编辑';
        }
        &.ql-editing {
            a.ql-action::after {
                content: '保存';
            }
        }
        a.ql-remove::before {
            content: '移除';
        }
        &[data-mode=formula]::before {
            content: "公式:"
        }
        &[data-mode=video]::before {
            content: "视频地址:"
        }
    }
}

.component-rich-editor {
    margin-bottom: 12px;
    .ql-toolbar {
        line-height: 22px;
    }
    .ql-snow {
        border: 1px solid #ccc;
        .ql-editor {
            min-height: 300px;
            overflow: visible;
            overflow-y: auto;
        }
    }
}
</style>
