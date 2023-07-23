//const { createProxyMiddleware } = require('http-proxy-middleware');
//const { env } = require('process');

//const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
//  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:55981';

//const context =  [
//  "/weatherforecast",
//];

//module.exports = function(app) {
//  const appProxy = createProxyMiddleware(context, {
//    target: target,
//    secure: false,
//    headers: {
//      Connection: 'Keep-Alive'
//    }
//  });

//  app.use(appProxy);
//};

const { createProxyMiddleware } = require('http-proxy-middleware');
const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:15211';

const context = [
    "/weatherforecast",
    "/api/customers",
    "/api/products",
    "/api/stores",
    "/api/sales"
];

module.exports = function (app) {
    const appProxy = createProxyMiddleware(context, {
        target: target,
        secure: false,
        headers: {
            Connection: 'Keep-Alive'
        }
    });

    app.use(appProxy);
};

