const webpack = require('webpack')
const webpackProdConfig = require('./config/webpack.prod.js');
console.log('\n开始构建...\n');
webpack(webpackProdConfig, (err, stats) => {
    if(err){ console.log(err); return}
    process.stdout.write(stats.toString({
        colors: true, // 添加颜色
        modules: false, // 不显示内置模块信息
        children: false, // 不显示子级信息
        chunks: false,// 不显示代码块信息
        chunkModules: false // 不显示代码块模块信息
    }) + '\n\n');
});