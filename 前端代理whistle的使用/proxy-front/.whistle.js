// const pkg = require('./package.json');

exports.name = `[proxy-front]本地环境配置`;
exports.rules = `
test.tf56.com 127.0.0.1:8080

# 转发
test.tf56.com file://({"code":0,"data":"success"})
`;