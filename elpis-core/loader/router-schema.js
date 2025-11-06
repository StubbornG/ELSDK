const path = require('path');
const { sep } = path;
const glob = require('glob');
/**
 * router-schema loader
 * 
 * @params {Object} app Koa 实例
 * 
 * 通过 'json-schema & ajv' 对API规则进行约束，配合api-params-verify 中间件使用
 * 
 * app/router-schema/**.js
 * 
 * 输出：
 * app.routerSchema = {
 * `${api1}: ${jsonSchema1},
 * `${api2}: ${jsonSchema2},
 * }
 * 
 * 
 * 
 * 
*/

module.exports = (app) => {
    // 读取 app/router-schema/**/**.js下所有的文件 
    const routerSchemaPath = path.resolve(app.businessPath, `.${sep}router-schema`);
    const filterList = glob.sync(path.resolve(routerSchemaPath, `.${sep}**${sep}**.js`));
    // 注册所有 routerSchema, 使得可以 app.routerSchema 访问
    let routerSchema = {};
    filterList.forEach(file => {
       routerSchema = {
        ...routerSchema,
        ...require(path.resolve(file))
       }
        
    })
    app.routerSchema = routerSchema;
}