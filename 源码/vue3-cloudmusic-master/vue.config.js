const { defineConfig } = require('@vue/cli-service')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  // 本地配置代理
  devServer: {
    // proxy: {
    //   '/api': {
    //     // target填写服务器的地址，如果在本地运行了后台服务，那么默认就是3000端口（后台服务默认开启端口）
    //     // http://www.codeman.ink:3000 --- 一位前辈部署的线上接口，应该是常驻的，readme中有提到
    //     // https://service-dm0oohqg-1311542432.gz.apigw.tencentcs.com/release/ --- 自己部署的线上接口，可能随时关闭
    //     // http://localhost:3000 --- 自己在本机启动后台服务默认就是 3000 端口，自己在本地运行后台服务更稳妥
    //     target:
    //       'https://service-dm0oohqg-1311542432.gz.apigw.tencentcs.com/release/',
    //     changeOrigin: true,
    //     ws: true,
    //     pathRewrite: {
    //       '^/api': '',
    //     },
    //   },
    // },
    proxy: {
      [process.env.VUE_APP_API_URL]: {
        // target: 'https://www.codeman.store',
        // http://www.codeman.ink:3000 --- 线上接口地址
        // target填写服务器的地址，如果在本地运行了后台服务，那么默认就是3000端口（后台服务默认开启端口）
        target: process.env.VUE_APP_API_URL,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          [`^${process.env.VUE_APP_API_URL}`]: '',
        },
      },
    },
  },
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  },
  runtimeCompiler: true,
})
