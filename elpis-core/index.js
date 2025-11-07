const Koa = require('koa');
const path = require('path');
const { sep } = path; // 兼容不同操作路径上的斜杠
const env = require('./env');
const middlewareLoader = require('./loader/middleware');
const routerSchemaLoader = require('./loader/router-schema');
const routerLoader = require('./loader/router');
const controllerLoader = require('./loader/controller') 
const serviceLoader = require('./loader/service');
const configLoader = require('./loader/config');
const extendLoader = require('./loader/extend')

module.exports = {
    /**
     * 启动项目
     * @param {Object} options - 项目配置及
     * options = {
     * name // 项目名称’
     * homePage // 项目首页
     * }
    */
    start(options={}) {
        // Kao实例
        const app = new Koa();
        // 应用配置
        app.options = options;
        console.log(app.options);
        // 基础路径
        app.baseDir = process.cwd();
        console.log(app.baseDir);
        // 项目根目录
        app.businessPath = path.resolve(app.baseDir, `.${sep}app`);
        // 初始化环境配置
        app.env = env();

        // 加载middleware
        middlewareLoader(app);
        console.log('middlewareLoader done --');

        // 加载routerSchema
        routerSchemaLoader(app)
        console.log('routerSchemaLoader done --');

        // 加载controller
        controllerLoader(app)
        console.log('controllerLoader done --');

        // 加载service
        serviceLoader(app)
        console.log('serviceLoader done --');
        // 加载config
        configLoader(app)
        console.log('configLoader done --');
        // 加载extend
        extendLoader(app)
        console.log('extendLoader done --');

        // 注册elpis全局中间件
        const elpisMiddlewarePath = path.resolve(__dirname, `..${sep}app${sep}middleware.js`);
        const elpisMiddleware = require(elpisMiddlewarePath);
        elpisMiddleware(app);
        console.log('--- [start] load glob elpis midddleware file')

        // 注册业务全局中间件
        try {
            require(`${app.businessPath}${sep}middleware.js`)(app);
            console.log('--- [start] load glob business midddleware file')
        } catch(e) {
            console.log('{exception} there is not glob business midlleware file')
        }
        // 注册路由
        routerLoader(app)
        console.log('routerLoader done --');
        // 启动服务
        try {
        const port  = process.env.PORT || 8080;
        const host = process.env.IP || '0.0.0.0'
        app.listen(port, host, () => {
            console.log(`Server is running on http://${host}:${port}`);
        })
        } catch (error) {
        console.error(error);
        }

        return app;
    }
}