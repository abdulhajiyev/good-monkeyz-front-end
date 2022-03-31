export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'GM',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Community lead project consisting of 10,000 Good Monkeyz NFTs — collection coming April 2022 🙈🙉🙊🐵🐒 ' },
      { name: 'format-detection', content: 'telephone=no' },
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes'
      },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'black-translucent'
      },
      { hid: 'og-type', property: 'og:type', content: 'website' },
      { hid: 'og-title', property: 'og:title', content: 'Good Monkeyz' },
      { hid: 'og-desc', property: 'og:description', content: 'Community lead project consisting of 10,000 Good Monkeyz NFTs — collection coming April 2022 🙈🙉🙊🐵🐒 ' },
      { hid: 'og-image', property: 'og:image',
          content: 'https://goodmonkeyz.art/social.jpg'
      },
      { hid: 'og-url', property: 'og:url', content: 'https://goodmonkeyz.art' },
      { hid: 't-type', name: 'twitter:card', content: 'summary_large_image' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'apple-touch-icon',
        type: 'image/png',
        href: '/apple-touch-icon.png'
      },
      { rel: 'icon',  type: 'image/svg+xml', href: '/favicon.svg'  },
      { rel: 'manifest', href: '/manifest.json' },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    "~layouts/global.css",
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/web3.js',
    { src: '~~/node_modules/vue-rellax/lib/nuxt-plugin', ssr: false }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  
  // fallback for 404 pages 
  generate: {
    fallback: true
  },
}