const path = require('path');
const { sep } = path
const glob = require('glob');

/**
 * controller loader
 * @param {object} koa实例
 * 
 * 加载所有的controller, 可通过 `app.controller.${目录}${文件}访问`
 * 
 * 例子：
 *  app/controller
 *      |
 *      | -- cutomer-module
 *              |
 *              |-- cutomer-controller.js
*/

module.exports = (app) => {
    const controller = {}

    // 读取 elpis/controller/**/**.js  下所有的文件
    const elpisControllerPath = path.resolve(__dirname, `..${sep}..${sep}app${sep}controller`)
    const elpisFileList = glob.sync(path.resolve(elpisControllerPath, `.${sep}**${sep}**.js`))
    elpisFileList.forEach(file => {
        handleFile(file)
    })

    // 读取 业务/controller/**/**.js  下所有的文件
    const businessControllerPath = path.resolve(app.businessPath, `.${sep}controller`)
    const businessFileList = glob.sync(path.resolve(businessControllerPath, `.${sep}**${sep}**.js`))
    businessFileList.forEach(file => {
        handleFile(file)
    })

    // 把内容加载到 app.controller 下
    function handleFile(file) {
        // 提取文件名
        let name = path.resolve(file);
        // 提取路径 app/controller/cutomer-module/cutomer-controller.js => cutomer-module/cutomer-controller
        name = name.substring(name.lastIndexOf(`controller${sep}`) + `controller${sep}`.length, name.lastIndexOf('.'))
        // 把_-改为驼峰式
        name = name.replace(/[_-][a-z]/ig, (s) => s.substring(1).toUpperCase())
        // 挂在controller 到内存 app 对象中
        let tempController = controller;

        const names = name.split(sep)
        console.log(names, 'names')
        for(let i = 0, len = names.length; i < len; i++) {
            if (i === len - 1) {
                const ControllerModule  = require(path.resolve(file))(app);
                tempController[names[i]] = new ControllerModule();
            } else {
                if (!tempController[names[i]]) {
                    tempController[names[i]] = {}
                }
                tempController = tempController[names[i]]
            }
        }
    }
    app.controller = controller
}
