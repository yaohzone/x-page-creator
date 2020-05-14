
import api from './api';

export default function(apis){
    // 参数检查
    if(!(apis instanceof Array)){
        throw new Error('参数类型错误：必须为 Array');
    }
    apis.forEach(item => {
        if(typeof item === 'string'){
            return ;
        }
        if(typeof item.url !== 'string' || !item.url){
            throw new Error('参数错误： 缺少必要参数 url')
        }
    })

    return new Promise((resolve, reject) => {
        let loading = this.$loading();
        let promises = (apis || []).map(item => {
            if(typeof item === 'string'){
                return api(item);
            }
            return api(item.url, item.options);
        });
        Promise.all(promises).then(resonses => {
            loading.close();
            // let _result = resonses.every(item => item.code === 0);
            // if(!_result){
            //     return Promise.reject();
            // }
            resolve(resonses.map(item => item.data));
        }).catch(err => {
            loading.close();
            reject(err);
        });
    })

}
