export default {
	namespaced:true,
    state: {
		keepArr: [], // 保存缓存的路由对象
	},
	getters: {
		// 保存缓存的路由的标题
		keepTitle: state => {
			return state.keepArr.map(e => {
				return e.meta.title
			})
		},
		// 保存缓存的路由的name
		keepName: state => {
			return state.keepArr.map(e => {
				return e.name
			})
		},
	},
	mutations: {
		setKeepArr(state, arr) {
			state.keepArr = arr
		},
		closeKeep(state, item) {
			state.keepArr = state.keepArr.filter(e => {
				return e.meta.title !== item
			})
		}
	},
	actions: {
	},
};