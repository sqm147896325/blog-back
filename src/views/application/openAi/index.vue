<template>
  <div class="open-ai">
    <div class="ai-content">
      <div class="messages-content">
        <h3
          v-for="(item, index) in messages"
          :key="index"
        >
          <span>{{ item.role }}：</span>
          <!-- eslint-disable vue/no-v-html -->
          <span v-html="toMarked(item.content)" />
          <!--eslint-enable-->
        </h3>
      </div>
      <el-input
        v-model="msg"
        v-loading.fullscreen.lock="fullscreenLoading"
        class="input"
        type="textarea"
        :rows="3"
        placeholder="输入内容，回车键发送！"
        @keydown.enter.native="send"
      />
    </div>
  </div>
</template>

<script>
import { marked } from 'marked'
import { conversation, getConversationHistory } from '@/api/openai.js'
import { conversationList } from '@/api/conversation.js'
// conversationCreate, conversationDelete
import { mapState } from 'vuex'

export default {
  name: 'OpenAi',
  data () {
    return {
      msg: '', // 当前消息
      messages: [], // 消息列表
      fullscreenLoading: false // 是否全屏loading
    }
  },
  computed: {
    ...mapState('user', ['userInfo'])
  },
  mounted () {
    console.log('this.userInfo', this.userInfo)
    conversationList({
      userId: this.userInfo.id
    }).then(res => {
      console.log('res>>', res)
    })
    getConversationHistory({
      userId: this.userInfo.id
    }).then(e => {
      this.messages = e.dataInfo
    })
  },
  methods: {
    async send () {
      this.messages.push({
        role: 'user',
        content: this.msg
      })

      this.fullscreenLoading = true

      const res = await conversation({
        userId: this.userInfo.id,
        message: this.msg
      }).finally(() => {
        this.fullscreenLoading = false
        this.msg = '' // 清除消息
      })

      this.messages.push({
        role: 'assistant',
        content: res.dataInfo
      })
    },

    toMarked (e) {
      return marked.parse(e)
    }
  }
}
</script>

<style lang="less" scoped>
.open-ai{
  // min-height: calc(100vh - 115px);
  // padding: 0 20px;
  .ai-content{
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .input{
    padding: 10px 0;
  }
  .messages-content{
    padding: 10px;
    margin-bottom: 10px;
    background: #eee;
    overflow: auto;
    flex: 1;
  }
}
</style>
