const { valueEquals } = require('element-plus');

module.exports = (app) => {
    const BaseController = require('./base')(app);
    return class BusinessController extends BaseController {
        create(ctx) {
            const { product_name: productName, price, inventory } = ctx.request.body;
            this.success(ctx, {
                product_id: Date.now(),
                product_name: productName,
                price,
                inventory
            });
        }
        update(ctx) {
            const { product_id: productId, product_name: productName, price, inventory } = ctx.request.body;
            this.success(ctx, {
                product_id: productId,
                product_name: productName,
                price,
                inventory
            });
        }
        get(ctx) {
            const { product_id: productId } = ctx.request.query;

            const productList = this.getProductList(ctx);
            const productItem = productList.find(item => item.product_id === productId);
            this.success(ctx, productItem);
        }
        remove(ctx) {
            const { product_id: productId } = ctx.request.body;
            this.success(ctx, {
                projKey: ctx.projKey,
                product_id: productId
            });
        }
        getList(ctx) {
            // 获取 proj_key
            // 根据不同的 proj_key 做不一样的数据提取

           const { product_name: productName, page, size } = ctx.request.query;
           let productList = this.getProductList(ctx);

           if (productName && productName !== 'all') {
            productList = productList.filter(item => item.product_name ===productName);
           }

           this.success(ctx, productList, {
            total: 3,
            page,
            size
           });
        }

        getProductList(ctx) {
            return [{
                product_id: '1',
                product_name: `${ctx.projKey} - 《大前端面试宝典》`,
                price: 39.9,
                inventory: 99999,
                create_time: '2023-07-03 20:23:22'
               }, {
                product_id: '2',
                product_name: `${ctx.projKey} - 《前端求职指导》`,
                price: 199,
                inventory: 99999,
                create_time: '2023-07-03 20:23:22'
               }, {
                product_id: '3',
                product_name: `${ctx.projKey} - 《大前端全栈实践》`,
                price: 1999,
                inventory: 99999,
                create_time: '2023-07-03 20:23:22'
               }];
        }

        getProductEnumList(ctx) {
            this.success(ctx, [{
                label: `全部`,
                value: 'all'
            },{
                label: `${ctx.projKey} - 《大前端面试宝典》`,
                value: `${ctx.projKey} - 《大前端面试宝典》`
               }, {
                label: `${ctx.projKey} - 《前端求职指导》`,
                value: `${ctx.projKey} - 《前端求职指导》`
               }, {
                label: `${ctx.projKey} - 《大前端全栈实践》`,
                value: `${ctx.projKey} - 《大前端全栈实践》`
            }]);
        }
    }
}