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
const MsgIO = new VueSocketIO({
    connection: `ws://localhost:9080/msg`,
})
Vue.use(MsgIO);
MsgIO.io.on('connect', () => {
	console.log('msgIO初始化成功')
});

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
