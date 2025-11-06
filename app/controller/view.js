module.exports = (app) => {
    return class ViewController {
        /**渲染页面
         * #param {Object} ctx 上下文
         * */ 
       async renderPage(ctx) {
        const {query, params} = ctx.request;
        app.logger.info(`[viewController] query: ${JSON.stringify(query)}`)
        app.logger.info(`[viewController] params: ${JSON.stringify(params)}`)
        await ctx.render(`dist/entry.${ctx.params.page}`, {
            projKey: ctx.query?.proj_key,
            name: app.options?.name,
            homePage: app.options?.homePage,
            env: app.env.get(),
            options: app.options
        });
       }
        
        
    }
}
