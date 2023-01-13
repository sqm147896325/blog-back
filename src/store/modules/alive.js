export default {
	namespaced:true,
    state: {
		keepArr: [], // 保存缓存的路由对象
		keepName: [], // 保存缓存的路由的名称
	},
	mutations: {
		setKeepArr(state, arr) {
			state.keepName = arr.map(e => {
				console.log(e.matched[e.matched.length - 1])
				return e.matched[e.matched.length - 1].name
			})
			state.keepArr = arr
			console.log('state.keepName', state.keepName)
		}
	},
	actions: {
	},
};