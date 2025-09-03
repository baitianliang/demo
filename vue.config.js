const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  lintOnSave: false,
  publicPath: './',
  transpileDependencies: true,
  // devServer: {
  //   proxy: {
  //     '/api': {
  //       target: '',
  //       changeOrigin: true,
  //       pathRewrite: {
  //           '^/api': '',
  //       },
  //     },
  //   },
  // }
})
