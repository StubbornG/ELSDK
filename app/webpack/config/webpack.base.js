const path = require("path");
const webpack = require("webpack");
const merge = require('webpack-merge'); // 修正拼写错误：mrege -> merge
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const fs = require('fs');
/**
 * webpack基础配置
 */
// 动态构造 elpisPageEntry 和 elpisHtmlWebpackPluginList
const elpisPageEntry = {}
const elpisHtmlWebpackPluginList = []
//遍历获取 elpis/app/pages/ 目录下所有入口文件
const elpisEntryList = path.resolve(__dirname, '../../pages/**/entry.*.js');
glob.sync(elpisEntryList).forEach(file => {
    handleFile(file, elpisPageEntry, elpisHtmlWebpackPluginList);
});

// 动态构造 businessPageEntry 和 businessHtmlWebpackPluginList
const businessPageEntry = {}
const businessHtmlWebpackPluginList = []
//遍历获取 business/app/pages/ 目录下所有入口文件
const businessEntryList = path.resolve(process.cwd(), './app/pages/**/entry.*.js');
glob.sync(businessEntryList).forEach(file => {
    handleFile(file, businessPageEntry, businessHtmlWebpackPluginList);
});


// 构造相关的 webpack 处理数据结构
function handleFile(file, entries = {}, htmlWebpackPluginList = []) {
    const entryName = path.basename(file, '.js');
    entries[entryName] = file;
    htmlWebpackPluginList.push(new HtmlWebpackPlugin({
        // 入口文件模板文件
        template: path.resolve(__dirname, '../../view/entry.tpl'),
        // 输出文件
        filename: path.resolve(process.cwd(), './app/public/dist/' + entryName + '.tpl'),
        chunks: [entryName]
    }))
}

// 加载业务 webpack 配置
let bussinessWebpackConfig = {};
try {
    bussinessWebpackConfig = require(`${process.cwd()}/app/webpack.config.js`);
} catch (e) {
    console.log('未找到业务webpack配置文件，使用默认配置');}


module.exports = merge.smart({
    //入口配置
    entry: Object.assign({},elpisPageEntry, businessPageEntry),
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
                    // 处理 elpis 目录
                    path.resolve(__dirname, '../../pages'),
                    // 处理 业务  目录
                    path.resolve(process.cwd(), './app/pages')
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
        alias: (() => {
            const aliasMap = {};
            const blankModulePath = path.resolve(__dirname, '../libs/blank.js');

            // dashboard 路由扩展配置
            const businessDashboardRouterConfig = path.resolve(process.cwd(), './app/pages/dashboard/router.js');
            aliasMap['$businessDashboardRouterConfig'] = fs.existsSync(businessDashboardRouterConfig) ? businessDashboardRouterConfig : blankModulePath;

            // schema-view components 扩展配置
            const businessComponentConfig = path.resolve(process.cwd(), './app/pages/dashboard/complex-view/schema-view/components/component-config.js');
            console.log(businessComponentConfig, 'businessComponentConfig')
            aliasMap['$businessComponentConfig'] = fs.existsSync(businessComponentConfig)? businessComponentConfig : blankModulePath;

            // schema-from 扩展配置
            const businessFormItemConfig = path.resolve(process.cwd(), './app/pages/widgets/schema-form/form-item-config.js');
            aliasMap['$businessFormItemConfig'] = fs.existsSync(businessFormItemConfig)? businessFormItemConfig : blankModulePath;

             // schema-search-bar 扩展配置
             const businessSearchItemConfig = path.resolve(process.cwd(), './app/pages/widgets/schema-search-bar/search-item-config.js');
             aliasMap['$businessSearchItemConfig'] = fs.existsSync(businessSearchItemConfig)? businessSearchItemConfig : blankModulePath;


            return {
                'vue': require.resolve('vue'),
                '@babel/runtime/helpers/asyncToGenerator': require.resolve('@babel/runtime/helpers/asyncToGenerator'),
                '@babel/runtime/regenerator': require.resolve('@babel/runtime/regenerator'),
                '$elpisPages': path.resolve(__dirname, '../../pages'),
                '$elpisCommon': path.resolve(__dirname, '../../pages/common'),
                '$elpisCurl': path.resolve(__dirname, '../../pages/common/curl.js'),
                '$elpisUtils': path.resolve(__dirname, '../../pages/common/utils.js'),
                '$elpisWidgets': path.resolve(__dirname, '../../pages/widgets'),
                '$elpisHeaderContainer': path.resolve(__dirname, '../../pages/widgets/header-container/header-container.vue'),
                '$elpisSiderContainer': path.resolve(__dirname, '../../pages/widgets/sider-container/sider-container.vue'),
                '$elpisSchemaTable': path.resolve(__dirname, '../../pages/widgets/schema-table/schema-table.vue'),
                '$elpisSchemaForm': path.resolve(__dirname, '../../pages/widgets/schema-form/schema-form.vue'),
                '$elpisSchemaSearchBar': path.resolve(__dirname, '../../pages/widgets/scheme-search-bar/scheme-search-bar.vue'),
                '$elpisStore': path.resolve(__dirname, '../../pages/store'),
                '$elpisBoot': path.resolve(__dirname, '../../pages/boot.js'), 
                ...aliasMap
            }
        })()
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
        ...elpisHtmlWebpackPluginList,
        ...businessHtmlWebpackPluginList,
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
}, bussinessWebpackConfig)