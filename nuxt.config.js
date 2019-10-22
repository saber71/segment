const env = process.env.NODE_ENV
const isDev = env === 'development'
// const isDev = false
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {name: 'render', content: 'webkit'},
      {hid: 'description', name: 'description', content: process.env.npm_package_description || ''}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },
  server: {
    host: '0.0.0.0',
    port: 1999
  },
  axios: {
    proxyHeaders: true,
    credentials: true,
    proxy: true,
    prefix: '/api',
  },
  proxy: {
    '/api': {
      target: isDev ? 'http://localhost:8080' : 'http://47.103.82.183:8080',
      pathRewrite: {'^/api': ''},
    }
  },
  /*
  ** Customize the progress-bar color
  */
  loading: {color: 'red'},
  /*
  ** Global CSS
  */
  css: [
    '@/assets/css/global.scss',
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/custom',
    '~/plugins/ajax',
    '~/plugins/axios',
    '~/plugins/vue-highlightjs',
    {src: '@/plugins/mavon-editor', ssr: false},
  ],
  /*
  ** Nuxt.js dev-modules
  */
  devModules: [
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
  ],
  tailwindcss: {
    configPath: '~/tailwind.config.js',
    cssPath: '~/assets/css/tailwind.css'
  },
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/proxy',
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios'
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  },
  // vue: {
  //   config: {
  //     productionTip: false,
  //     devtools: false,
  //     silent: true,
  //     performance: false
  //   },
  // },
  // loaders: {
  //   vue: {
  //     hotReload: false
  //   }
  // }
}
