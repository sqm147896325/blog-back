<template>
  <div class="header">
    <el-header
      height="40px"
      class="main"
    >
      <el-icon
        id="driver-step-1"
        @click="setOpen"
      >
        <Expand v-if="collapse()" />
        <Fold v-else />
      </el-icon>
      <el-breadcrumb
        class="breadcrumb"
        separator="/"
      >
        <el-breadcrumb-item to="/">
          首页
        </el-breadcrumb-item>
        <el-breadcrumb-item
          v-for="item in matched"
          :key="item.path"
          :to="item.path"
        >
          {{ item.meta.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>

      <div class="main-container">
        <div />

        <div class="main-left">
          <el-badge
            :hidden="!msgNum || msgVisible"
            :value="msgNum"
            :max="99"
            class="left-msg"
          >
            <el-icon
              id="driver-step-2"
              class="msg-icon"
              @click="msgOpen"
            >
              <component :is="msgNum ? 'ChatLineRound' : 'ChatRound'" />
            </el-icon>
          </el-badge>
          <el-dropdown
            id="driver-step-3"
            class="left-dropdown"
            @command="headMenu"
          >
            <span class="dropdown-head">
              <el-avatar
                shape="square"
                :size="32"
              > user </el-avatar>
              <el-icon>
                <ArrowDown />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="( item , index ) in option"
                  :key="index"
                  :command="item.value"
                >
                  {{ item.lable }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>

    <div class="tag-container">
      <HeadTag />
    </div>

    <Message
      v-model="msgVisible"
      class="messge-dialog"
      @close="msgVisible = false"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'
import aliveStore from '@/store/modules/alive.js'
import userStore from '@/store/modules/user.js'
import asideStore from '@/store/modules/aside.js'
import Message from '@/components/Message/Message.vue'
import HeadTag from '@/components/HeadTag/HeadTag.vue'

export default defineComponent({
  name: 'HeaderCom',
  components: {
    Message,
    HeadTag
  },
  data () {
    return {
      // 路由原型，存储路由父子级及重定向信息
      matched: [],
      //
      option: [
        { value: -1, lable: '登出' },
        { value: 1, lable: '个人中心' }
      ],
      msgNum: 0, // 消息条数
      msgVisible: false, // 消息组件是否开启
      msgArr: [] // 消息栈
    }
  },
  computed: {
    ...mapStores(aliveStore, asideStore, userStore)
  },
  watch: {
    // 监听路由
    $route () {
      this.routeChange()
    }
  },
  mounted () {
    this.init()
  },
  sockets: {
    // 客户端接收后台传输的socket事件
    msg: {
      res (data) {
      },
      '233' (data) {
        if (import.meta.env.NODE_ENV !== 'production') console.log('233', data)
        this.$msgTip('success', data)
      },
      '250' (data) {
        if (import.meta.env.NODE_ENV !== 'production') console.log('250', data)
        this.$msgTip('error', data, 0)
      },
      reconnect () {
        if (import.meta.env.NODE_ENV !== 'production') console.log('reconnect 重新连接')
        this.sokcet('msg', 'init') // 重新连接时重新发送init
      },
      disconnect () {
        if (import.meta.env.NODE_ENV !== 'production') console.log('断开连接')
      }
    }
  },
  methods: {
    init () {
      this.sokcet('msg', 'init')
      this.routeChange()
    },
    // 路由改变面包屑内容也应该相应改变
    routeChange () {
      // 剔除首页
      this.matched = this.$route.matched.filter(e => {
        return e.name !== 'dashboard'
      })
    },
    setOpen () {
      // 使vuex中侧边栏状态取反
      this.asideStore.setOpen(!this.asideStore.asideClose)
    },

    /* 获取store中状态 */
    // 侧边栏是否展开
    collapse () {
      return this.asideStore.asideClose
    },

    // 消息组件开启
    msgOpen () {
      this.msgVisible = true
    },

    // 头像菜单选项
    async headMenu (command) {
      switch (command) {
        // 登出操作
        case -1:
          await this.userStore.exitLogin()
          this.aliveStore.setKeepArr([])
          this.$message.success('退出成功')
          break
          // 个人中心
        case 1:
          this.$message.success('个人中心')
          break
        default:
          console.warn('[header] 意外的命令')
          break
      }
    }
  }
})
</script>

<style lang="less" scoped>
// header整体布局
.header{
  height: 70px;
}
// 页签栏位置
.tag-container{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 10px;
  height: 30px;
  border-bottom: solid 1px #e6e6e6;
}
.main{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 40px;
  position: relative;
  border-bottom: solid 1px #e6e6e6;

  // 面包屑位置
  .breadcrumb{
    margin-left: 10px;

  }

  .main-container{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 20px;
    flex: 1;

    .main-left{
      // position: absolute;
      // right: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      .left-msg{
        margin: 0 10px;
        .msg-icon{
          font-size: 20px;
        }
      }
      .dropdown-head{
        display: flex;
        align-items: center;
        padding: 10px;
        border-radius: 6px;
      }
    }
  }

}

.messge-dialog{
  min-width: 768px;
}
</style>
