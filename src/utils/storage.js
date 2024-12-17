const localStorageKey = {
  token: 'token',
  userInfo: 'userInfo'
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
  return localStorage.getItem('theme')
}
export const setTheme = (theme) => {
  localStorage.setItem('theme', theme)
}
export const removeTheme = () => {
  localStorage.removeItem('theme')
}
