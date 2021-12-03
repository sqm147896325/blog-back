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

Vue.mixin({
	methods: {
		sokcet(type='init', data) {
			const params = {name: this.$store.state.user.userInfo.username, time: new Date().getTime(), userId: this.$store.state.user.userInfo.id}
			Object.assign( params, data)
			this.$socket.emit(type, params)
		}
	}
})

/* // ! 这里作为记录注册方法，等吃透了 vue-socket.io （它在stroe中的使用），我会对这个包进行改造
let IOMsg = io('localhost:9080/msg')
let IOChat = io('localhost:9080/chat')
Vue.mixin({
  mounted(){
    if(this.$options.socketsMsg){
      Object.keys(this.$options.socketsMsg).forEach(e => {
          if(e !== 'subscribe' && e !== 'unsubscribe') {
            IOMsg.on(e, this.$options.socketsMsg[e]);
          }
      });
    }
    if(this.$options.socketsChat){
      Object.keys(this.$options.socketsChat).forEach(e => {
          if(e !== 'subscribe' && e !== 'unsubscribe') {
            IOChat.on(e, this.$options.socketsChat[e]);
          }
      });
    }
  }
})
Vue.prototype.$socketMsg = IOMsg
Vue.prototype.$socketChat = IOChat */

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
