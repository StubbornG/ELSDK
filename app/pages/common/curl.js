const md5 = require('md5');
import axios from 'axios';
import { ElMessage } from 'element-plus';

/**
 *   前端封装 curl 方法
 * 
*/

const curl = ({
    url, // 请求地址
    method = 'post', // 请求方法
    headers = {}, // url 请求头
    query = {}, // curl query
    data = {}, // post body
    responseType = 'json', // 响应类型
    timeout = 60000, // 超时时间
    errorMessage = '网络异常'
}) => {
    // 接口签名处理
    const signKey = 'klx05hb3nlc9ujp8uhxbs2ikkiowp212';
    const st = Date.now()

    const dtoHeaders = {
        ...headers,
        's_sign': md5(`${signKey}_${st}`),
        's_t': st,
    }

    if (url.indexOf('/api/proj/') > -1 && window.projKey) {
        dtoHeaders.proj_key = window.projKey;
    }

    // 构造请求参数（把参数转换为 axios 参数）
    const ajaxStriing = {
        url,
        method,
        params: query,
        headers: dtoHeaders,
        data,
        responseType,
        timeout,
        errorMessage
    }
    return axios.request(ajaxStriing).then((response => {
        const resData = response.data || {};

        // 后端API返回格式
        const { success } = resData;

        // 失败
        if(!success) {
            const { code, message } = resData;
            console.log(code, message);
            if(code === 442) {
                ElMessage.error('请求参数异常');
            } else if (code === 445) {
                ElMessage.error('请求不合法');
            } else if (code === 446) {
                ElMessage.error('缺少项目必要参数');
            } else if (code === 50000) {
                ElMessage.error(message);
            } else {
                ElMessage.error(errorMessage);
            }
            return Promise.reject({ success, code, message });
        }

        //  成功
        const { data, metadata } = resData;

        return Promise.resolve({
            data,
            success,
            metadata
        });

    })).catch((error => {
        const { message } = error;

        if (message.match(/timeout/)) {
            return Promise.resolve({
                message: 'Request timeout',
                code: 504
            })
        }

        return Promise.resolve(error)
    }))
    
}

export default curl;