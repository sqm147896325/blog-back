import store from '../store'

// 导入长连接插件
import VueSocketIO from 'vue-socket.io';
io('localhost:9080/msg')
io('localhost:9080/chat')
let IO = io('localhost:9080')

const config = new VueSocketIO({
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

IO.on('connect', ()=> {
	console.log('socket.io连接成功!')
})

export default config