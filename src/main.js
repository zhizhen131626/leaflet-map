import Vue from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import * as leaflet from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.pm'
import 'leaflet.pm/dist/leaflet.pm.css'
import 'leaflet-velocity/dist/leaflet-velocity.css'
import 'leaflet-velocity/dist/leaflet-velocity'

// reset css
import 'normalize.css'
import 'reset-css'

import App from './App.vue'
import router from './router'
import store from './store'

Vue.use(Antd)

Vue.config.productionTip = false

Vue.prototype.$leaflet = leaflet

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
