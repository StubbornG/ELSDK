module.exports = (app, router) => {
    const { project: projectController } = app.controller;
    // 当用户输入 http://ip:[port]/view/xxx时，能渲染出对应的路径
    router.get('/api/project', projectController.get.bind(projectController));
    router.get('/api/project/list', projectController.getList.bind(projectController));
    router.get('/api/project/model_list', projectController.getModelList.bind(projectController));
}
