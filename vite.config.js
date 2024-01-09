/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import viteBuild from './plugins/viteBuild'

// 根据环境变量加载环境变量文件
try {
  const file = dotenv.parse(fs.readFileSync(`.env.${process.env.NODE_ENV}`))
  // 根据获取的key给对应的环境变量赋值
  for (const key in file) {
    process.env[key] = file[key]
  }
} catch (e) {
  console.error('环境加载失败', e)
}

export default defineConfig({
  base: process.env.VITE_APP_ROUTE_PATH,
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV !== 'production' ? true : 'hidden'
  },
  plugins: [
    vue(),
    viteBuild()
  ],
  server: {
    // 是否自动打开浏览器
    open: false,
    // 服务器主机名，如果允许外部访问，可设置为"0.0.0.0"
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_APP_BASE_URL,
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/comapp': {
        target: 'http://localhost:3010/comapp/', // 子应用静态资源需要代理，否则父应用无法找到
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/comapp/, '')
      },
      '/socket.io': {
        target: process.env.VITE_SOCKET_URL, // socket.io 对应配置
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/socket.io/, '')
      }
    }
  },
  // // 预构建
  // optimizeDeps: {
  //   include: ['socket.io-client'],
  // },
  // 配置别名@，如果没有配置需要手动更改组件位置为src
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src')
      }
    ]
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: '@import "./src/style/variables.less";@import "./src/style/reset.less";'
      }
    }
  },

  test: {
    globals: true,
    environment: 'jsdom',

    browser: {
      enabled: true,
      name: 'chrome'
    }
  }
})
