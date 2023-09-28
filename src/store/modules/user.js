import router from '../../router/index'
import { exit } from '@/api/user.js'

export default {
  namespaced: true,
  state: {
    userInfo: {}, // 用户信息
    isAdmin: false // 是否超级管理员
  },
  mutations: {
    // 设置用户信息
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
      if (userInfo.power && userInfo.power.includes('user')) {
        // 这里读取用户权限，如果拥有用户管理这一权限，则视为超级管理员
        state.isAdmin = true
      } else {
        // 置false
        state.isAdmin = false
      }
    }
  },
  actions: {
    // 退出登录，手动使token失效
    exitLogin (context) {
      return new Promise(resolve => {
        exit().finally(() => {
          context.dispatch('user/exitTo', {}, { root: true })
        })
        resolve()
      })
    },

    // 退出跳转到对应路由
    exitTo (context) {
      localStorage.removeItem('token')
      router.replace({
        name: 'login',
        query: {
          redirect: router.currentRoute.fullPath
        }
      })
      context.commit('alive/setKeepArr', [], { root: true })
    }
  }
}
