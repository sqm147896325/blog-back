const { defineConfig } = require('cypress')

// 根据环境变量选择合适的配置
const env = process.env.NODE_ENV || 'development'
let config

if (env === 'beta') {
  config = {
    visitUrl: 'https://sunqm.com/page/back',
    apiUrl: 'https://sunqm.com/api'
  }
} else {
  config = {
    visitUrl: 'http://localhost:3000/page/back',
    apiUrl: 'http://localhost:3000/api'
  }
}

module.exports = defineConfig({

  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite'
    }
  },

  e2e: {
    setupNodeEvents (on, config) {
      // implement node event listeners here
    }
  },

  targetEnv: 'beta',
  env: config
})
