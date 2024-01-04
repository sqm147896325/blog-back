import { createRouter, createWebHistory } from 'vue-router'

import Layout from '../Layout/Layout.vue'

// // 解决标题栏路由导航冗余报错问题
// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push (location) {
//   return originalPush.call(this, location).catch(err => err)
// }

/** 路由说明
 *
 * 两种路由：
 * constantRoutes静态路由，包含不需要layout布局的基本页
 * asyncRouter动态路由，使用layout布局
 *
 * 自定义字段meta：
 *  show 标志是否在aside侧边栏展示，false时不显示，true或省缺时显示
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
      show: false,
      title: '登陆'
    }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/main/404.vue'),
    meta: {
      show: false,
      title: '404'
    }
  }
]

// 权限路由，显示在菜单栏中
const powerShowRouter = [
  {
    path: '',
    name: 'home',
    icon: 'HomeFilled',
    component: Layout,
    redirect: '/dashboard',
    meta: {
      title: '首页'
    },
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      icon: 'HomeFilled',
      component: () => import('../views/main/dashboard.vue'),
      meta: {
        title: '首页'
      }
    }]
  },
  {
    path: '/application',
    name: 'application',
    icon: 'Menu',
    component: Layout,
    redirect: '/application/appList',
    meta: {
      title: '应用'
    },
    children: [{
      path: 'appList',
      name: 'appList',
      icon: 'Help',
      component: () => import('../views/application/index.vue'),
      meta: {
        title: '应用列表'
      }
    }, {
      path: 'apiDoc',
      name: 'apiDoc',
      icon: 'Document',
      component: () => import('../views/application/apiDoc/index.vue'),
      meta: {
        title: '接口文档'
      }
    }, {
      path: 'openAi',
      name: 'openAi',
      icon: 'Coordinate',
      component: () => import('../views/application/openAi/index.vue'),
      meta: {
        title: 'Ai助手',
        fullScreen: true,
        newPage: `${location.origin}${import.meta.env.VITE_APP_ROUTE_PATH}/application/openAi`
      }
    }, {
      path: 'aiPainter',
      name: 'aiPainter',
      icon: 'PictureRounded',
      component: () => import('../views/application/aiPainter/index.vue'),
      meta: {
        title: 'Ai画师'
      }
    }, {
      path: 'networkDisk',
      name: 'networkDisk',
      icon: 'UploadFilled',
      component: () => import('../views/application/networkDisk/index.vue'),
      meta: {
        title: '网盘'
      }
    },
    {
      path: 'comapp/:page*',
      name: 'comapp',
      icon: 'Cherry',
      component: () => import('../views/application/comapp/index.vue'),
      meta: {
        defaultPath: '/application/comapp/#/', // 自定义地址栏与跳转地址
        title: '组件'
      }
    }]
  },
  {
    path: '/manage',
    name: 'manage',
    icon: 'Setting',
    component: Layout,
    redirect: '/manage/blog',
    meta: {
      title: '管理'
    },
    children: [{
      path: 'conversation',
      name: 'conversation',
      icon: 'ChatLineRound',
      component: () => import('../views/manage/conversation/index.vue'),
      meta: {
        title: '对话管理'
      }
    },
    {
      path: 'blog',
      name: 'blog',
      icon: 'Notebook',
      component: () => import('../views/manage/blog/index.vue'),
      meta: {
        title: '博客管理'
      }
    },
    {
      path: 'user',
      name: 'user',
      icon: 'User',
      component: () => import('../views/manage/user/index.vue'),
      meta: {
        title: '用户管理'
      }
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
        component: () => import('../views/manage/blog/edit.vue'),
        meta: {
          fullScreen: true
        }
      }
    ],
    meta: {
      show: false
    }
  },

  // 404页一定要放在最后
  { path: '/*', name: '404', redirect: '/404', meta: { show: false, title: '404' } }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_ROUTE_PATH), // 此时不能用 process.env
  routes: [...constantRoutes, ...powerShowRouter, ...powerHideRouter]
})

export default router
