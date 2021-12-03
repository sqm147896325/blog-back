export default {
	namespaced:true,
    state: {
		userInfo: {},		// 用户信息
		isAdmin: false		// 是否超级管理员
	},
	mutations: {
		// 设置用户信息
		setUserInfo(state,userInfo){
			state.userInfo = userInfo;
			if(userInfo.power && userInfo.power.includes('用户管理')){
				// 这里读取用户权限，如果拥有用户管理这一权限，则视为超级管理员
				state.isAdmin = true;
			}else{
				// 置false
				state.isAdmin = false;
			}
		},
	},
	actions: {
	},
};