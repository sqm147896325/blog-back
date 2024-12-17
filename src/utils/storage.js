const localStorageKey = {
  token: 'ls_back_token',
  userInfo: 'ls_back_userInfo',
  theme: 'ls_back_theme',
  firstData: 'ls_back_firstData'
}

// token
export const getToken = () => {
  return localStorage.getItem(localStorageKey.token)
}
export const setToken = (token) => {
  localStorage.setItem(localStorageKey.token, token)
}
export const removeToken = () => {
  localStorage.removeItem(localStorageKey.token)
}

// userInfo
export const getUserInfo = () => {
  return JSON.parse(localStorage.getItem(localStorageKey.userInfo))
}
export const setUserInfo = (userInfo) => {
  localStorage.setItem(localStorageKey.userInfo, JSON.stringify(userInfo))
}
export const removeUserInfo = () => {
  localStorage.removeItem(localStorageKey.userInfo)
}

// theme
export const getTheme = () => {
  return localStorage.getItem(localStorageKey.theme)
}
export const setTheme = (theme) => {
  localStorage.setItem(localStorageKey.theme, theme)
}
export const removeTheme = () => {
  localStorage.removeItem(localStorageKey.theme)
}

// firstData
const firstProps = {
  enterSys: {
    type: Boolean,
    default: true,
    comments: '首次进入系统'
  }
}
export const getFirstData = () => {
  let item = JSON.parse(localStorage.getItem(localStorageKey.firstData))
  if (!item) {
    // 没有缓存，则设置默认值
    setFirstData({})
    item = JSON.parse(localStorage.getItem(localStorageKey.firstData))
  }
  return item
}
export const setFirstData = (firstData) => {
  const setObj = {} // 存入storage的数据
  Object.keys(firstProps).forEach(e => {
    if (firstProps[e].type && firstData[e] !== undefined && typeof firstData[e] !== typeof firstProps[e].type()) {
      throw new Error(`${e}类型错误`) // 赋值类型错误，报错阻断所有赋值
    }
    if (firstData[e] === undefined) {
      setObj[e] = firstProps[e].default
    } else {
      setObj[e] = firstData[e]
    }
  })
  localStorage.setItem(localStorageKey.firstData, JSON.stringify(setObj))
}
export const removeFirstData = () => {
  localStorage.removeItem(localStorageKey.firstData)
}
