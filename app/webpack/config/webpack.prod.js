const path = require('path');
const mrege = require('webpack-merge');
const os = require('os');
// 引入基础配置
const baseConfig = require('./webpack.base.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CSSMiniExtractPlugin = require('css-minimizer-webpack-plugin');
const ClearWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackInjectAttributesPlugin = require('html-webpack-inject-attributes-plugin');
const TerserPlugin = require('terser-webpack-plugin');

// 获取 CPU 核心数用于多线程
const cpuCount = Math.max(1, Math.min(os.cpus().length, 4));
const webpackConfig = mrege(baseConfig, {
    mode: 'production', // 生产环境
    // devtool: 'source-map', // 生产环境需要配置source-map
    output: {
        filename: 'js/[name]_[chunkhash:8].bundle.js',
        path: path.resolve(process.cwd(), './app/public/dist/prod/'),
        publicPath: '/dist/prod/', // 修改为 publicPath
        crossOriginLoading: 'anonymous' // 解决跨域问题
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    require.resolve('css-loader')
                ],
            },
            {
                test: /\.less$/,
                exclude: /\.vue$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    require.resolve('css-loader'),
                    require.resolve('less-loader')
                ],
            },
            {
                test: /\.js$/,
                include: [
                    // 处理 elpis 目录
                    path.resolve(__dirname, '../../pages'),
                    // 处理 业务  目录
                    path.resolve(process.cwd(), './app/pages')
                ],
                use: {
                    loader: require.resolve('babel-loader'),
                    options: {
                        presets: [
                            [
                                require.resolve('@babel/preset-env'),
                                {
                                    targets: {
                                        browsers: ['> 1%', 'last 2 versions']
                                    }
                                }
                            ]
                        ],
                        plugins: [require.resolve('@babel/plugin-transform-runtime')]
                    }
                }
            },
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [
           new TerserPlugin({
                parallel: cpuCount, // 使用 CPU 核心数进行多线程压缩
                extractComments: true, // 提取注释
                terserOptions: {
                    compress: {
                        drop_console: true, // 移除console
                        drop_debugger: true, // 移除debugger
                    },
                    output: {
                        comments: false, // 移除注释
                    }
                }
           }),
           new CSSMiniExtractPlugin({
               parallel: cpuCount // CSS 多线程压缩
           })
        ]
    },
    plugins: [
        //每次打包清空清除dist目录
        new ClearWebpackPlugin([
            path.resolve(process.cwd(), './app/public/dist') // 删除dist目录
        ], {
            root: process.cwd(),
            verbose: true, // true为输出信息，false为不输出信息
            dry: false // true为不删除文件，false为删除文件
        }),
        // css单独打包
        new MiniCssExtractPlugin({
            chunkFilename: 'css/[name]_[contenthash:8].chunk.css'
        }),
        // 注入html
        new HtmlWebpackInjectAttributesPlugin({
            crossorigin: 'anonymous' // 解决跨域问题
        })
    ]
});

module.exports = webpackConfig;