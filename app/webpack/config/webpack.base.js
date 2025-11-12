const path = require("path");
const webpack = require("webpack");
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');
/**
 * webpack基础配置
 */
//遍历获取./app/pages/ 目录下所有入口文件
const pageEntry = {}
const htmlWebpackPluginList = []
const entryList = path.resolve(__dirname, '../../pages/**/entry.*.js');
glob.sync(entryList).forEach(file => {
    const entryName = path.basename(file, '.js');
    pageEntry[entryName] = file;
    htmlWebpackPluginList.push(new HtmlWebpackPlugin({
        // 入口文件模板文件
        template: path.resolve(__dirname, '../../view/entry.tpl'),
        // 输出文件
        filename: path.resolve(process.cwd(), './app/public/dist/' + entryName + '.tpl'),
        chunks: [entryName]
    }))
});


module.exports = {
    //入口配置
    entry: pageEntry,
    //模块配置
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: require.resolve('vue-loader')
            },
            {
                test: /\.js$/,
                include: [ // 修改为 include
                    path.resolve(__dirname, '../../pages')
                ],
                use: require.resolve('babel-loader'),
            },
            {
                test: /\.css$/,
                use: [
                    require.resolve('style-loader'),
                    require.resolve('css-loader')
                ]
            },
            {
               test: /\.less$/,
               use: [
                require.resolve('style-loader'),
                require.resolve('css-loader'),
                require.resolve('less-loader')
               ]
            },
            {
               test: /\.(png|jpg|gif|svg)(\?.+)?$/,
               use: {
                loader: require.resolve('url-loader'),
                options: {
                    limit: 300,
                    esModule: false, // 修改为 esModule
                    name: 'img/[name].[hash:8].[ext]'
                   }
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: {
                    loader: require.resolve('file-loader')
                }
            }
        ]
    },
    //输出配置
    output: {},
    //配置模块解析
    resolve: {
        extensions: ['.js', '.vue', '.json', '.less', '.css'],
        alias: {
            '$pages': path.resolve(__dirname, '../../pages'),
            '$common': path.resolve(__dirname, '../../pages/common'),
            '$widgets': path.resolve(__dirname, '../../pages/widgets'),
            '$store': path.resolve(__dirname, '../../pages/store'),
        }
    },
    plugins: [
        // 处理 vue 文件
        new VueLoaderPlugin(),
        // 把第三方库暴露在window context下
        new webpack.ProvidePlugin({
            Vue: 'vue'
        }), 
        // html-webpack-plugin
        // new HtmlWebpackPlugin({
        //     // 入口文件模板文件
        //     template: path.resolve(process.cwd(), './app/view/entry.tpl'),
        //     // 输出文件名
        //     filename: path.resolve(process.cwd(), './app/public/dist/entry.page1.tpl'),
        //     chunks: ['entry.page1']
        // }),
        ...htmlWebpackPluginList,
        // 定义全局常量
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: true, // 是否支持vue3解析 optionsApi
            __VUE_PROD_DEVTOOLS__: false, // 禁用Vue调试工具
            __VUE_PROD_HYDRATION__MISMATCH__DETAILS__: false // 禁用生产展示水合性息
        }),
    ],
    //优化配置 （ 配置代码分割， 模块合并， 缓存， 压缩优化等策略 ）
    optimization: {
        // vendors 第三方lib库，基本不会改动除非依赖升级
        // common 代码公共部分，改动较少
        splitChunks: {
            chunks: 'all',
            // minChunks: 1, // 最少被引用次数
            maxAsyncRequests: 10, // 异步加载的并发请求数量
            maxInitialRequests: 10, // 入口文件的最大请求数量
            cacheGroups: { // 缓存组
                vendors: {
                    test: /[\\/]node_modules[\\/]/, // 匹配规则
                    name: 'vendors', // 缓存组名称
                    priority: 20, // 优先级
                },
                common: {
                    test: /[\\/]common|widgets[\\/]/, // 匹配规则
                    minChunks: 2, // 最少被引用次数
                    minSize: 1, // 最小分割文件大小
                    priority: 10, // 优先级
                    reuseExistingChunk: true, // 是否复用
                    name: 'common'
                }
            }
        }
    }
}