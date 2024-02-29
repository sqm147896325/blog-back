<template>
  <div class="open-ai">
    <CtrlSide class="ai-ctrl" />

    <div
      v-loading="loading"
      class="ai-content"
    >
      <!-- 内容列表 -->
      <div
        ref="list"
        class="messages-content"
      >
        <div
          v-for="(item, index) in messages"
          :key="index"
          :class="item.role === 'user' ? 'user-msg' : 'other-msg'"
        >
          <div class="msg-item">
            <!-- eslint-disable vue/no-v-html -->
            <span
              v-codeCopy
              class="item-text"
              v-html="toMarked(item.content)"
            />
            <!--eslint-enable-->
          </div>
        </div>
      </div>

      <!-- 输入框 -->
      <el-input
        v-model="msg"
        v-loading.lock="fullscreenLoading"
        class="input"
        type="textarea"
        :rows="3"
        placeholder="输入内容，Ctrl + 回车键发送！"
        @keydown="keydownSend"
      />
    </div>
  </div>
</template>

<script>
import { Marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/base16/darcula.css' // 注意引入样式，可以前往 node_module 下查看更多的样式主题
import { conversation, getConversationHistory } from '@/api/openai.js'
import { mapState } from 'pinia'
import useUserStore from '@/store/modules/user.js'
import CtrlSide from './components/CtrlSide.vue'

const marked = new Marked({
  // 开启异步渲染
  async: false,
  pedantic: false,
  gfm: true,
  mangle: false,
  headerIds: false,
  highlight (code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    const html = hljs.highlight(code, { language }).value
    return html
  }
})

export default {
  name: 'OpenAi',

  components: { CtrlSide },

  data () {
    return {
      msg: '', // 当前消息
      messages: [], // 消息列表
      fullscreenLoading: false, // 是否全屏loading
      uuid: '', // 当前对话uuid
      loading: false
    }
  },

  computed: {
    ...mapState(useUserStore, ['userInfo'])
  },

  watch: {
    '$route.query.uuid' (newValue) {
      this.init()
    }
  },

  mounted () {
    this.init()
  },

  methods: {
    // 初始化
    init () {
      this.uuid = this.$route.query.uuid || ''
      this.messages = []
      if (this.uuid) {
        this.loading = true
        getConversationHistory({
          uuid: this.uuid
        }).then(e => {
          this.messages = e.dataInfo
          this.toBottom()
        }).finally(() => {
          this.loading = false
        })
      }
    },

    // 快捷键发送
    keydownSend (e) {
      if (e.ctrlKey && e.keyCode === 13) {
        // ctrl + enter 进行发送
        this.send()
      }
    },

    // 发送消息
    async send () {
      this.messages.push({
        role: 'user',
        content: this.msg
      })

      this.fullscreenLoading = true

      const controller = new AbortController()

      const signal = controller.signal

      this.messages.push({
        role: 'assistant',
        content: ''
      })

      conversation({
        signal,
        body: JSON.stringify({
          userId: this.userInfo.id,
          message: this.msg,
          uuid: this.uuid
        }),
        // 建立连接的回调
        onopen: (open) => {
        },
        // 接收一次数据段时回调，因为是流式返回，所以这个回调会被调用多次
        onmessage: (msg) => {
          if (msg.event === 'header') {
            const headerParams = JSON.parse(msg.data)
            if (!this.uuid) {
              this.uuid = headerParams.uuid
              this.$router.replace({ name: 'openAi', query: { uuid: this.uuid, type: 'new' } })
            }
          } else if (msg.event === 'message') {
            const content = JSON.parse(msg.data)
            this.messages[this.messages.length - 1].content += content
          } else if (msg.event === 'close') {
            // close 进行关闭
            controller.abort()
          }
        },
        // 正常结束的回调
        onclose: () => {
          this.fullscreenLoading = false
          this.msg = '' // 清除消息
          controller.abort() // 关闭连接
        },
        // 连接出现异常回调
        onerror: (err) => {
          // 必须抛出错误才会停止
          console.log('err', err)
          this.fullscreenLoading = false
          this.msg = '' // 清除消息
          throw err
        }
      })

      this.toBottom()
    },

    toMarked (e) {
      return marked.parse(e)
    },

    // 控制到最底部
    toBottom () {
      const listDom = this.$refs.list
      this.$nextTick(() => {
        listDom.scrollTop = listDom.scrollHeight
      })
    }
  }
}
</script>

<style lang="less" scoped>
.open-ai{
  display: flex;
  height: calc(100vh - 45px);
  .ai-ctrl{
  }
  .ai-content{
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .input{
  }
}

.messages-content{
  padding: 10px;
  margin-bottom: 10px;
  background: #eee;
  overflow: auto;
  flex: 1;
  .msg-item{
    padding: 0px 20px;
    border-radius: 10px;
    font-size: @fz-normal;
    min-height: 40px;
    max-width: 100%;
    .item-text{
      display: inline-flex;
      flex-direction: column;
    }
  }
  .user-msg{
    display: flex;
    align-items: center;
    margin: 10px 0 10px 20%;
    justify-content: flex-end;
    .msg-item{
      background-color: rgba(0, 128, 0, 0.72);
      color: #fff;
    }
  }
  .other-msg{
    display: flex;
    align-items: center;
    margin: 10px 20% 10px 0;
    justify-content: flex-start;
    .msg-item{
      background-color: rgba(0, 0, 0, 0.72);
      color: #ffffff;
    }
  }
}
</style>
