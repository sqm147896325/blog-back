import { defineStore } from 'pinia'

import router from '../../router/index'

// 递归算法对菜单路径进行正确连接
function recursiveMenu (value) {
  for (let index = 0; index < value.length; index++) {
    const item = value[index]
    if (typeof item.children === 'undefined') {
      // 没有子集了
      continue
    }
    for (let index2 = 0; index2 < item.children.length; index2++) {
      // 拼接路径
      item.children[index2].path = item.path + '/' + item.children[index2].path
    }
    if (item.path === '') {
      // 首页的特殊处理逻辑
      item.path = '/dashboard'
    }
    // 递归调用
    item.children = recursiveMenu(item.children)
  }
  return value
};

// 遍历剔除不需要显示的路由
let routes = router.options.routes.filter(e => {
  if (e.meta && e.meta.show === false) {
    return false
  }
  return true
})

// 递归路径拼接
routes = recursiveMenu(routes)

const useAsideStore = defineStore('aside', {
  namespaced: true,
  state: () => ({
    asideClose: true, // 控制侧边栏的展开折叠，true折叠，false展开
    activeMenu: {}, // 默认活动的菜单
    menu: routes // 侧边栏菜单显示所需要的数据
  }),
  actions: {
    // 控制侧边栏开启关闭
    setOpen (open) {
      this.asideClose = open
    },
    // 设置默认激活的侧边栏菜单项
    setActiveMenu (activeMenu) {
      if (!activeMenu.fullPath) {
        activeMenu.fullPath = activeMenu.path
      }
      this.activeMenu = activeMenu || {}
    },
    // 侧边栏菜单信息设置
    setMenu (menu) {
      this.menu = menu
    }
  }
})

export default useAsideStore
