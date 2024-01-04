import aside from './modules/aside' // 导入侧边栏状态模块
import user from './modules/user' // 导入用户信息模块
import app from './modules/app' // 导入app信息模块
import socket from './modules/socket' // 导入全局socket模块
import alive from './modules/alive' // 导入缓存控制模块
import theme from './modules/theme' // 导入全局主题模块

export default () => {
  const modules = {
    aside: aside(),
    user: user(),
    app: app(),
    socket: socket(),
    alive: alive(),
    theme: theme()
  }
  return {
    state: modules,
    ...modules
  }
}
