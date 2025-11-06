const glob = require('glob');
const path = require("path");
const {sep} = path;

/**
 * middlerware loader
 * @param {object} app Koa 实例
 * 
 * 加载所有middleware,可通过'app.middleware.${目录}.${文件}访问'
 * 
 * 例子：
 * app/middleware
 *  |
 *  | -- customer-module
 *          |
 *          | -- customer-middleware.js
 * 
 * => app.middleware.customerModule.customerMiddleware
 * */ 
module.exports = (app) => {
    // 读取app/middleware/**/**.js下所有的文件
    const  middlewarePath = path.resolve(app.businessPath, `.${sep}middleware`)
    const fileList = glob.sync(path.resolve(middlewarePath, `.${sep}**${sep}**.js`));
    // 遍历所有文件目录，把内容加载到 app.middleware 下
    const middlewares = {};
    fileList.forEach(file => {
        // 提取文件名称
        let name = path.resolve(file);

        // 截取路径 app/middleware/cutomer-module/customer-middleware.js => cutomer-module/customer-middleware
        name = name.substring(name.lastIndexOf(`middleware${sep}`) + `middleware${sep}`.length, name.lastIndexOf('.'))

        // 把'-'统一改为驼峰式
        name = name.replace(/[-_][a-z]/ig, (s) => s.substring(1).toUpperCase());

        // 挂在 middlerware 到内存app 对象中
        let tempMiddleware = middlewares;
        const names = name.split(sep);

        for(let i= 0, len = names.length; i <len; i++) {
            if (i === len - 1) {
                tempMiddleware[names[i]] = require(path.resolve(file))(app)
            } else {
                if (!tempMiddleware[names[i]]) {
                    tempMiddleware[names[i]] = {};
                }
                tempMiddleware = tempMiddleware[names[i]]
            }
        }
    })
    app.middlewares = middlewares 
}
