<template>
  <div class="open-ai">
    <div class="ai-content">
      <div ref="list" class="messages-content">
        <div
          v-for="(item, index) in messages"
          :key="index"
          :class="item.role === 'user' ? 'user-msg' : 'other-msg'"
        >
          <div class="msg-item">
            <!-- eslint-disable vue/no-v-html -->
            <span class="item-text" v-html="toMarked(item.content)" />
            <!--eslint-enable-->
          </div>
        </div>
      </div>
      <el-input
        v-model="msg"
        v-loading.lock="fullscreenLoading"
        class="input"
        type="textarea"
        :rows="3"
        placeholder="输入内容，回车键发送！"
        @keydown.enter="send"
      />
    </div>
  </div>
</template>

<script>
import { marked } from 'marked'
import { conversation, getConversationHistory } from '@/api/openai.js'
import { mapState } from 'pinia'
import useUserStore from '@/store/modules/user.js'

export default {
  name: 'OpenAi',
  data () {
    return {
      msg: '', // 当前消息
      messages: [], // 消息列表
      fullscreenLoading: false, // 是否全屏loading
      uuid: '' // 当前对话uuid
    }
  },
  computed: {
    ...mapState(useUserStore, ['userInfo'])
  },
  mounted () {
    this.uuid = this.$route.query.uuid || ''
    getConversationHistory({
      uuid: this.uuid
    }).then(e => {
      this.messages = e.dataInfo
      this.toBottom()
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
        message: this.msg,
        uuid: this.uuid
      }).finally(() => {
        this.fullscreenLoading = false
        this.msg = '' // 清除消息
      })

      if (!this.uuid) {
        this.uuid = res.dataInfo.uuid
        this.$router.replace({ name: 'openAi', query: { uuid: res.dataInfo.uuid } })
      }

      this.messages.push({
        role: 'assistant',
        content: res.dataInfo.result || ''
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
    .item-text{
      display: inline-flex;
      flex-direction: column;
    }
  }
  .user-msg{
    display: flex;
    align-items: center;
    margin: 10px 0 10px 20%;
    text-align: end;
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
    text-align: start;
    justify-content: flex-start;
    .msg-item{
      background-color: rgba(0, 0, 0, 0.72);
      color: #ffffff;
    }
  }
}
</style>
