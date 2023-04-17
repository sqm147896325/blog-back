import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import viteZip from './src/utils/viteZip'

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
    sourcemap: process.env.NODE_ENV !== 'production'
  },
  plugins: [
    createVuePlugin(),
    viteZip()
  ],
  server: {
    // 是否自动打开浏览器
    open: true,
    // 服务器主机名，如果允许外部访问，可设置为"0.0.0.0"
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: process.env.VITE_APP_BASE_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
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
  }
})
