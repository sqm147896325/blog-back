// !(弃用)
import store from '../store'

// 导入长连接插件
import VueSocketIO from 'vue-socket.io'
const IO = window.io(`${import.meta.env.VITE_SOCKET_URL}/msg`)
// io('localhost:9080/chat')
// io('localhost:9080')

const config = new VueSocketIO({
  debug: false,
  connection: IO,
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_',
    extraHeaders: { 'Access-Control-Allow-Origin': '*' },
    options: {
      useConnectionNamespace: true
    }
  }
})

export default config
