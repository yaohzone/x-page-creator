import axios from 'axios'
import { stringify } from 'qs';

// 创建/配置axios实例  实例defaults
let http = axios.create({
    // 超时时间
    timeout: 10000,
    // 请求头
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    // 判断为resolve的status范围
    // validateStatus: function validateStatus(status) {
    //     return status >= 200 && status < 300;
    // }
})

// axios实例的请求拦截器
http.interceptors.request.use(function(config) {
        // console.log('---- http.interceptors.request ----');
        // console.dir(config)
        // 解决当设置Content-Type为application/x-www-form-urlencoded后data参数依然按照json格式发送的问题
        if (config.data && config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
            config.data = stringify(config.data);
        }
        return config;
    },
    function(error) {
        // console.log('---- http.interceptors.request error ----');
        // console.dir(error)
        return Promise.reject(error);
    });

// axios实例的响应拦截器
http.interceptors.response.use(function(response) {
        // console.log('---- http.interceptors.response ----')
        // console.dir(response)
        return response.data;
    },
    function(error) {
        // console.log('---- http.interceptors.response error ----')
        // console.dir(error)
        let { code, response } = error;
        if (response) {
            // 错误包含响应
            // let { status, statusText } = response;
            // let tip = '';
            // switch (status) {
            //     case 401:
            //         tip = '请求需要权限验证';
            //         break;
            //     case 403:
            //         tip = '禁止访问';
            //         break;
            //     case 404:
            //         tip = '未发现请求资源';
            //         break;
            //     case 405:
            //         tip = '请求方法错误';
            //         break;
            //     case 500:
            //         tip = '服务器出错';
            //         break;
            //     default:
            //         tip = `请求失败 [${status} -> ${statusText}]`;
            // }
            // Message.error({message:tip, duration:1500});
        } else if (code) {
            // 错误码
            switch (code) {
                case 'ECONNABORTED':
                    // Message.error(`连接超时，请检查网络`);
                    break;
                default:
                    // Message.error(`请求失败 [${code} -> ${message}]`);
            }
        } else {
            // Message.error(`请求失败 [${message}]`);
        }
        return Promise.reject(error);
    });

export default http;
