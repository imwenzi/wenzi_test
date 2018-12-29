// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import * as filters from './common/filters'
import VueBus from './common/vue-bus'
import 'reset-css/less/reset.less'
import '@/styles/common.less'
import 'animate.css/animate.min.css'

Vue.config.productionTip = false
Vue.use(VueBus)
// 全局过滤器设置
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
