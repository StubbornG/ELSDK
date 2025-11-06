const path = require('path');
const { sep } = path
const glob = require('glob');

/**
 * extend loader
 * @param {object} koa实例
 * 
 * 加载所有的extend, 可通过 `app.extend.${目录}${文件}访问`
 * 
 * 例子：
 *  app/extend
*      | 
*      |-- cutomer-extend.js
*/

module.exports = (app) => {
    // 读取 app/extend/**.js  下所有的文件
    const extendPath = path.resolve(app.businessPath, `.${sep}extend`)
    const fileList = glob.sync(path.resolve(extendPath,  `.${sep}**.js`))
    // 遍历所有的文件目录， 把内容加载到 app.extend 下
    const extend = {}
    fileList.forEach(file => {
        // 提取文件名
        let name = path.resolve(file);

        // 提取路径 app/extend/cutomer-extend.js => cutomer-extend
        name = name.substring(name.lastIndexOf(`extend${sep}`) + `extend${sep}`.length, name.lastIndexOf('.'))

        // 把_-改为驼峰式
        name = name.replace(/[_-][a-z]/ig, (s) => s.substring(1).toUpperCase())

        // 过滤 app 已经存在的key
        for(const key in app) {
            if (key === app) {
                console.log(`[extend load error] name: ${name} is already in app`);
                return
            }
        }
        
        // 把 extend 挂载到 app 上
        app[name] = require(path.resolve(file))(app)
    })
}
