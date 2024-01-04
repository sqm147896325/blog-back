<template>
  <div class="aside">
    <el-aside
      width="100%"
    >
      <el-menu
        :key="key"
        :default-active="defaultActive()"
        class="menu"
        :collapse="collapse()"
        :router="true"
        @open="handleOpen"
        @select="selectMenu"
      >
        <aside-item :item-menu="routesMenu" />
      </el-menu>
    </el-aside>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import AsideItem from './AsideItem.vue'

export default defineComponent({
  name: 'AsideCom',
  components: { AsideItem },
  data () {
    return {
      key: 0,
      routesMenu: []
    }
  },
  mounted () {
    this.routesMenu = this.$store.state.aside.menu
    // 根据权限信息筛选去除
    this.routesMenu = this.routesMenu.filter(e => {
      return this.$store.state.user.userInfo.power?.includes(e.name) || e.name === 'dashboard'
    })
  },
  methods: {
    // 打开菜单回调
    handleOpen (key, keyPath) {
    },
    // 关闭菜单回调
    handleClose (key, keyPath) {
    },

    /* store中的状态 */
    // 默认选中的菜单
    defaultActive () {
      return this.$store.state.aside.activeMenu.path
    },
    // 侧边栏是否展开
    collapse () {
      return this.$store.state.aside.asideClose
    },
    // 菜单激活回调
    selectMenu (index, indexPath) {
      if (!index) {
        // 如果 index 为空，判断为外部链接，不应该进行导航栏切换
        this.key++
      }
    }
  }
})
</script>

<style lang='less' scoped>
// 自定义侧边栏样式
::v-deep(.menu){
    height: 100vh;
    background: @bg-bar;
    color: @c-white;
    font-size: @fz-big;
    i{
        color: @c-black;
    }
    span{
        color: @c-black;
    }
    .el-menu-item.is-active{
        color: @c-black;
        span,i {
            font-weight: 1000;
        }
    }
    // 消除侧边栏聚焦颜色
    .el-menu-item:focus {
        background: rgba(0, 0, 0, 0);
    }
}
// 自定义展开时宽度
::v-deep(.el-menu):not(.el-menu--collapse){
    width: 200px;
}
// ::v-deep(.el-menu.el-menu--collapse .el-sub-menu__title span){
//   display: none;
// }
</style>
