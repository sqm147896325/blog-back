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

// // 导入socket.io
// import socket from './socket';
// Vue.use(socket)

// 导入自定义socket.io
import MadderSocket from './plugins/socket';
Vue.use(new MadderSocket({
  vuex: store,
  options: [{ name: 'msg', ip: `${ import.meta.env.VITE_SOCKET_URL }/msg` }, { name: 'chat', ip: `${ import.meta.env.VITE_SOCKET_URL }/chat` }]
}))

// 混入逻辑
import minix from '@/minix'
Vue.mixin(minix)

Vue.config.productionTip = false

// 导入工具方法
import msgTip from '@/utils/msgTip.js';
Vue.prototype.$msgTip = msgTip

// 方便调试
const $debug = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
if (import.meta.env.NODE_ENV !== 'production') {
	window.$debug = $debug // 开发环境始终开启
  store.commit('app/setDebugSocket', true) // socket的debug开关
}
