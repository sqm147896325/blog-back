import Vue from 'vue'
import Vuex from 'vuex'
import aside from './modules/aside'	// 导入侧边栏状态模块
import user from './modules/user'	// 导入用户信息模块
import app from './modules/app'	// 导入app信息模块
import socket from './modules/socket'	// 导入app信息模块

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
	},
	mutations: {
	},
	actions: {
	},
	modules: {
		aside,
		user,
		app,
		socket
	}
})
