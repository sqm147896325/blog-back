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
 * 自定义字段：
 * show	标志是否在aside侧边栏展示，false时不显示，true或省缺时显示
 * 
 */

// ! 不要用name字段表示名称，而要在meta中定义这些额外的信息

// 无需权限的路由
const constantRoutes = [
	{
		path: '/login',
		name: 'login',
		show: false,
		component: () => import('../views/main/login.vue')
	},
	{
		path: '/404',
		name: '404',
		show: false,
		component: () => import('../views/main/404.vue')
	}
]

// 权限路由，显示在菜单栏中
const powerShowRouter = [
	{
		path: '',
		name: '首页',
		icon: 'el-icon-s-home',
		component: Layout,
		redirect: '/dashboard',
		children: [{
			path: 'dashboard',
			name: '首页',
			icon: 'el-icon-s-home',
			component: () => import('../views/main/dashboard.vue')
		}]
	},
	{
		path: '/application',
		name: '应用',
		icon: 'el-icon-menu',
		component: Layout,
		redirect: '/application/appList',
		children: [{
			path: 'appList',
			name: '应用列表',
			icon: 'el-icon-help',
			component: () => import('../views/application/appList.vue')
		},{
			path: 'apiDoc',
			name: '接口文档',
			icon: 'el-icon-document',
			component: () => import('../views/application/apiDoc/apiDoc.vue')
		},{
			path: 'networkDisk',
			name: '网盘',
			icon: 'el-icon-upload',
			component: () => import('../views/application/networkDisk/networkDisk.vue')
		}]
	},
	{
		path: '/manage',
		name: '管理',
		icon: 'el-icon-setting',
		component: Layout,
		redirect: '/manage/blog',
		children: [{
			path: 'blog',
			name: '博客管理',
			icon: 'el-icon-notebook-1',
			component: () => import('../views/blog/blog.vue')
		},
		{
			path: 'user',
			name: '用户管理',
			icon: 'el-icon-user',
			component: () => import('../views/user/user.vue')
		}]
	}
]

// 权限附属路由，不显示在菜单栏中
const powerHideRouter = [
	{
		path: '/edit',
		name: '编辑',
		show: false,
		component: Layout,
		redirect: '/manage/blog',
		children: [
			{
				path: ':id',
				name: '博客编辑',
				component: () => import('../views/blog/edit.vue')
			}
		]
	},
	

	// 404页一定要放在最后
	{ path: '/*', name: '404', show: false, redirect: '/404' }
];

// 鉴权白名单
const whiteList = [ 'login' , '404' , '博客编辑' ];

const router = new VueRouter({
	mode: 'history',
	// base: process.env.BASE_URL,
	routes: [...constantRoutes,...powerShowRouter,...powerHideRouter],
	whiteList
})

export default router
