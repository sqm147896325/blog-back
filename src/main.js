// import './logger' // 自定义输出，弃用

// vue 主要库导入
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import storeFun from './store'

// ui库导入
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 其他导入
import VueGridLayout from 'vue-grid-layout'
// 导入工具方法
import msgTip from '@/utils/msgTip.js'
// 导入权限控制
import '@/permission'
// 导入微前端
import '@/micro'

// 导入自定义socket.io
import MadderSocket from './plugins/socket'
// 混入逻辑
import minix from '@/minix'
// 导入自定义指令
import directives from '@/utils/directives'

const app = createApp(App)

app.use(ElementPlus, {
  size: 'small'
})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(createPinia())
app.use(router)
app.use(VueGridLayout) // 引入vue-grid-layout布局
app.use(new MadderSocket({
  vuex: storeFun(),
  options: [{ name: 'msg', ip: `${import.meta.env.VITE_SOCKET_URL}/msg` }, { name: 'chat', ip: `${import.meta.env.VITE_SOCKET_URL}/chat` }, { name: 'term', ip: `${import.meta.env.VITE_SOCKET_URL}/term` }]
}))
app.use(directives)
app.mount('#app')

// 挂载自定义方法
app.config.globalProperties.$store = storeFun()
app.config.globalProperties.$msgTip = msgTip

app.mixin(minix)

// 方便调试
if (import.meta.env.NODE_ENV !== 'production') {
  window.$debug = app // 开发环境始终开启
}
