<template>
  <div class="conversation-view">
    <el-row
      :gutter="0"
      class="row"
    >
      <el-col
        :span="12"
        :offset="0"
      >
        <my-search
          v-model="defaultValue"
          holder="值"
          :option="option"
          @search="search"
          @selectchange="select"
        />
      </el-col>
      <el-col
        :span="2"
        :offset="1"
      >
        <el-button
          type="success"
          size="small"
          class="el-icon-plus"
          @click="add"
        >
          添加
        </el-button>
      </el-col>
      <el-col
        :span="2"
      >
        <el-button
          type="success"
          size="small"
          @click="format"
        >
          格式
        </el-button>
      </el-col>
    </el-row>

    <!-- 表格区域 -->
    <el-table
      :data="userList"
      border
      height="100%"
      style="width: 100%"
      :stripe="true"
      :header-cell-style="{color:'#606266', fontFamily:'微软雅黑'}"
    >
      <template v-for="item in tableOption">
        <el-table-column
          v-if="item.cshow"
          :key="item.index"
          :prop="item.field"
          :label="item.showname"
          :width="item.width"
          :align="item.align"
          :fixed="item.clock ? 'right' : false"
        >
          <template #default="{ row }">
            <div v-if="item.field === 'created_at' || item.field === 'updated_at'">
              <div>{{ row.created_at | dateFilter(0) }}</div>
              <div>{{ row.created_at | dateFilter(1) }}</div>
            </div>
            <div
              v-else-if="item.field === 'operation'"
              class="operation"
            >
              <el-button
                type="success"
                size="small"
                :disabled="row.author_id | notMyBlog(that)"
                @click="change(row)"
              >
                查看
              </el-button>
              <el-button
                type="danger"
                size="small"
                :disabled="row.author_id | notMyBlog(that)"
                @click="del(row)"
              >
                删除
              </el-button>
            </div>
            <span v-else>
              {{ row[item.field] }}
            </span>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <!-- 分页器 -->
    <my-pagination
      :total="total"
      @turnPage="turnPage"
      @changePagesize="changePagesize"
    />

    <!-- 格式 -->
    <table-format
      :visible.sync="formatVisible"
      :table-option="tableOption"
      @setTableOption="setTableOption"
    />
  </div>
</template>

<script>
import { conversationList, conversationDelete } from '@/api/conversation.js'
import Search from '@/components/Search/Search.vue'
import Pagination from '@/components/Pagination/Pagination.vue'
import TableFormat from '@/components/TableFormat/TableFormat.vue'
import manageMixin from '../manageMixin.js'
import SelectConfirm from './components/SelectConfirm.vue'

export default {
  name: 'BlogView',
  components: { 'my-search': Search, 'my-pagination': Pagination, TableFormat },
  filters: {
    // 判断当前博客是否可以控制
    notMyBlog (e, that) {
      if (that.$store.state.user.isAdmin) {
        // 超级管理员可以访问所有
        return false
      }
      return e !== that.$store.state.user.userInfo.id
    },
    // 时间过滤器
    dateFilter (date, type) {
      if (!date) {
        // 如果没有这一字段直接返回''
        return ''
      }
      if (type === 0) {
        return date.split('T')[0]
      } else {
        return date.split('T')[1].split('.')[0]
      };
    }
  },
  mixins: [manageMixin],
  data () {
    return {
      // that
      that: this,

      // 需要渲染的数据
      userList: [],

      /* 搜索组件 */
      // 搜索类型
      option: [
        { label: '默认', value: '' },
        { label: '类型', value: 'type' }
      ],
      defaultValue: '',

      /* 格式组件 */
      formatVisible: false,
      tableOption: [
        { field: 'type', cname: '类型', cshow: true, align: 'center', showname: '类型', clock: false, width: 100 },
        { field: 'ai_overview', cname: 'ai对话简述', cshow: true, align: 'center', showname: 'ai对话简述', clock: false, width: 100 },
        { field: 'ai_target', cname: 'ai对话目标', cshow: true, align: 'center', showname: 'ai对话目标', clock: false, width: 100 },
        { field: 'user_target', cname: '用户对话目标', cshow: true, align: 'center', showname: '用户对话目标', clock: false, width: 160 },
        { field: 'unread', cname: '未读消息数', cshow: true, align: 'center', showname: '未读消息数', clock: false, width: 100 },
        { field: 'created_at', cname: '创建时间', cshow: true, align: 'center', showname: '创建时间', clock: false, width: 'auto' },
        { field: 'updated_at', cname: '更新时间', cshow: true, align: 'center', showname: '更新时间', clock: false, width: 'auto' },
        { field: 'operation', cname: '操作', cshow: true, align: 'center', showname: '操作', clock: false, width: 'auto' }
      ]
    }
  },
  async mounted () {
    await this.init()
  },
  methods: {
    async init () {
      await this.search()
    },

    /* 顶部 */
    // 搜素对象选择
    select (e) {
      this.query.key = e
      this.search()
    },
    // 搜索
    async search () {
      this.query.query = this.defaultValue // 传入要搜索的值
      const { dataInfo } = await conversationList(this.query)
      this.total = dataInfo.count
      this.userList = dataInfo.rows
    },
    // 添加
    add () {
      const selectConfirmComponent = this.$createElement(SelectConfirm)
      /* $msgbox疑似会缓存组件导致无法释放，不应该用其中的挂载、卸载生命周期，不可靠 */
      this.$msgbox({
        title: '消息',
        message: selectConfirmComponent,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: (action, instance) => {
          const type = selectConfirmComponent.componentInstance?._data?.selectValue || ''
          if (action === 'confirm' && type === 'ai') {
            setTimeout(() => {
              window.open(`${import.meta.env.VITE_APP_ROUTE_PATH}/application/openAi`)
            }, 200)
          }
        }
      })
    },
    // 打开格式遮罩
    format () {
      this.formatVisible = true
    },

    /* 表格 */
    // 查看/修改
    change (row) {
      if (row.type === 'ai') {
        window.open(`${import.meta.env.VITE_APP_ROUTE_PATH}/application/openAi?uuid=${row.uuid}`)
      } else {
        this.$message(row.type)
      }
    },
    // 删除
    del (row) {
      const msg = `删除${row.uuid}`
      this.$confirm(`是否${msg}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await conversationDelete({ uuid: row.uuid })
        this.init()
      }).catch((err) => {
        console.log(err)
      })
    }

  }
}
</script>

<style lang="less" scoped>
.conversation-view{
  display: flex;
  flex-direction: column;
}
.row{
  padding: 0 0 15px 0;
}
.operation{
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
