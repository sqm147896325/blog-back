<template>
  <div class="Layout">
    <el-container>
      <l-aside
        v-if="!fullScreen"
      />
      <el-container
        class="container"
        direction="vertical"
      >
        <l-header v-if="!fullScreen" />
        <el-main>
          <transition
            name="fade"
            mode="out-in"
          >
            <keep-alive :include="keepName">
              <router-view :class="fullScreen ? 'view full-screen-view' : 'view'" />
            </keep-alive>
          </transition>
          <l-footer />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'
import { mapState } from 'pinia'
import useAliveStore from '@/store/modules/alive.js'

export default defineComponent({
  name: 'LayoutCom',
  components: {
    'l-aside': defineAsyncComponent(() => import('./components/Aside.vue')),
    'l-header': defineAsyncComponent(() => import('./components/Header.vue')),
    'l-footer': defineAsyncComponent(() => import('./components/Footer.vue'))
  },
  computed: {
    ...mapState(useAliveStore, ['keepTitle']),
    ...mapState(useAliveStore, ['keepName']),
    ...mapState(useAliveStore, ['keepArr']),
    fullScreen () {
      return this.$route.meta && this.$route.meta.fullScreen
    }
  },
  watch: {
    $route: function (to, from) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transition = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    }
  },
  mounted () {
  }
})
</script>

<style lang="less" scoped>
.Layout{
    min-width: 768px;
}
.container{
    height: 100vh;
}
.view{
    position: relative;
    min-height: calc(100vh - 115px);
    padding-bottom: 10px;
}
.full-screen-view{
    min-height: calc(100vh - 45px);
}
.fade-enter-active, .fade-leave-active {
    transition: opacity .2s;
}
.fade-enter, .fade-leave-to  {
    opacity: 0;
}
// 覆盖el-main样式
.el-main{
    padding: 0 10px;
    margin-top: 9px;
    overflow-x: hidden;
}
</style>
