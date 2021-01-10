import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/tailwind.css'
import VueMoment from 'vue-moment'

Vue.config.productionTip = false

Vue.use(VueMoment)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
