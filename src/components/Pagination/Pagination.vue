<template>
  <!--  -->
  <el-pagination
    v-model:current-page="currentPage"
    v-model:page-sizes="pageSizes"
    class="pagination"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script>
/**
 * @description: 基于element-ui自定义分页器
 * @param {props} total 总条数
 * @param {method} changePagesize 改变分页器每页大小，返回每页大小
 * @param {method} turnPage 翻页，返回到达页码
 */
export default {
  name: 'MyPagination',
  props: {
    total: {
      type: Number,
      default: 0
    }
  },
  emits: ['changePagesize', 'turnPage'],
  data () {
    return {
      currentPage: 1, // 当前页数
      pageSizes: [5, 10, 15, 20], // 每页条数
      pageSize: 5 // 当前每页条数,默认值
    }
  },
  mounted () {},
  methods: {
    init () {

    },
    // 改变分页大小
    handleSizeChange (e) {
      this.$emit('changePagesize', e)
    },
    // 改变当前页数
    handleCurrentChange (e) {
      this.$emit('turnPage', e) // 调用翻页，传入要搜索的页数
    }
  }
}
</script>

<style lang="less" scoped>
.pagination{
 padding: 10px 0px
}
</style>
