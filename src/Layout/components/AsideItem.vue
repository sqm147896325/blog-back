<template>
  <div>
    <div
      v-for="item in routesMenu"
      :key="item.name"
      class="aside-item"
    >
      <el-menu-item
        v-if="typeof item.children == 'undefined'"
        :index="setPath(item).path"
        @click="chooseMenu(item)"
      >
        <i :class="item.icon || 'el-icon-menu'" />
        <span slot="title">{{ item.meta.title }}</span>
      </el-menu-item>
      <el-menu-item
        v-else-if="item.children.length == 1"
        :index="setPath(item).path"
        @click="chooseMenu(item.children[0])"
      >
        <i :class="item.children[0].icon || 'el-icon-menu'" />
        <span slot="title">{{ item.children[0].meta.title }}</span>
      </el-menu-item>
      <el-submenu
        v-else
        :index="item.name"
        @click="chooseMenu(item)"
      >
        <template #title>
          <i :class="item.icon || 'el-icon-menu'" />
          <span slot="title">{{ item.meta.title }}</span>
        </template>
        <aside-item :item-menu="item.children" />
      </el-submenu>
    </div>
  </div>
</template>

<script>

export default {
  // 递归调用AsideItem组件完成菜单的创建,组件递归调用自己时仅需要name
  name: 'AsideItem',
  props: {
    itemMenu: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      // 要在侧边栏渲染出的菜单
      routesMenu: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (this.itemMenu.length === 0) {
        // 初始时，根据vuex中存储的菜单信息生成目录
        this.routesMenu = this.$store.state.aside.menu
        // 根据权限信息筛选去除
        this.routesMenu = this.routesMenu.filter(e => {
          if (this.$store.state.user.userInfo.power?.includes(e.name) || e.name === 'dashboard') {
            return true
          } else {
            return false
          }
        })
      } else {
        // 递归调用时，使用递归的props进行生成
        this.routesMenu = this.itemMenu
        // 根据权限信息筛选去除
        this.routesMenu = this.routesMenu.filter(e => {
          if (this.$store.state.user.userInfo.power?.includes(e.name)) {
            return true
          } else {
            return false
          }
        })
      }
    },
    setPath (item) {
      let path = item.path
      if (item.meta && item.meta.defaultPath) {
        // 如果有菜单默认路径，按照默认路径跳转
        path = item.meta.defaultPath
      }
      if (item.meta && item.meta.newPage) {
        // 如果有打开新页面标志，则打开新页面;防止当前页直接打开
        path = ''
      }
      item.path = path
      return item
    },
    // 选择菜单子项时的点击事件
    chooseMenu (item) {
      if (item.meta && item.meta.newPage) {
        // 如果有打开新页面标志，则打开新页面
        window.open(item.meta.newPage)
      }
      item = this.setPath(item)
      this.$store.commit('aside/setActiveMenu', item)
    }
  }
}
</script>

<style lang="less" scoped>
/**
* 这里将element菜单组件单独提出使用会导致收起时样式不正常,
* 这里自定义收起样式解决该问题
*/
.el-menu.el-menu--collapse .el-submenu__title span{
  display: none;
}
</style>
