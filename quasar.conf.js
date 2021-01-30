// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js

module.exports = function (ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: ['axios'],

    css: ['app.styl'],

    extras: [
      // 'ionicons-v4',
      // 'mdi-v3',
      'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons' // optional, you are not bound to it
    ],

    framework: {
      // iconSet: 'ionicons-v4',
      lang: 'es', // Quasar language

      // all: true, // --- includes everything; for dev only!

      components: [
        'QLayout',
        'QHeader',
        'QDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QList',
        'QItem',
        'QItemSection',
        'QItemLabel',
        'QPageContainer',
        'QForm',
        'QInput',
        'QToggle',
        'QCard',
        'QCardSection',
        'QSeparator',
        'QAvatar',
        'QTooltip',
        'QMenu',
        'QTable',
        'QTh',
        'QTr',
        'QTd',
        'QDialog',
        'QRating',
        'QImg',
        'QCardActions',
        'QSelect',
        'QDate',
        'QPopupProxy',
        'QBtnToggle',
        'QSpace',
        'QEditor',
        'QUploader',
        'QInnerLoading',
        'QSpinnerGears',
        'QSpinner',
        'QAjaxBar',
        'QFooter',
        'QCheckbox',
        'QOptionGroup',
        'QRadio',
        'QPageSticky',
        'QLinearProgress',
        'QTree',
        'QTabPanels',
        'QTabPanel',
        'QTabs',
        'QTab',
        'QRouteTab',
        'QStepper',
        'QStep',
        'QStepperNavigation'
      ],
      directives: ['Ripple', 'ClosePopup'],
      plugins: ['Loading', 'Notify', 'Dialog', 'LocalStorage']
    },

    supportIE: true,

    build: {
      prod: true,
      scopeHoisting: true,
      // vueRouterMode: 'history',
      vueCompiler: true,
      gzip: true,
      minify: true,
      uglifyOptions: {
        compress: {
          pure_funcs: ['console.log']
        },
        mangle: {
          reserved: ['console.log']
        },
        output: {
          comments: false
        }
      },
      // analyze: true,
      // extractCSS: false,
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: {
            formatter: require('eslint').CLIEngine.getFormatter('stylish'),
            fix: true
          }
        })
      }
    },

    devServer: {
      // https: true,
      disableHostCheck: true,
      port: 8082,
      open: true // opens browser window automatically
    },

    // animations: 'all', // --- includes all animations
    animations: [],

    ssr: {
      pwa: false
    },

    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {}, // only for NON InjectManifest
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar App',
        // description: 'A Quasar Framework app',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            src: 'statics/icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'statics/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    },

    cordova: {
      id: 'com.competenciasparaganar'
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    electron: {
      // bundler: 'builder', // or 'packager'

      extendWebpack (cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration
        // appId: 'swisscontact-web'
      }
    }
  }
}
