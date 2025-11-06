// const Koa = require('koa');
// // Kao实例
// const app = new Koa();

//  // 启动服务
//  try {
//     const port  = process.env.PORT || 8080;
//     const host = process.env.IP || '0.0.0.0'
//     app.listen(port, host, () => {
//         console.log(`Server is running on http://${host}:${port}`);
//     })
//  } catch (error) {
//     console.error(error);
//  }

const ElpisCore = require('./elpis-core');

// 启动ElpisCore
ElpisCore.start({
    name: 'Elpis',
    homePage: '/view/project-list'
});


