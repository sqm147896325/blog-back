import { defineStore } from 'pinia'
import router from '../../router/index'

const useAliveStore = defineStore('alive', {
  namespaced: true,
  state: () => ({
    keepArr: [] // 保存缓存的路由对象
  }),
  getters: {
    // 保存缓存的路由的标题
    keepTitle: state => {
      return state.keepArr.map(e => {
        return e.meta.title
      })
    },
    // 保存缓存的路由的name
    keepName: state => {
      return state.keepArr.map(e => {
        return e.name
      })
    }
  },
  actions: {
    setKeepArr (arr) {
      if (arr.some(e => e.name === 'dashboard')) {
        this.keepArr = arr
      } else {
        this.keepArr = [
          {
            name: 'dashboard',
            fullPath: '/dashboard',
            path: '/dashboard',
            meta: {
              title: '首页'
            }
          },
          ...arr
        ]
      }
    },
    closeKeep (item) {
      this.keepArr = this.keepArr.filter(e => {
        return e.meta.title !== item.meta.title
      })
    },
    closeToHome (item) {
      this.closeKeep(item)
      router.replace({ path: '/dashboard' })
    }
  }
})

export default useAliveStore
