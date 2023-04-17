import './logger'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 导入权限控制
import '@/permission'

// 导入自定义socket.io
import MadderSocket from './plugins/socket'

// 混入逻辑
import minix from '@/minix'

// 导入工具方法
import msgTip from '@/utils/msgTip.js'

// 导入微前端
import microApp from '@micro-zoe/micro-app'
Vue.use(ElementUI)
Vue.use(new MadderSocket({
  vuex: store,
  options: [{ name: 'msg', ip: `${import.meta.env.VITE_SOCKET_URL}/msg` }, { name: 'chat', ip: `${import.meta.env.VITE_SOCKET_URL}/chat` }, { name: 'term', ip: `${import.meta.env.VITE_SOCKET_URL}/term` }]
}))
Vue.mixin(minix)

Vue.config.productionTip = false
Vue.prototype.$msgTip = msgTip
microApp.start({
  plugins: {
    modules: {
      comapp: [
        {
          loader (code) {
            if (process.env.NODE_ENV === 'development') {
              // 这里 basename 需要和子应用vite.config.js中base的配置保持一致
              code = code.replace(/(from|import)(\s*['"])(\/comapp\/)/g, all => {
                // 关于 import ... from ... 的替换
                return all.replace('/comapp/', 'http://localhost:3010/comapp/')
              }).replace(/(from|import)(\(['"])(\/comapp\/)/g, all => {
                // 关于 import()的替换
                return all.replace('/comapp/', 'http://localhost:3010/comapp/')
              })
            }
            return code
          }
        }
      ]
    }
  }
})

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

// 首次执行的方法
store.dispatch('theme/setTheme', 'default')

console.log(666)
