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
module.exports = {
    /***
     * 启动 elpis
     * @param options 项目配置，透传到 elpis-core
     * **/
    serverStart(options = {}) {
        const app = ElpisCore.start(options);
        return app;
    }
}


