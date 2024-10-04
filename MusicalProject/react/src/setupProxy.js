const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8082/cs',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/cs/api', // 프록시 요청 경로 변경
      },
    })
  );
};
