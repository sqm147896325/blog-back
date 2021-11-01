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

// 导入长连接插件
import VueSocketIO from 'vue-socket.io';
import socketIO from 'socket.io-client';
socketIO(`ws://localhost:9080`);
socketIO('/msg')
let IO = socketIO('/chat')
const MsgIO = new VueSocketIO({
	debug: false,
    connection: IO,
	vuex: {
		store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_',
		options: {
			useConnectionNamespace: true
		}
	}
})
Vue.use(MsgIO);
MsgIO.io.on('connect', () => {
	console.log('msgIO初始化成功')
});

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
