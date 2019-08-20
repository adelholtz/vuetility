module.exports = {
  title: 'Vuetility',
  description: 'Vuetility is a wrapper for Vuex providing additional functionality',
  theme: 'vuepress-theme-thindark',
  base: '/',
    themeConfig: {
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Documentation', link: '/guide/introduction' },
            { text: 'Vuex', link: 'https://vuex.vuejs.org' },
        ],
        displayAllHeaders: true,
        sidebar: {
            '/guide/': [
                'introduction', 
                'getting_started', 
                'model',         
                'usage_namespaced',
                'usage_without_namespace',       
                'updateing_state_vars',
                'type_security'       
            ]
        }
    }
}
