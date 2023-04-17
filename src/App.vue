<template>
  <div id="app">
    <!--
      如果使用Layout组件则使用Layout中的router-view
      否则使用该页面的router-view
    -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
// 这里不能添加scoped，否则全局样式会出不去
</style>
