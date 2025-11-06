module.exports = (app) => {
    return class BaseController {
        /**
         * controller 基类
         * 统一收拢controller 的公共方法
         * @param {*} { objedy}
         */
        constructor(ctx) {
            this.app = app;
            this.config = app.config;
        }
        /**
         * ApI 处理成功时统一返回结构
         * @params {Object} ctx 上下文
         * @params {Object} data 核心数据
         * @params {Object} metadata 附加元素
        */
        success(ctx, data = {}, metadata = {}) {
            ctx.status = 200;
            ctx.body = {
                success: true,
                data: data,
                metadata: metadata
            }
        }

          /**
         * ApI 处理失败时统一返回结构
         * @params {Object} ctx 上下文
         * @params {Object} message 错误信息
         * @params {Object} code 错误码
        */
        fail(ctx, message, code) {
            ctx.status = 200;
            ctx.body = {
                success: false,
                message,
                code
            }
        }
    }
}       