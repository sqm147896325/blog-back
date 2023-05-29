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
    <el-row>
      <el-col>
        <el-select
          v-model="selectModel"
          value-key="id"
          placeholder="请选择你要使用的模型"
        >
          <el-option
            v-for="item in modelList"
            :key="item.id"
            :label="item.id"
            :value="item.id"
          />
        </el-select>
      </el-col>
    </el-row>
    <el-input
      v-model="msg"
      v-loading.fullscreen.lock="fullscreenLoading"
      class="input"
      type="textarea"
      :rows="3"
      placeholder="输入内容，回车键发送！"
      @keydown.enter.native="send"
    />

    <el-table
      :data="modelList"
      border
      stripe
    >
      <el-table-column
        prop="permission"
        label="permission"
        type="expand"
        width="120"
      >
        <template slot-scope="scope">
          <el-table
            :data="scope.row.permission"
            border
            stripe
          >
            <el-table-column
              v-for="expandCol in Object.keys(scope.row.permission[0])"
              :key="expandCol"
              :prop="expandCol"
              :label="expandCol"
              :formatter="(row, column, cellValue) => cellValue + ''"
              width="160"
            />
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        v-for="col in Object.keys(modelList[0]).filter(e => e !== 'permission')"
        :key="col"
        :prop="col"
        :label="col"
        min-width="160"
        :width="['object', 'created', 'owned_by', 'parent'].includes(col) ? 120 : 'auto'"
      />
    </el-table>
  </div>
</template>

<script>
import { Configuration, OpenAIApi } from 'openai'
import { marked } from 'marked'

export default {
  name: 'OpenAi',
  data () {
    return {
      msg: '', // 当前消息
      messages: [], // 消息列表
      openai: null, // openai示例
      fullscreenLoading: false, // 是否全屏loading
      modelList: [{}], // 模型列表
      selectModel: 'gpt-3.5-turbo' // 选择的模型
    }
  },
  mounted () {
    // 初始化openai
    const configuration = new Configuration({
      apiKey: import.meta.env.VITE_APP_OPENAI_KEY
    })
    this.openai = new OpenAIApi(configuration)
    // 获取模型列表
    this.openai.listModels().then(res => {
      this.modelList = res.data.data
    })
  },
  methods: {
    async send () {
      this.messages.push({
        role: 'user',
        content: this.msg
      })

      this.fullscreenLoading = true

      const completion = await this.openai.createChatCompletion({
        model: this.selectModel,
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
