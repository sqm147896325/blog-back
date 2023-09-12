export default {
  data () {
    return {
      /* 分页组件 */
      query: {
        page: 1,
        pagesize: 5,
        query: '',
        key: ''
      }, // 分页搜索数据
      total: 0 // 页数
    }
  },

  methods: {
    /* 分页器组件 */
    // 翻页
    async turnPage (e) {
      this.query.page = e
      this.search()
    },
    // 改变每页大小
    async changePagesize (e) {
      this.query.pagesize = e
      this.search()
    },

    /* 格式组件 */
    // 设置格式回调
    setTableOption (tableOption) {
      this.tableOption = tableOption
    }

  }
}
