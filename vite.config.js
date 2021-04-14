import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import path from 'path';
export default defineConfig({
  plugins: [
    createVuePlugin(),
  ],
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
        additionalData: '@import "./src/style/variables.less";'
      }
    }
  }
})