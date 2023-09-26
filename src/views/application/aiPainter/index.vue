<template>
  <div>
    <el-input
      v-model="prompt"
      v-loading.lock="loading"
      placeholder="请输入画作的英文描述"
      type="textarea"
      :rows="3"
      clearable
      @keydown.enter.native="send"
    />
    <div
      v-for="(item, index) in painterList"
      :key="index"
    >
      <el-image
        class="image-item"
        :src="item.url"
        :preview-src-list="painterList.map(e => e.url)"
      />
      <div class="image-item-text">
        {{ item.prompt }}
      </div>
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
.image-item{
    height: 200px;
    width: 200px;
    margin: 10px;
}
.image-item-text{
    width: 200px;
    margin: 10px;
}
</style>
