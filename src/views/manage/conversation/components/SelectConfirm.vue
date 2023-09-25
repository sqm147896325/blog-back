<template>
  <div>
    <el-select
      v-model="selectValue"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'SelectConfirm',
  data () {
    return {
      selectValue: '',
      options: [
        { value: 'ai', label: 'Ai助手' }
      ]
    }
  },
  mounted () {
    this.selectValue = this.options[0]?.value || ''
    this.$emit('select', this.selectValue)
  },
  destroyed () {
    // $msgbox 中 作为vnode使用不走destroyed
  },
  methods: {
  }
}
</script>
