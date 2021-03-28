import { Message } from 'element-ui';
import router from './router';
import store from './store';

// token验证
router.beforeEach(async (to,from,next) => {
	// 传入活动的菜单栏
	await store.commit('setActiveMenu',to.path);
	
	let token = sessionStorage.getItem('token');
	// token有无跳转逻辑
	if(token){
		// 有token不能访问login
		if (to.path === '/login'){
			next({ path: '/' });
			Message.warning('已经登录');
		}else{
			/** 不需要校验token真伪与是否过期，
			* 在发送request请求时如果token出现问题，
			* 直接清除浏览器中的token并刷新页面即可
			* 登出同理
			*/ 
			// 正常跳转
			next();
		}
	}else{
		// 如果没有token
		if (to.path !== '/login'){
			// 没有token必须重定向到login页
			next({ path: '/login' });
		}else{
			// 防止login也重复跳转
			next();
		}
	}	
})