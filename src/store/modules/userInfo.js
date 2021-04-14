export default {
    state: {
		userInfo: {},		// userInfo
	},
	mutations: {
		// 控制侧边栏开启关闭
		setUserInfo(state,userInfo){
			state.userInfo = userInfo;
		},
	},
	actions: {
	},
};