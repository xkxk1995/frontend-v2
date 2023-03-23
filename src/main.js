import './workers/register'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import App from './App.vue'
import Vue from 'vue'
import vuetify from './plugins/vuetify'
import store from './store'
import router from './router'
import i18n from '@/i18n'
import '@/components/functional'
import environment from '@/utils/environment'

import '@fontsource/roboto/latin-300.css'
import '@fontsource/roboto/latin-400.css'
import '@fontsource/roboto/latin-500.css'
import '@fontsource/roboto/latin-700.css'

import './injections'
import PenguinProbe from '@/utils/probe'

if (!window.Intl) require('intl-collator')

Vue.config.productionTip = false

Vue.config.performance = environment.debug.performance
Vue.config.devtools = environment.debug.devtools

async function bootstrap () {
  Vue.prototype.$probe = new PenguinProbe()
  Vue.prototype.$env = environment

  new Vue({
    vuetify,
    router,
    store,
    i18n,
    render: h => h(App)
  }).$mount('#app')
}

bootstrap()
