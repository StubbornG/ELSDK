
// 合并基类配置
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');


// 基类配置
const baseConfig = require('./webpack.base');
const { TIMEOUT } = require('dns');
const { devtools } = require('vue');

// dev-server 配置
const DEV_SERVER_CONFIG = {
    HOST: '127.0.0.1',
    PORT: 9002,
    HMR_PATH:'_webpack_hmr', // 官方规定
    TIMEOUT: 20000,
};

// 开发阶段的 entry 配置需要加入 hmr
Object.keys(baseConfig.entry).forEach(v => {
    // 第三方库不作为 hmr 入口
  if (v !== 'vendor') {
    baseConfig.entry[v] = [
        // 主入口文件
        baseConfig.entry[v],
        // hmr 更新入口， 官方指定的 hmr 入口
        `webpack-hot-middleware/client?path=http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}/${DEV_SERVER_CONFIG.HMR_PATH}&timeout=${DEV_SERVER_CONFIG.TIMEOUT}&reload=true`
    ]
  }
})

// 开发环境 webpack 配置
const webpackConfig = merge(baseConfig, {
    // 指定开发环境
    mode: 'development',
    // source-map 开发工具， 呈现代码的映射关系， 便于在开发过程中调试代码
    devtool: 'eval-cheap-module-source-map',
    // 开发环境的 output 配置
    output: {
        filename: 'js/[name]_[chunkhash:8].bundle.js',
        path: path.join(process.cwd(), './app/public/dist/dev/'), // 输出文件存储路径
        publicPath: `http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}/public/dist/dev/`, // 外部资源公共路径
        globalObject: 'this', // 指定全局对象， 默认是 window
    },
    // 开发环境的 plugins 配置
    plugins: [
        // HotModuleReplacementPlugin 用于实现热模块替换（Hot Module Replacement 简称 HMR）
        // 模块热替换允许在应用程序运行时替换模块
        // 极大地提升开发效率，因为能让程序一直保持运行状态
        new webpack.HotModuleReplacementPlugin({
            multiStep: true,
        }),
        
    ]
})

module.exports = {
    // webpack 配置
    webpackConfig,
    // dev-server 配置, 暴露给 dev.js 使用
    DEV_SERVER_CONFIG
}

