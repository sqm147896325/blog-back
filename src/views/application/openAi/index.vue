<template>
  <div class="open-ai">
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
</template>

<script>
import { marked } from 'marked'
import { converse, getConversationHistory } from '@/api/openai.js'
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
    getConversationHistory({
      userId: this.userInfo.id
    }).then(e => {
      this.messages = e.conversationHistory
    })
  },
  methods: {
    async send () {
      this.messages.push({
        role: 'user',
        content: this.msg
      })

      this.fullscreenLoading = true

      const res = await converse({
        userId: this.userInfo.id,
        message: this.msg
      }).finally(() => {
        this.fullscreenLoading = false
      })

      this.messages.push({
        role: 'assistant',
        content: res.reply
      })

      this.msg = '' // 清除消息
    },

    toMarked (e) {
      return marked.parse(e)
    }
  }
}
</script>

<style lang="less" scoped>
.open-ai{
  display: flex;
  min-height: calc(100vh - 115px);
  flex-direction: column;
  padding: 0 20px;
  .input{
    padding: 10px 0;
    width: 100%;
  }
  .messages-content{
    padding: 10px;
    margin-bottom: 10px;
    height: 50vh;
    background: #eee;
    overflow: auto;
  }
}
</style>
