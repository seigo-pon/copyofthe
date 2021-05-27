import Vue from 'vue'
import Router from 'vue-router'
import ClipboardHome from './components/ClipboardHome.vue'
import ClipboardHistory from './components/ClipboardHistory.vue'
import ClipboardResult from './components/ClipboardResult.vue'
import ClipboardNotFound from './components/ClipboardNotFound.vue'
import About from './components/About.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: ClipboardHome,
      children: [
        {
          path: '',
          name: 'ClipboardHistory',
          component: ClipboardHistory,
        },
        {
          path: 'clipboard',
          name: 'ClipboardResult',
          component: ClipboardResult,
        },
        {
          path: 'clipboard/notfound',
          name: 'ClipboardNotFound',
          component: ClipboardNotFound,
        },
      ],
    },
    {
      path: '/about',
      component: About,
    },
  ]
})