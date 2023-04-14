<template>
  <div>
    <!-- vite 子应用需要关闭沙箱 disableSandbox, 使用 inline 内联script模式 -->
    <micro-app
      name="comapp"
      url="http://localhost:3010/comapp/"
      disable-sandbox
      inline
      @error="error"
    />
  </div>
</template>

<script>
export default {
  name: 'ComApp',
  methods: {
    error () {
      this.$message.error('未连接到子模块')
    }
  }
}
</script>

<style>

</style>
