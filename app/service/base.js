const superagent = require('superagent');

module.exports = (app) => {
    return class BaseService {
        /**
         * service 基类
         * 统一收拢service层 的公共方法
         * * */
        constructor() {
            this.app = app;
            this.config = app.config;
            this.curl = superagent;
        }
    }
}