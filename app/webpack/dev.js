const experss = require("express");
const path = require("path");
const webpack = require("webpack");
const devMiddleware = require("webpack-dev-middleware");
const hotMiddleware = require("webpack-hot-middleware");

module.exports = () => {
    const {webpackConfig, DEV_SERVER_CONFIG} = require("./config/webpack.dev.js");

    const app = experss();
    const compiler = webpack(webpackConfig); // 编译

    //指定静态文件目录
    app.use(experss.static(path.join(__dirname, "../public/dist")));
    // 挂载webpack-dev-middleware（提供内存文件系统）
    app.use(
        devMiddleware(compiler, {
            // 输出文件目录
            publicPath: webpackConfig.output.publicPath,
            writeToDisk: (filePatrh)=> filePatrh.endsWith('.tpl'), // 只输出tpl文件
            headers: {
                "Access-Control-Allow-Origin": "*", // 允许跨域
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
            },
            stats: {
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false,
            },
        })
    );
    // 挂载webpack-hot-middleware   （热更新）
    app.use(
        hotMiddleware(compiler, {
            path: `/${DEV_SERVER_CONFIG.HMR_PATH}`, // 热更新路径
            reload: true, // 自动刷新
            log:()=>{},
        })
    );
    // 监听端口
    console.info("dev server start");
    const port = DEV_SERVER_CONFIG.PORT;
    app.listen(port, () => {
        console.info(`dev server start at port ${port}`);
    });
}

