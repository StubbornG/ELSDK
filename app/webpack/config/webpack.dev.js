const path = require('path');
const merge = require('webpack-merge'); // 修正拼写错误：mrege -> merge
const webpack = require('webpack');
// 基础配置
const baseConfig = require('./webpack.base.js');

// devServer 配置
const DEV_SERVER_CONFIG = {
    HOST: '127.0.0.1',
    PORT: 9002,
    HMR_PATH: '__webpack_hmr',
    TIMEOUT: 20000
};

// 开发阶段 entry入口需要hmr
Object.keys(baseConfig.entry).forEach(v => {
    if (v !== 'vendor') {
        baseConfig.entry[v] = [
            baseConfig.entry[v],
            `${require.resolve('webpack-hot-middleware/client')}?path=http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}/${DEV_SERVER_CONFIG.HMR_PATH}&timeout=${DEV_SERVER_CONFIG.TIMEOUT}&reload=true`
        ];
    }
});

const webpackConfig = merge(baseConfig, {
    mode: 'development', // 开发模式
    // 开发环境下开启 source-map
    devtool: 'source-map',
    // 开发环境输出配置
    output: {
        filename: 'js/[name]_[chunkhash:8].bundle.js',
        path: path.resolve(process.cwd(), './app/public/dist/dev/'),
        publicPath: `http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}/public/dist/dev/`,  // 外部资源公共路径
        globalObject: 'this'
    },
    optimization: {
        minimize: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(
           {
             multiStep:false // 是否开启多步骤编译
           }
        ) // 显式添加 HMR 插件
    ]
});

module.exports = {
    //  webpack 配置
    webpackConfig,
    //  devServer 配置
    DEV_SERVER_CONFIG
};