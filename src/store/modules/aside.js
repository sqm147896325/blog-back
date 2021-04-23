import router from '../../router/index';

// 递归算法对菜单路径进行正确连接
function recursiveMenu(value) {
	 
	for (let index = 0; index < value.length; index++) {
		if(typeof value[index].children == 'undefined'){
			// 没有子集了
			continue;
		}
		
		for (let index2 = 0; index2 < value[index].children.length; index2++) {
			// 拼接路径
			value[index].children[index2].path = value[index].path + '/' + value[index].children[index2].path;
			// 递归调用
			recursiveMenu(value[index].children[index2]);
		}
	}
	return value;
};

// 遍历剔除不需要显示的路由
let routes = router.options.routes.filter(e => {
	return e.show != false;
});

// 递归路径拼接
routes = recursiveMenu(routes);

export default {
    state: {
		asideClose: true,		// 控制侧边栏的展开折叠，true折叠，false展开
		activeMenu: '',			// 默认活动的菜单
		menu: routes			// 侧边栏菜单显示所需要的数据
	},
	mutations: {
		// 控制侧边栏开启关闭
		setOpen(state,open){
			state.asideClose = open;
		},
		// 设置默认激活的侧边栏菜单项
		setActiveMenu(state,activeMenu){
			state.activeMenu = activeMenu;
		},
		// 侧边栏菜单信息设置
		setMenu(state,menu){
			state.menu = menu;
		}
	},
	actions: {
	},
};