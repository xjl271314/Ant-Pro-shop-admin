const path = require('path');

export default {
  entry: 'src/index.js',
  extraBabelPlugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  //代理文件上传
  proxy: {
    '/api/goods/upload/*': {
      target: 'http://localhost:3001/',
      changeOrigin: true,
      pathRewrite: { '^/api/goods/upload/': '' },
    },
    '/api/upload/*': {
      target: 'http://localhost:3001/',
      changeOrigin: true,
      pathRewrite: { '^/api/upload/': '' },
    },
  },
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
  },
  disableDynamicImport: true,
  publicPath: '/',
  hash: true,
};
