import { defineStore } from 'pinia'
import { setTheme } from '@/utils/storage'

const changeStyle = (obj) => {
  for (const key in obj) {
    document
      .getElementsByTagName('body')[0]
      .style.setProperty(`--${key}`, obj[key])
  }
}

const useThemeStore = defineStore('theme', {
  namespaced: true,
  state: () => ({
    themes: {
      // default 需要与 var 中的回退值保持一致
      default: {
        bgMain: '#f3f3f3',
        bgBar: '#4e72b8',
        bgFill: '#9b95c9',
        bgOther: '#6f60aa',
        bgSpace: '#a1a3a6',
        cBlack: '#303133',
        cGray: '#606266',
        cWhite: '#FFFFFF',
        fzBigTitle: '56px',
        fzTitle: '36px',
        fzBig: '16px',
        fzNormal: '14px',
        fzSmall: '12px',
        fcSuccess: '#67C23A',
        fcWarning: '#E6A23C',
        fcDanger: '#F56C6C',
        fcInfo: '#909399'
      },
      dark: {},
      light: {}
    }
  }),
  actions: {
    setTheme (themeName) {
      setTheme(themeName) // 保存主题到本地，下次进入使用该主题
      const themeConfig = this.themes[themeName]
      // 如果有主题名称，那么则采用我们定义的主题
      if (themeConfig) {
        Object.keys(e => {
          localStorage.setItem(e, themeConfig[e]) // 保存主题色到本地
        })
        changeStyle(themeConfig) // 改变样式
      } else {
        let themeConfig = {}
        Object.keys(e => {
          themeConfig = localStorage.getItem(e) // 保存主题色到本地
        })
        changeStyle(themeConfig)
      }
    }
  }
})

export default useThemeStore
