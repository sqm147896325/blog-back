import { Message } from 'element-ui'
import router from './router'
import store from './store'

// token验证
router.beforeEach((to, from, next) => {
  // 传入活动的菜单栏
  store.commit('aside/setActiveMenu', to.path)

  const token = localStorage.getItem('token')
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  // token有无跳转逻辑
  if (token && userInfo) {
    // 有token不能访问login
    if (to.path === '/login') {
      next({ path: '/' })
      Message.warning('已经登录')
    } else {
      /** 不需要校验token真伪与是否过期，
      * 在发送request请求时如果token出现问题，
      * 直接清除浏览器中的token并刷新页面即可
      * 登出同理
      */
      // todo 路径跳转时读取localStorage中的用户信息，这里应该监听关闭与初始化该页面进行数据持久化操作
      store.commit('user/setUserInfo', userInfo)

      // 跳转前
      let keepArr = [...store.state.alive.keepArr]
      if (!keepArr.some(e => e.fullPath === to.fullPath)) {
        keepArr = [...keepArr, to]
      }
      store.commit('alive/setKeepArr', keepArr)

      // 正常跳转
      next()
    }
  } else {
    // 如果没有token
    if (to.path !== '/login') {
      // 没有token必须重定向到login页
      Message.warning('未登录状态')
      next({ path: '/login' })
    } else {
      // 防止login也重复跳转
      next()
    }
  }
})

// 鉴权
router.beforeEach((to, from, next) => {
  const power = store.state.user.userInfo.power // 获取该账号拥有的权限
  const whiteList = router.options.whiteList
  // 白名单中直接访问
  if (whiteList.includes(to.name)) {
    next()
    return true
  }
  // 拥有权限可以访问
  if (power && power.includes(to.name)) {
    next()
    return true
  }
  // 访问首页直接访问
  if (to.name === 'dashboard') {
    next()
    return true
  }
  next('/dashboard')
})
