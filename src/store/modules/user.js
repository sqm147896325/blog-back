export default {
    state: {
		userInfo: {},		// userInfo
	},
	mutations: {
		// 设置用户信息
		setUserInfo(state,userInfo){
			state.userInfo = userInfo;
		},
	},
	actions: {
	},
};