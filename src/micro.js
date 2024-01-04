// 导入微前端
import microApp from '@micro-zoe/micro-app'

// 兼容vite的私有化配置
microApp.start({
  plugins: {
    modules: {
      comapp: [
        {
          loader (code) {
            if (['development'].includes(process.env.NODE_ENV)) {
              // 这里 basename 需要和子应用vite.config.js中base的配置保持一致
              code = code.replace(/(from|import)(\s*['"])(\/comapp\/)/g, all => {
                // 关于 import ... from ... 的替换
                return all.replace('/comapp/', 'http://localhost:3010/comapp/')
              }).replace(/(from|import)(\(['"])(\/comapp\/)/g, all => {
                // 关于 import() 的替换
                return all.replace('/comapp/', 'http://localhost:3010/comapp/')
              }).replace(/(\.\.\/)/g, all => {
                // 关于 @com 的替换
                return all.replace('../', 'http://localhost:3010/comapp/')
              })
            }
            return code
          }
        }
      ]
    }
  }
})
