// app信息模块，使用命名空间分割
export default {
	namespaced:true,
    state: {
		// 是否是debug模式
		debug: {
			socket: false
		},
	},
	mutations: {
		// 设置用户信息
		setDebugSocket(state, data){
			state.debug.socket = data;
		},
	},
	actions: {
	},
};