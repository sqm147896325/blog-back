import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import path from 'path';
export default defineConfig({
  build: {
    outDir: 'dist'
  },
  plugins: [
    createVuePlugin(),
  ],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_APP_BASE_URL,
        changeOrigin: true,
        pathRewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
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