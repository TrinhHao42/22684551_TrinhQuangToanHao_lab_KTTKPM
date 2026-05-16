const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(express.json());

app.use('/api/users', createProxyMiddleware({ target: 'http://user-service:8081', changeOrigin: true, pathRewrite: {'^/api/users': ''} }));
app.use('/api/foods', createProxyMiddleware({ target: 'http://food-service:8082', changeOrigin: true, pathRewrite: {'^/api/foods': ''} }));
app.use('/api/orders', createProxyMiddleware({ target: 'http://order-service:8083', changeOrigin: true, pathRewrite: {'^/api/orders': ''} }));

app.listen(8080, () => console.log('API Gateway listening on 8080'));
