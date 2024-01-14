<template>
  <div class="tag-content">
    <el-tag
      v-for="tag in keepArr"
      :key="tag.name"
      :closable="tag.meta.title !== '首页'"
      :disable-transitions="false"
      :hit="false"
      :effect="activeMenu.fullPath === tag.fullPath ? 'dark' : 'plain'"
      @click="handleClick(tag)"
      @close="handleClose(tag)"
    >
      {{ tag.meta.title }}
    </el-tag>
    <el-input
      v-if="inputVisible"
      ref="saveTagInput"
      v-model="inputValue"
      class="input-new-tag"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <el-button
      v-else
      class="button-new-tag"
      @click="showInput"
    >
      + 新页签
    </el-button>
  </div>
</template>

<script>
import { mapState, mapStores } from 'pinia'
import aliveStore from '@/store/modules/alive.js'
import asideStore from '@/store/modules/aside.js'

export default {
  name: 'HeadTag',
  data () {
    return {
      inputVisible: false,
      inputValue: ''
    }
  },
  computed: {
    // ...mapGetters('alive', ['keepTitle']),
    ...mapState(aliveStore, ['keepArr']),
    ...mapState(asideStore, ['activeMenu']),
    ...mapStores(aliveStore, asideStore)
  },
  mounted () {
  },
  methods: {
    // 关闭页签
    handleClose (tag) {
      if (tag.fullPath === this.activeMenu.fullPath) {
        // 返回首页
        this.aliveStore.closeToHome(tag)
      } else {
        // 不返回首页
        this.aliveStore.closeKeep(tag)
      }
    },

    // 点击页签
    handleClick (tag) {
      this.$router.push({ path: tag.fullPath })
    },

    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm () {
      const inputValue = this.inputValue
      if (inputValue) {
        // 这里回车确认可能触发两次，判断是否有值阻止第二次
        this.$message.info('开发中')
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>

<style lang="less" scoped>
.tag-content{
    display: flex;
    align-items: center;
    cursor: pointer;
}
.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 24px;
    line-height: 24px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;

    margin-left: 10px;
    vertical-align: bottom;
}
::v-deep(.el-input--mini .el-input__inner) {
    height: 23px;
    line-height: 23px;
}
</style>
