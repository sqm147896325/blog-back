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
  emits: ['select'],
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
  methods: {
  }
}
</script>
