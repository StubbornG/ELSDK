// const Koa = require('koa');
// // Kao实例
// const app = new Koa();

//  // 启动服务
//  try {
//     const port  = process.env.PORT || 8080;
//     const host = process.env.IP || '0.0.0.0'
//     app.listen(port, host, () => {
//         console.log(`Server is running on http://${host}:${port}`);
//     })
//  } catch (error) {
//     console.error(error);
//  }

const ElpisCore = require('./elpis-core');

// 引入 前端工程化构建方法
const FEBuildDev = require('./app/webpack/dev.js')
const FEBuildProd = require('./app/webpack/prod.js');
const controller = require('./elpis-core/loader/controller.js');

module.exports = {
    /**
     * 服务端基础
     * 
     * */
    controller: {
        Base: require('./app/controller/base.js')
    },
    Service: {
        Base: require('./app/service/base.js')
    },

    /**
     * 编译构建前端工程
     * @params env 环境变量 dev/prod
    */
    frontendBuild(env) {
        // 移除 env 变量可能包含的单引号
        const cleanedEnv = env ? env.replace(/'/g, '').trim() : '';
        console.log(cleanedEnv, cleanedEnv === 'local', '9022')
        if (cleanedEnv === 'local') {
            FEBuildDev()
        } else if (cleanedEnv === 'production') {
            FEBuildProd()
        }
    },

    /***
     * 启动 elpis
     * @param options 项目配置，透传到 elpis-core
     * **/
    serverStart(options = {}) {
        const app = ElpisCore.start(options);
        return app;
    }
}


