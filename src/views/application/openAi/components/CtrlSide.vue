<template>
  <div
    class="ai-ctrl"
    :class="arrowFlag ? '' : 'ai-ctrl-hidden'"
  >
    <el-icon
      class="arrow-icon"
      @click="setArrow"
    >
      <CaretLeft v-if="arrowFlag" />
      <CaretRight v-else />
    </el-icon>

    <!-- 新建对话 -->
    <div
      v-show="arrowFlag"
      class="new-item"
      @click="newConversation"
    >
      <el-icon>
        <Plus />
      </el-icon>
      <span class="text">新建</span>
    </div>

    <!-- 对话列表 -->
    <div
      v-show="arrowFlag"
      class="conversation-list"
    >
      <div
        v-for="item in list"
        :key="item.uuid"
        class="list-item"
        :class="item.uuid === ($route.query.uuid || '') ? 'active-item' : ''"
        @click="changeConversation(item)"
      >
        <span class="item-text">{{ item.uuid }}</span>
        <el-icon
          class="del-icon"
          @click.stop="del(item)"
        >
          <Delete />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script>
import { conversationList, conversationDelete } from '@/api/conversation.js'

export default {
  name: 'CtrlSide',

  data () {
    return {
      arrowFlag: false, // 展开标志 true 展开，false 关闭
      query: {
        query: '',
        key: ''
      },
      list: []
    }
  },

  watch: {
    '$route.query.type' (newValue) {
      if (newValue === 'new') {
        this.search()
      }
    }
  },

  mounted () {
    this.search()
  },

  methods: {
    // 搜索
    async search () {
      const { dataInfo } = await conversationList(this.query)
      this.list = dataInfo.rows
    },

    // 新建对话
    newConversation () {
      this.$router.replace({ name: 'openAi', query: { } })
    },

    // 切换对话
    changeConversation (row) {
      if (row.uuid !== (this.$route.query.uuid || '')) {
        // 不是当前对话则执行切换
        this.$router.replace({ name: 'openAi', query: { uuid: row.uuid } })
      }
    },

    // 删除
    del (row) {
      const msg = `删除${row.uuid}`
      this.$confirm(`是否${msg}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await conversationDelete({ uuid: row.uuid })
        if (row.uuid === (this.$route.query.uuid || '')) {
          this.$router.replace({ name: 'openAi', query: { } })
        }
        await this.search()
      }).catch((err) => {
        console.log(err)
      })
    },

    // 侧边栏显示/隐藏
    setArrow () {
      this.arrowFlag = !this.arrowFlag
    }
  }
}
</script>

<style lang="less" scoped>
.ai-ctrl{
  height: calc(100vh - 45px);
  position: relative;
  color: #fff;
  background-color: #3e3e3e;
  width: 180px;
  margin-right: 10px;
  padding: 20px 10px;
  border-radius: 5px;
  font-size: 1.2rem;
  box-sizing: border-box;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  .arrow-icon{
    font-size: 1.6rem;
    color: #fff;
    background-color: #3e3e3e;
    position: absolute;
    top: calc(50% - 20px - 0.8rem);
    right: -10px;
    border-radius: 5px;
    padding: 20px 0;
  }
}

.ai-ctrl-hidden{
  background-color: transparent;
  width: 0px;
  padding: 20px 0px;
}

.new-item{
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 10px;
  margin: 10px 0;
  border-radius: 10px;
  transition: all 0.3s;
  cursor: pointer;
  box-shadow: 1px 1px 5px #1a1a1a;
  overflow: hidden;
  .text{
    margin: 0 10px;
  }
}

.conversation-list{
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar{
    width: 0px;
  }
  .list-item{
    padding: 5px 10px;
    margin: 10px 0;
    border-radius: 10px;
    display: flex;
    align-items: center;
    transition: all 0.3s;
    cursor: pointer;
    .item-text{
      margin-right: 5px;
      flex: 1;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
      white-space: nowrap;
    }
    .del-icon{
      display: none;
    }
  }

  .active-item, .list-item:hover{
    background-color: #1a1a1a;
    box-shadow: 1px 1px 5px #2a2a2a;
    .del-icon{
      display: block;
    }
  }
}
</style>
