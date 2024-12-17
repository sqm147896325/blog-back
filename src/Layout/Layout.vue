<template>
  <div class="Layout">
    <el-container>
      <l-aside
        v-if="!fullScreen"
        id="test"
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
import { getFirstData, setFirstData } from '@/utils/storage'

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
    setTimeout(() => {
      if (this.$route.name === 'dashboard') {
        const firstData = getFirstData()
        if (firstData.enterSys !== true) {
          return false
        }
        const driverObj = this.$driver({
          className: 'driver-class',
          showProgress: true,
          doneBtnText: '完成',
          closeBtnText: '关闭',
          nextBtnText: '下一步',
          prevBtnText: '上一步',
          progressText: '{{current}} / {{total}}',
          steps: [
            {
              element: '#test',
              popover: {
                title: '菜单切换',
                description: '你可以在侧边栏进行菜单切换',
                position: 'left'
              }
            },
            { popover: { title: '教程完成🎉🎉🎉', description: '恭喜，你已经掌握了基础功能，开始愉快的使用吧！' } }
          ],
          onNextClick: () => {
            driverObj.moveNext()
          },
          onPrevClick: () => {
            driverObj.movePrevious()
          },
          onCloseClick: () => {},
          // onDestroyStarted: () => {
          //   driverObj.destroy()
          // },
          onDestroyed: () => {
            firstData.enterSys = false
            setFirstData(firstData)
          }
        })
        driverObj.drive()
      }
    }, 1000)
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
