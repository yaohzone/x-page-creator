/**
 * 上传图片
*/

class Progress {
    constructor (editor) {
        let processbar = document.createElement('div');
        // processBar.className = 'ql-progressbar';
        processbar.style.cssText = 'display: block; height: 4px; margin-bottom:1px; background: #67c23a; transition: 0.2s; opacity: 0;';
        this.processbar = processbar;
        this.container = editor.progressContainer;
        this.container.appendChild(this.processbar)
    }

    update(progress) {
        progress > 100 && (progress = 100);
        this.processbar.style.width = progress + '%';
        this.processbar.style.opacity = progress/100;
        if(progress >= 100) {
            setTimeout(() => {
                this.remove();
            }, 500);
        }
    }

    remove() {
        this.processbar.remove();
    }

}

// 默认设置
const defaultSettings = {
    url: '',    // 上传服务地址
    method: 'POST',
    fileFeildName: 'file',
    headers: {},    // 请求头
    params: {}, // 其他参数
    timeout: 30000, // 超时时间
    withCredentials: false,
    // 提取图片路径
    extractImagePath(res) {
        /**
         * {
         *      result: 0 - 成功；
         *      msg: '' // - 消息
         *      body: { url } // 返回图片信息
         * }
        */
        if(res.result !== 0) {
            this.$message.error(res.msg || '上传图片失败!');
            return;
        }
        if(!res.body || !res.body.url) {
            this.$message.error(res.msg || '上传图片失败!');
            return;
        }
        return res.body.url;
    }
}

function uploadImageAction(file) {
    return new Promise((resolve, reject) => {

        const options = Object.assign({}, defaultSettings, this.uploadImageConfig);

        if(!options.url) return reject(new Error('缺少必要参数 uploadImage.url'));

        // 准备参数
        let formData = new FormData();
        formData.append(options.fileFeildName, file);
        Object.keys(options.params).forEach(key => {
            formData.append(key, options.params[key]);
        });

        // 定义 xhr
        const xhr = new XMLHttpRequest()
        xhr.open(options.method, options.url)

        // 设置超时
        xhr.timeout = options.timeout;
        xhr.ontimeout = () => {
            this.$message.warning('上传图片超时');
            reject('上传图片超时');
        }

        // 监控 progress
        const progressBar = new Progress(this.quill);
        if (xhr.upload) {
            xhr.upload.onprogress = e => {
                let percent
                if (e.lengthComputable) {
                    percent = (e.loaded / e.total) * 100;
                    progressBar.update(percent);
                }
            }
        }

        // 返回数据
        xhr.onreadystatechange = () => {
            let response
            if (xhr.readyState === 4) {
                progressBar.remove();
                if (xhr.status < 200 || xhr.status >= 300) {
                    // xhr 返回状态错误
                    this.$message.error('上传图片出错');
                    return reject('上传图片出错');
                }

                response = xhr.responseText
                if (typeof result !== 'object') {
                    try {
                        response = JSON.parse(response)
                    } catch (err) {
                        this.$message.error('上传图片失败，解析错误!');
                        return reject('上传图片失败，解析错误!');
                    }
                }

               let imagePath = options.extractImagePath.call(this, response);

               if(imagePath) {
                   resolve(imagePath);
               } else {
                   reject('图片上传失败!');
               }

            }
        }

        // 自定义 headers
        Object.keys(options.headers).forEach(key => {
            xhr.setRequestHeader(key, options.headers[key])
        });

        // 跨域传 cookie
        xhr.withCredentials = options.withCredentials

        // 发送请求
        xhr.send(formData)
    })
}

export {Progress, uploadImageAction as default}
