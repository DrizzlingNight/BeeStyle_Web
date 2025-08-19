module.exports = {
  transpileDependencies: [
    'vuetify'
  ],

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: './lang',
      enableInSFC: false
    }
  },

  devServer: {
    proxy: {
      "/api": {    // 这里的`/api`是自定义的
        //target: "http://192.168.50.90:7000/", //这里是真实的接口baseURL
        target: "http://devapi.beestyle.io", //这里是真实的接口baseURL
        // target: "https://b98d-180-217-73-98.ngrok.io", // 臨時的接口
        // target:"http://192.168.50.90:8888/",
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "/api/": "", // 这里的`^/api`也是是自定义的
        },
      },
      "/prod-api": {
        target: "http://devapi.beestyle.io", //这里是真实的接口baseURL
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "/prod-api/": "", // 这里的`^/api`也是是自定义的
        },
      }
    },
  }
}
