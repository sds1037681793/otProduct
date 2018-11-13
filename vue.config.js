module.exports = {
  lintOnSave: false,
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.json', '.vue'],
    },
  },
  devServer: {
    proxy: {
      '/api': {
        // target: 'http://116.62.196.201:7080',
        target: 'http://183.129.208.90:28000',
        ws: true,
        changeOrigin: true,
        pathRewrite:{
          '^/api':''
        }
      },
    }
  }
};
