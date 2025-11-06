module.exports = (app, router) => {
    const { view: ViewController } = app.controller;
    // 当用户输入 http://ip:[port]/view/xxx时，能渲染出对应的路径
    router.get('/view/:page', ViewController.renderPage.bind(ViewController));
    router.get('/view/:page/*', ViewController.renderPage.bind(ViewController));
}
