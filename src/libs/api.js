/**
 * author: cyy <cyy00891@vipmro.net>
 * datetime: 2018/04/18
 */

import axios from "./axios";
import defaultsDeep from "lodash/defaultsDeep";
import isObject from "lodash/isObject";
import {Loading, Message, MessageBox} from "element-ui";
import {RESPONCE_CODE_OK} from "@/constants";

// 参数是否作为请求主体
function isRequestBody(method) {
    return ["put", "post", "patch"].indexOf(method.trim().toLowerCase()) !== -1;
}

/**
 * 基于axios的api请求方法（签名请求）
 * @param {*} url 请求地址
 * @param {*} options axios方法的请求config （注: 本方法中传递参数统一使用data,如get方法请求参数可使用data代替params）
 */
export default function(url, options) {
    // 参数检查
    if (typeof url !== "string" || !url) {
        throw new Error("url 为必传参数");
    }
    if (options !== undefined && !isObject(options)) {
        throw new Error("options 为可选参数但必须为对象");
    }

    // 预处理options.params
    if (options && options.params && !options.data) {
        options.data = options.params;
    }

    // 默认配置项
    let defaults = {
        loading: false,
        method: "get",
        errorTip: true, // catch error
        failTip: true, // then code !== 0
        baseURL: "/api",
        data: {
            t: new Date().getTime(), // 防缓存
        },
        // resolve校验函数
        resolveValidate: res => {
            return res.result === RESPONCE_CODE_OK;
        }
    };

    let settings = defaultsDeep({}, options || {}, defaults);
    delete settings.url;

    let postData = settings.data;
    if (isRequestBody(settings.method)) {
        settings.data = postData;
    } else {
        settings.params = postData;
    }

    let loading;
    let useLoading = settings.loading;

    return new Promise(function(resolve, reject) {
        if (useLoading) {
            loading = Loading.service({background: 'rgba(0, 0, 0, 0.2)', ...settings.loadingOptions});
        }

        axios({
            url: url,
            ...settings
        }).then(function(res) {
                if (useLoading && loading) {
                    loading.close();
                }
                if (res.result !== undefined && res.result !== RESPONCE_CODE_OK) {
                    // 弹出错误信息 res.msg
                    if (settings.failTip) {
                        if (res.msg) {
                            if (res.msg.toString().length < 10) {
                                Message.error(res.msg);
                            } else {
                                MessageBox.alert(res.msg, {title: '错误提示', type: 'error', center: true});
                            }
                        }
                    }
                }
                if (settings.resolveValidate(res)) {
                    resolve(res.body);
                } else {
                    reject(res);
                }
            }).catch(function(error) {
                if (useLoading && loading) {
                    loading.close();
                }
                if (settings.errorTip) {
                    Message.error("好像出了点问题哦~");
                }
                reject(error);
            });
    });
}
