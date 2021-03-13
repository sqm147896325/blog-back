import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import '@/permission' // 权限控制
// 使用element-ui
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
