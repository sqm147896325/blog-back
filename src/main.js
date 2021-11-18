import './logger'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入element-ui
import ElementUI , { Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 导入权限控制
import '@/permission';

// 导入socket.io
import socket from './socket';

Vue.use(socket)

Vue.config.productionTip = false

// 方便调试
const $debug = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
if (import.meta.env.NODE_ENV !== 'production') {
	window.$debug = $debug
}
