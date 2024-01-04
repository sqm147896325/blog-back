import { defineStore } from 'pinia'
import router from '../../router/index'
import { exit } from '@/api/user.js'

const useUserStore = defineStore('user', {
  namespaced: true,
  state: () => ({
    userInfo: {}, // 用户信息
    isAdmin: false // 是否超级管理员
  }),
  actions: {
    // 设置用户信息
    setUserInfo (userInfo) {
      this.userInfo = userInfo
      if (userInfo.power && userInfo.power.includes('user')) {
        // 这里读取用户权限，如果拥有用户管理这一权限，则视为超级管理员
        this.isAdmin = true
      } else {
        // 置false
        this.isAdmin = false
      }
    },
    // 退出登录，手动使token失效
    exitLogin () {
      return new Promise(resolve => {
        exit().finally(() => {
          this.exitTo()
        })
        resolve()
      })
    },

    // 退出跳转到对应路由
    exitTo () {
      localStorage.removeItem('token')
      router.replace({
        name: 'login',
        query: {
          redirect: router?.query?.redirect || router.currentRoute.fullPath
        }
      })
    }
  }
})

export default useUserStore
