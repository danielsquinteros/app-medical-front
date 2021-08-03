import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from 'axios'
import moment from 'moment'

Vue.prototype.moment = moment

//Vue.use(require('vue-moment'));

Vue.config.productionTip = false
axios.defaults.baseURL='https://vast-lowlands-81754.herokuapp.com/api/'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
