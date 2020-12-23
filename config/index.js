'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      // '/profiles': {
      //   target: 'http://localhost:8091/api/profile/',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/profiles': ''
      //   }
      // },
      // '/profiles': {
      //   target: 'http://localhost:8000/p/',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/profiles': ''
      //   }
      // },
      // '/mqr': {
      //   target: 'http://localhost:8084/api/router/',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/mqr': ''
      //   }
      // },
      // '/mqrouters': {
      //   target: 'http://localhost:8000/mqr/',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/mqrouters': ''
      //   }
      // },
      // '/devices': {
      //   target: 'http://localhost:8081/api/device/',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/devices': ''
      //   }
      // },
      // '/devices': {
      //   target: 'http://localhost:8000/d/',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/devices': ''
      //   }
      // },
      // '/rules': {
      //   target: 'http://localhost:8083/api/',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/rules': ''
      //   }
      // },
      // '/rules': {
      //   target: 'http://localhost:8000/rc/',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/rules': ''
      //   }
      // },
      // '/logs': {
      //   target: 'http://localhost:8090/api/log',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/logs': ''
      //   }
      // },
      // '/instances': {
      //   target: 'http://localhost:8090/api/instance',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/instances': ''
      //   }
      // },
      // '/instances': {
      //   target: 'http://localhost:8000/gi/',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/instances': ''
      //   }
      // },
      // '/gateways': {
      //   target: 'http://localhost:8089/api/gateway/',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/gateways': ''
      //   }
      // },
      // '/gateways': {
      //   target: 'http://localhost:8000/gc/',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/gateways': ''
      //   }
      // },
      // '/users': {
      //   target: 'http://localhost:8093/api/',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/users': ''
      //   }
      // },
      // '/admins': {
      //   target: 'http://localhost:8093/api/admin',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/admins': ''
      //   }
      // },
      // '/services': {
      //   target: 'http://localhost:8085/api/service/',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/services': ''
      //   }
      // },
      // '/scenarios': {
      //   target: 'http://localhost:8092/api/scenario/',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/scenarios': ''
      //   }
      // },
      // '/scenarios': {
      //   target: 'http://localhost:8000/s/',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/scenarios': ''
      //   }
      // },
      // '/notices': {
      //   target: 'http://localhost:8088/api/notice/',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/notices': ''
      //   }
      // },
      // '/notices': {
      //   target: 'http://localhost:8000/n/',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/notices': ''
      //   }
      // },
      // '/commands': {
      //   target: 'http://localhost:8082/api/command/',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/commands': ''
      //   }
      // }
      // '/commands': {
      //   target: 'http://localhost:8000/c/',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/commands': ''
      //   }
      // }
      // '/api': {
      //   target: 'http://localhost:8000/',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/api': ''
      //   }
      // }
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // 环境变量
    env: require('./prod.env'),
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
