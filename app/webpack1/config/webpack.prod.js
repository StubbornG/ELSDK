const path = require('path');
// 合并基类配置
const merge = require('webpack-merge');
const os = require('os');
const HappyPack = require('happypack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackInjectAttributesPlugin = require('html-webpack-inject-attributes-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

// 多线程 build 配置
const happpackCommonConfig = {
    debug: false,
    threadPool: HappyPack.ThreadPool({ size: os.cpus().length}),
} 

// 基类配置
const baseConfig = require('./webpack.base');
// 生产环境 webpack 配置
const webpackConfig = merge(baseConfig, {
    // 指定生产环境
    mode: 'production',
    // 生产环境的 output 配置
    output: {
        filename: 'js/[name]_[chunkhash:8].bundle.js',
        path: path.join(process.cwd(), './app/public/dist/prod'),
        publicPath: '/dist/prod',
        crossOriginLoading: 'anonymous'
    },
    module:{
        rules: [{
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader,
                'happypack/loader?id=css',
            ],
        }, {
            test: /\.js$/,
            include: [
                // 只对业务代码进行 babel 编译， 加快 webpack 的打包速度
                path.resolve(process.cwd(), './app/pages'),
            ],
            use: ['happypack/loader?id=js',]
        }]
    },
    // webpack 不会产生大量 hints 信息， 默认为 warning
    performance: {
        hints: false       
    },
    
    plugins: [
        // 每次 build 前清空 public/dist 目录
        new CleanWebpackPlugin(['public/dist'], {
            root: path.resolve(process.cwd(), './app/'),
            exclude: [],
            verbose: true,
            dry: false,
        }),
        // 提取 css 公共部分， 有效利用缓存
        new MiniCssExtractPlugin({
            chunkFilename: 'css/[name]_[contenthash:8].bundle.css',
        }),
        // 优化并压缩 css 资源
        new CssMinimizerPlugin(),
        // 多线程打包 JS, 加快打包速度
        new HappyPack({
            ...happpackCommonConfig,
            id: 'js',
            loaders:[`babel-loader?${JSON.stringify({
                presets: ['@babel/preset-env'],
                plugins: [
                    '@babel/plugin-transform-runtime',
                ]
            })}`],
        }),
        // 多线程 打包 css, 加快打包速度
        new HappyPack({
            ...happpackCommonConfig,
            id: 'css',
            loaders:[{
                path: 'css-loader',
                options:{
                    importLoaders: 1,
                }
            }],
        }),
        // 浏览器在请求资源时，不发送用户的凭证
        new HtmlWebpackInjectAttributesPlugin({
            crossOriginLoading: 'anonymous'
        })


    ],
    optimization: {
        // 使用 TerserPlugin 的并发和缓存，提升压缩阶段的性能
        // 清除 console.log 的代码
        minimize: true,
        minimizer: [
            new TerserWebpackPlugin({
                parallel: true, // 利用多核 CPU 的优势来加快压缩速度
                cache: true, // 启用缓存来加速构建过程
                terserOptions:{
                    compress:{
                        drop_console: true,
                    }
                }
                
            })
        ],
        // 将webpack 运行时生成的代码打包到 runtime.js
        runtimeChunk: true

    },

})
module.exports = webpackConfig;

