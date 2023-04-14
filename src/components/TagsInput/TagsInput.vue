<template>
  <el-select
    v-model="innerKeyword"
    multiple
    filterable
    allow-create
    default-first-option
    size="small"
    :placeholder="placeholder"
  >
    <el-option
      v-for="item in options"
      :key="item"
      :label="item"
      :value="item"
    />
  </el-select>
</template>

<script>
/**
 * @description: 基于element-ui的自定义标签输入框组件
 * @param {props} keyword 显示的值
 * @param {props} placeholder placeholder
 * @param {props} options 可选的关键字（从后台获取关键字列表）
 * @param {method} change 动态更改keyword，返回更改后的innerKeyword
 */
export default {
  name: 'TagsInput',
  props: {
    keyword: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {}
  },
  computed: {
    // 计算属性实现父子v-modle双向绑定
    innerKeyword: {
      get () {
        return this.keyword
      },
      set (val) {
        this.$emit('change', val)
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {}
  }
}
</script>

<style>

</style>
