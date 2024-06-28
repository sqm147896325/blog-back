<template>
  <div>
    <el-input
      v-model="prompt"
      v-loading.lock="loading"
      placeholder="请输入画作的英文描述"
      type="textarea"
      :rows="3"
      clearable
      @keydown.enter.prevent="send"
    />
    <div class="images-list">
      <el-tooltip
        v-for="(item, index) in painterList"
        :key="index"
        :content="item.prompt"
      >
        <el-image
          class="item-img"
          :src="item.url"
          :preview-src-list="painterList.map(e => e.url)"
          :initial-index="index"
        />
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { painter } from '@/api/openai.js'

export default {
  name: 'AiPainter',
  data () {
    return {
      prompt: '',
      painterList: [],
      loading: false
    }
  },
  methods: {
    send () {
      this.loading = true
      painter({
        prompt: this.prompt
      }).then(res => {
        const painterList = res.dataInfo.map(e => {
          e.prompt = this.prompt
          return e
        })
        this.painterList.push(...painterList)
        this.prompt = ''
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.images-list{
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .item-img{
    padding: 4px;
    margin: 6px;
    height: 200px;
    width: 200px;
  }
}
</style>
