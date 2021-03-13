import Vue from 'vue'
import Vuex from 'vuex'
import aside from './modules/aside'	// 导入侧边栏状态模块

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
	},
	mutations: {
	},
	actions: {
	},
	modules: {
		aside
	}
})
