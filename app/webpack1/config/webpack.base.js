const glob = require('glob');
const path = require('path');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 动态构造 pageEntries  htmlWebpackPluginsList
const pageEntries = {};
const htmlWebpackPluginsList = [];
// 获取 app/pages 目录下的所有的入口文件 (entry.xxx.js)
const entryList = path.resolve(process.cwd(), './app/pages/**/entry.*.js');
glob.sync(entryList).forEach(file => {
    const entryName = path.basename(file, '.js');
    // 构造entry
    pageEntries[entryName] = file;

    //构造最终渲染的页面文件
    htmlWebpackPluginsList.push(
        // 辅助注入打包后的 bundle 文件 到 tpl 文件中
        new HtmlWebpackPlugin({
        filename: path.resolve(process.cwd(), './app/public/dist/', `${entryName}.tpl`),
        template: path.resolve(process.cwd(), './app/view/entry.tpl'),
        chunks: [entryName],
        inject: true
    }))
});



/**
 * webpack 基础配置
 * 
*/

module.exports = {
    // 入口配置
    entry: pageEntries,
    // 模块解析配置（决定了要加载哪些模块，以及用什么方式去解析）
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader',
                }
            },
            {
                test: /\.js$/,
                include: [
                    // 只对业务代码进行 babel 编译， 加快 webpack 的打包速度
                    path.resolve(process.cwd(), './app/pages'),
                ],
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.(png|jpe?g|gif)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 300,
                        esModule: false,
                        name: 'img/[name]_[hash:8].[ext]'
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },{
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            }, {
                test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
                use: {
                    loader: 'file-loader'
                }
            }
        ]
    },
    // 产物输出配置, 因为开发和生产环境输出不一致， 所以在各自的环境中配置
    output: {},
    // 配置模块解析的具体行为（定义 webpack 在打包时， 如何找到并解析具体模块的路径）
    resolve: {
        extensions: ['.js', '.vue', '.less', '.css'],
        alias: {
            $pages: path.resolve(process.cwd(), './app/pages'),
            $common: path.resolve(process.cwd(), './app/pages/common'),
            $widget: path.resolve(process.cwd(), './app/pages/widget'),
            $store: path.resolve(process.cwd(), './app/pages/store')
            

        }
    },
    // 配置 webpack 插件
    plugins: [
        // 处理 .vue 文件，这个插件是必须的
        // 它的职责是将你定义过的其他规则复制并应用到 .vue 文件中
        // 例如， 如果有一条匹配规则 /\.js$/ 的规则，那么它会应用到 .vue 文件中的 <script> 模版中
        new VueLoaderPlugin(),
        // 把第三方库暴露到 window.context 下
        new webpack.ProvidePlugin({
           Vue: 'vue'
        }),
        // 定义全局常量
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: true, // 支持Vue 解析 optionsApi
            __VUE_PROD_DEVTOOLS__: false, // 禁用 Vue 调试工具
            _VUE_PROD_HYDRATION_MISMATCH_DETAILS_: false // 禁用 Vue 生产环境下提示 水合信息 
        }),

        // 构建最终渲染的页面模版
        ...htmlWebpackPluginsList
    ],
    // 配置打包上输出优化（代码分割， 模块合并， 缓存， treeshaking, 压缩等优化策略）
    optimization: {
        /**
         * 把 js 文件打包成3种类型
         * 1. vendor 第三 lib 库， 基本不会改动，除非依赖版本升级
         * 2. common 业务组件代码的公共部分抽取出来，改动较少
         * 3. entry.{page} 不同页面 entry 里的业务组件代码的差异部分， 会经常改动
         * 目的把改动和引用频率不一样的 js 区分出来，以达到更好利用浏览器缓存的效果
        */
        splitChunks: {
            chunks: 'all', // 对同步和异步模块都进行分割
            maxAsyncRequests: 10, // 每次异步加载最大并行请求数
            maxInitialRequests: 10, // 入口文件最大并行请求数
            cacheGroups: {
                vendor: { // 打包第三方依赖库
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor', // 模块名称
                    priority: 20, // 优先级, 数字越大优先级越高
                    enforce: true, // 强制执行
                    reuseExistingChunk: true, // 复用已有的 公共 chunk
                },
                common: { // 公共模块
                    test: /[\\/]common|widgets[\\/]/, // 匹配规则
                    name: 'common', // 模块名称
                    minChunks: 2, // 被两处引用即被归类为公共模块
                    minSize: 0, // 最小分割文件大小（0 byte）
                    priority: 10, // 优先级, 数字越大优先级越高
                    reuseExistingChunk: true, // 复用已有的 公共 chunk
                },
                // entry: { // 打包不同页面 entry 里的业务组件代码的差异部分
                //     name: 'entry', // 模块名称
                //     chunks: 'all',
                //     minChunks: 1, // 被一处引用即被归类为入口模块
                //     minSize: 1, // 最小分割文件大小（1 byte）
                //     reuseExistingChunk: true, // 复用已有的 公共 chunk
                // }
            }
        }
    }
}