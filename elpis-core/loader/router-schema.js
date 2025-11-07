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
    let routerSchema = {};

    // 读取 elsdk/router-schema/**/**.js下所有的文件 
    const elpisRouterSchemaPath = path.resolve(__dirname, `..${sep}..${sep}app${sep}router-schema`);
    const elpisFilterList = glob.sync(path.resolve(elpisRouterSchemaPath, `.${sep}**${sep}**.js`));
    elpisFilterList.forEach(file => {
        handleFile(file)
    })

    // 读取 业务/router-schema/**/**.js下所有的文件 
    const businessRouterSchemaPath = path.resolve(app.businessPath, `.${sep}router-schema`);
    const businessFilterList = glob.sync(path.resolve(businessRouterSchemaPath, `.${sep}**${sep}**.js`));
    businessFilterList.forEach(file => {
        handleFile(file)
    })

    // 注册所有 routerSchema, 使得可以 app.routerSchema 访问
    function handleFile(file) {
        routerSchema = {
            ...routerSchema,
            ...require(path.resolve(file))
        }
             
    }
    app.routerSchema = routerSchema;
}