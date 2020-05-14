
/**
 * Quill实例设置
 * @arguments quill: Quill实例
*/

import uploadImageAction from './upload-image';

export default function QuillSettings(quill) {

    // 添加progress容器
    let progressContainer = document.createElement('div');
    // progressContainer.className = 'ql-process-container';
    progressContainer.style.cssText = 'position: absolute; top: 0; left: 0; right: 0; z-index: 999;';
    this.quill.progressContainer = progressContainer;
    this.quill.container.appendChild(progressContainer);

    // 主题Tooltip TEMPLATE修改
    let ToolTipConstructor = quill.theme.tooltip.constructor;
    if(ToolTipConstructor.name === 'SnowTooltip') {
        ToolTipConstructor.TEMPLATE = [
            '<a class="ql-preview" target="_blank" href="about:blank"></a>',
            '<input type="text" data-formula="e=mc^2" data-link="https://" data-video="Embed URL">',
            '<a class="ql-action"></a>',
            '<a class="ql-remove"></a>'
        ].join('');
    }else if(ToolTipConstructor.name === 'BubbleTooltip') {
        ToolTipConstructor.TEMPLATE = [
            '<span class="ql-tooltip-arrow"></span>',
            '<div class="ql-tooltip-editor">',
            '<input type="text" data-formula="e=mc^2" data-link="https://" data-video="Embed URL">',
            '<a class="ql-close"></a>',
            '</div>'
        ].join('');
    }

    // 全选 CTRL + A
    quill.keyboard.addBinding({
        key: 'A',
        ctrlKey: true,
        handler: (range, context) => {
            quill.setSelection(0, quill.getLength());
        }
    });

    // 保存到历史记录 CTRL + S
    quill.keyboard.addBinding({
        key: 'S',
        ctrlKey: true,
        handler: (range, context) => {
            quill.history.cutoff();
        }
    });

    // 粘贴内容 - 行内样式过滤(color|background)
    // quill.clipboard.addMatcher(Node.ELEMENT_NODE, function(node, delta) {
    //     delta.ops.map(op => {
    //         if(op.attributes){
    //             delete op.attributes.color;
    //             delete op.attributes.background;
    //         }
    //         return op;
    //     })
    //     return delta;
    // });

    // 内容变化
    quill.on('text-change', (delta, oldDelta, source) => {
        this.$emit('change', this.getHTMLContent());
    });

    // 选区变化
    quill.on('selection-change', (range, oldRange, source) => {
        if (range && range.length) {
            this.$emit('selection', range);
        }
    });

    let toolbar = this.toolbar = quill.getModule('toolbar');

    // 图片处理逻辑 (图片上传本地处理)
    toolbar.addHandler('image', (value) => {
        // 源码逻辑
        let fileInput = toolbar.container.querySelector('input.ql-image[type=file]');
        if (fileInput == null) {
            fileInput = document.createElement('input');
            fileInput.setAttribute('type', 'file');
            fileInput.setAttribute('multiple', true);
            fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
            fileInput.classList.add('ql-image');
            fileInput.addEventListener('change', () => {
                const files = fileInput.files;
                if(!files || !files.length) return;

                // 一次最多可上传图片数
                let maxLength = this.uploadImageConfig && this.uploadImageConfig.maxLength || 10;
                if(maxLength >= 0 && files.length > maxLength) {
                    this.$message.warning(`最多可选择${maxLength}张图片`);
                    fileInput.value = '';
                    return ;
                }

                let filePromises = [];
                if(this.uploadImageConfig) {
                    // 上传服务
                    filePromises = [].map.call(files, file => uploadImageAction.call(this, file));
                }else {
                    // 本地base64格式
                    filePromises = [].map.call(files, file => readAsBase64Image(file));
                }
                Promise.all(filePromises).then(images => {
                    images.forEach(image => {
                        this.insertImage(image);
                    });
                    fileInput.value = '';
                });
            });
            toolbar.container.appendChild(fileInput);
        }
        fileInput.click();
    });


    function readAsBase64Image(file) {
        return new Promise(resolve => {
            let reader = new FileReader();
            reader.onload = e => {
                resolve(e.target.result);
            };
            reader.readAsDataURL(file);
        })
    }
}
