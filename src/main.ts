import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './main.less'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

Vue.use(Toast)
Vue.use(Antd)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')


