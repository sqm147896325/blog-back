import router from '../../router/index';

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
			if (arr.some(e => e.name === 'dashboard')) {
				state.keepArr = arr
			} else {
				state.keepArr = [
					{
						name: 'dashboard',
						fullPath: "/dashboard",
						path: "/dashboard",
						meta: {
							title: '首页'
						}
					},
					...arr
				]
			}
		},
		closeKeep(state, item) {
			state.keepArr = state.keepArr.filter(e => {
				return e.meta.title !== item.meta.title
			})
			router.replace({ path: '/dashboard' })
		}
	},
	actions: {
	},
};