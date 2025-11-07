const path = require('path');
const { sep } = path
const glob = require('glob');

/**
 * service loader
 * @param {object} koa实例
 * 
 * 加载所有的service, 可通过 `app.service.${目录}${文件}访问`
 * 
 * 例子：
 *  app/service
 *      |
 *      | -- cutomer-module
 *              |
 *              |-- cutomer-service.js
*/

module.exports = (app) => {
    const service = {};

     // 读取 elpis/service/**/**.js  下所有的文件.
     const elpisMiddlewarePath = path.resolve(__dirname, `..${sep}..${sep}app${sep}service`)
     const elpisFileList = glob.sync(path.resolve(elpisMiddlewarePath, `.${sep}**${sep}**.js`))
     elpisFileList.forEach(file => {
        handleFile(file)
     })

    // 读取 业务/service/**/**.js  下所有的文件.
    const businessMiddlewarePath = path.resolve(app.businessPath, `.${sep}service`)
    const businessFileList = glob.sync(path.resolve(businessMiddlewarePath, `.${sep}**${sep}**.js`))
    businessFileList.forEach(file => {
        handleFile(file)
     })

    // 把内容加载到 app.service 下
    function handleFile(file) {
        // 提取文件名
        let name = path.resolve(file);

        // 提取路径 app/service/cutomer-module/cutomer-service.js => cutomer-module/cutomer-service
        name = name.substring(name.lastIndexOf(`service${sep}`) + `service${sep}`.length, name.lastIndexOf('.'))

        // 把_-改为驼峰式
        name = name.replace(/[_-][a-z]/ig, (s) => s.substring(1).toUpperCase())

        // service 到内存 app 对象中
        let tempService = service;

        const names = name.split(sep)
        
        for(let i = 0, len = names.length; i < len; i++) {
            if (i === len - 1) {
                const ServiceModule  = require(path.resolve(file))(app);
                tempService[names[i]] = new ServiceModule();
            } else {
                if (!tempService[names[i]]) {
                    tempService[names[i]] = {}
                }
                tempService = tempService[names[i]]
            }
        }
    }
    app.service = service
}
