/*
 * @Author: 焦质晔
 * @Date: 2019-11-28 23:07:05
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-01-30 16:07:07
 */
const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    proxy({
      target: 'http://localhost:7001',
      changeOrigin: true, // 支持跨域
      secure: false, // 支持 https
      pathRewrite: {
        '^/api': '/api'
      }
    })
  );
};
