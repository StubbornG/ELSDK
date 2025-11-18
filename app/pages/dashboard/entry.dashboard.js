import boot from '$elpisPages/boot';
import dashboard from './dashboard.vue';
import businessDashboardRouterConfig from '$businessDashboardRouterConfig'
const routes = [];

// 默认路由 - 重定向到首页
routes.push({
    path: '/',
    redirect: '/iframe'
});

// 头部菜单路由
routes.push({
    path: '/view/dashboard/iframe',
    component: () => import('./complex-view/iframe-view/iframe-view.vue')
});

routes.push({
    path: '/view/dashboard/schema',
    component: () => import('./complex-view/schema-view/schema-view.vue')
});


const siderRoutes = [{
    path: 'iframe',
    component: () => import('./complex-view/iframe-view/iframe-view.vue')
},
{
    path: 'schema',
    component: () => import('./complex-view/schema-view/schema-view.vue')
}]

// 业务扩展路由
if (typeof businessDashboardRouterConfig === 'function') {
    businessDashboardRouterConfig({ routes, siderRoutes })
}

// 侧边栏菜单路由
routes.push({
    path: '/view/dashboard/sider',
    component: () => import('./complex-view/sider-view/sider-view.vue'),
    children: siderRoutes
});

// 侧边栏兜底策略
routes.push({
    path: '/view/dashboard/sider/:chapters+',
    component: () => import('./complex-view/sider-view/sider-view.vue'),
})
boot(dashboard, {routes});


