import Vue from 'vue'
import VueRouter from 'vue-router'

import Layout from '../Layout/Layout.vue'

Vue.use(VueRouter)

// 解决标题栏路由导航冗余报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

/** 路由说明
 * 
 * 两种路由：
 * constantRoutes静态路由，包含不需要layout布局的基本页
 * asyncRouter动态路由，使用layout布局
 * 
 * 自定义字段meta：
 *  show	标志是否在aside侧边栏展示，false时不显示，true或省缺时显示
 *  defaultPath 实际跳转和在地址栏上显示的字段，以取代path
 * 
 */

// ! 不要用name字段表示名称，而要在meta中定义这些额外的信息

// 无需权限的路由
const constantRoutes = [
	{
		path: '/login',
		name: 'login',
		component: () => import('../views/main/login.vue'),
		meta: {
			show: false
		}
	},
	{
		path: '/404',
		name: '404',
		component: () => import('../views/main/404.vue'),
		meta: {
			show: false
		}
	}
]

// 权限路由，显示在菜单栏中
const powerShowRouter = [
	{
		path: '',
		name: 'toDashboard',
		icon: 'el-icon-s-home',
		component: Layout,
		redirect: '/dashboard',
		children: [{
			path: 'dashboard',
			name: 'dashboard',
			icon: 'el-icon-s-home',
			component: () => import('../views/main/dashboard.vue')
		}]
	},
	{
		path: '/application',
		name: 'toAppList',
		icon: 'el-icon-menu',
		component: Layout,
		redirect: '/application/appList',
		children: [{
			path: 'appList',
			name: 'appList',
			icon: 'el-icon-help',
			component: () => import('../views/application/index.vue')
		},{
			path: 'apiDoc',
			name: 'apiDoc',
			icon: 'el-icon-document',
			component: () => import('../views/application/apiDoc/index.vue')
		},{
			path: 'networkDisk',
			name: 'networkDisk',
			icon: 'el-icon-upload',
			component: () => import('../views/application/networkDisk/index.vue')
		},{
			path: 'comapp/:page*',
			name: 'comapp',
			icon: 'el-icon-cherry',
			component: () => import('../views/application/comapp/index.vue'),
			meta: {
				defaultPath: '/application/comapp'
			}
		}]
	},
	{
		path: '/manage',
		name: 'toBlog',
		icon: 'el-icon-setting',
		component: Layout,
		redirect: '/manage/blog',
		children: [{
			path: 'blog',
			name: 'blog',
			icon: 'el-icon-notebook-1',
			component: () => import('../views/blog/blog.vue')
		},
		{
			path: 'user',
			name: 'user',
			icon: 'el-icon-user',
			component: () => import('../views/user/user.vue')
		}]
	}
]

// 权限附属路由，不显示在菜单栏中
const powerHideRouter = [
	{
		path: '/edit',
		name: 'toEdit',
		component: Layout,
		redirect: '/manage/blog',
		children: [
			{
				path: ':id',
				name: 'edit',
				component: () => import('../views/blog/edit.vue')
			}
		],
		meta: {
			show: false
		}
	},

	// 404页一定要放在最后
	{ path: '/*', name: '404', redirect: '/404', meta: { show: false } }
];

// 鉴权白名单
const whiteList = [ 'login' , '404' , 'edit' ];

const router = new VueRouter({
	mode: 'history',
	// base: process.env.BASE_URL,
	routes: [...constantRoutes,...powerShowRouter,...powerHideRouter],
	whiteList
})

export default router
