<template>
  <div class="content">
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
import { Configuration, OpenAIApi } from 'openai'
import { marked } from 'marked'

export default {
  name: 'NoticeMsg',
  data () {
    return {
      msg: '',
      messages: [],
      openai: null,
      fullscreenLoading: false
    }
  },
  mounted () {
    // 初始化openai
    const configuration = new Configuration({
      apiKey: import.meta.env.VITE_APP_OPENAI_KEY
    })
    this.openai = new OpenAIApi(configuration)
  },
  methods: {
    async send () {
      this.messages.push({
        role: 'user',
        content: this.msg
      })

      this.fullscreenLoading = true

      const completion = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: this.messages
      }).finally(() => {
        this.fullscreenLoading = false
      })

      this.messages.push(completion.data.choices[0].message)

      this.msg = '' // 清除消息
    },

    toMarked (e) {
      return marked.parse(e)
    }
  }
}
</script>

<style lang="less" scoped>
.content{
  display: flex;
  height: 100%;
  flex-direction: column;
  padding: 0 20px;
  .input{
    padding: 10px 0;
    width: 100%;
  }
  .messages-content{
    padding: 10px 0;
    height: 100%;
    overflow: auto;
  }
}
</style>
