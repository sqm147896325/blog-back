<template>
  <div class="user">
    <!-- 功能栏 -->
    <el-row
      :gutter="0"
      class="row"
    >
      <el-col
        :span="12"
        :offset="0"
      >
        <my-search
          v-model="value"
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
      <el-col :span="2">
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
          <template #default="scope">
            <div v-if="item.field === 'operation'">
              <el-button
                type="primary"
                size="small"
                @click="change(scope.row)"
              >
                修改信息
              </el-button>
              <el-button
                type="primary"
                size="small"
                @click="changePower(scope.row)"
              >
                修改权限
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="del(scope.row)"
              >
                删除
              </el-button>
            </div>
            <span v-else>
              {{ scope.row[item.field] }}
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

    <!-- 表单遮罩 -->
    <my-form
      title="修改账号"
      :formdata="formdata"
      :row="row"
      :rules="rules"
      :visible="dialogVisible"
      @cancelForm="cancelForm"
      @submitFrom="submitFrom"
    />

    <!-- 权限遮罩 -->
    <power-dialog
      :id="powerId"
      :show.sync="powerVisible"
      :power-data="powerData"
      @save="init"
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
import { apiGetUserList, apiPutUser, apiPostUser, apiDeleteUser } from '@/api/user.js'
import Search from '@/components/Search/Search.vue'
import From from '@/components/Form/Form.vue'
import Pagination from '@/components/Pagination/Pagination.vue'
import PowerDialog from './components/PowerDialog.vue'
import TableFormat from '@/components/TableFormat/TableFormat.vue'
import manageMixin from '../manageMixin.js'

export default {
  name: 'UserView',
  components: { 'my-search': Search, 'my-form': From, 'my-pagination': Pagination, PowerDialog, TableFormat },
  mixins: [manageMixin],
  data () {
    return {
      userList: [], // 需要渲染的数据

      /* 搜索组件 */
      value: '', // 搜索帮定值
      option: [
        { label: '用户名', value: 'username' },
        { label: '账号id', value: 'id' },
        { label: '电话', value: 'tel' }
      ], // 搜索类型

      /* 表单组件及遮罩 */
      dialogVisible: false, // 遮罩
      formdata: {
        username: { label: '用户名', value: '' },
        password: { label: '密码', value: '', type: 'password' },
        tel: { label: '电话', value: '' },
        email: { label: '邮箱', value: '' },
        des: { label: '描述', value: '' }
      }, // 表单
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }, // 表单验证规则
      row: {},

      /* 权限树组件及遮罩 */
      powerData: [],
      powerVisible: false,
      powerId: 0,

      /* 格式组件 */
      formatVisible: false,
      tableOption: [
        { field: 'username', cname: '用户名', cshow: true, align: 'center', showname: '用户名', clock: false, width: 100 },
        { field: 'id', cname: '账号id', cshow: true, align: 'center', showname: '账号id', clock: false, width: 80 },
        { field: 'tel', cname: '电话', cshow: true, align: 'center', showname: '电话', clock: false, width: 120 },
        { field: 'email', cname: '邮箱', cshow: true, align: 'center', showname: '邮箱', clock: false, width: 180 },
        { field: 'des', cname: '描述', cshow: true, align: 'center', showname: '描述', clock: false },
        { field: 'operation', cname: '操作', cshow: true, align: 'center', showname: '操作', clock: true, width: 280 }
      ]
    }
  },
  mounted () {
    this.query.key = 'username'
    this.init()
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
      this.query.query = this.value // 传入要搜索的值
      const { dataInfo } = await apiGetUserList(this.query)
      this.total = dataInfo.count
      this.userList = dataInfo.rows
    },
    // 添加
    add () {
      this.resetFormdata() // 先清空表单
      this.dialogVisible = true // 再打开遮罩
    },
    // 打开格式遮罩
    format () {
      this.formatVisible = true
    },

    /* 表格 */
    // 修改
    change (row) {
      row.password = '' // api中不返回密码字段，自定义空的key值
      this.row = row
      this.dialogVisible = true
    },
    // 修改权限
    changePower (row) {
      this.powerData = JSON.parse(row.power) || []
      this.powerId = row.id
      this.powerVisible = true
    },
    // 删除
    async del (row) {
      const msg = `删除${row.id}`
      this.$confirm(`是否${msg}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await apiDeleteUser({ id: row.id })
        this.query.page = 1
        this.init()
      }).catch(() => {
        this.$message.info(`已取消${msg}`)
      })
    },

    /* 表单组件 */
    // 取消遮罩
    cancelForm () {
      this.dialogVisible = false
    },
    // 重置formdata
    resetFormdata () {
      this.row = {}
    },
    // 确定表单信息
    async submitFrom (e, type) {
      this.dialogVisible = false
      if (type === 1) {
        // type为1为修改
        await apiPostUser(e) // 发送更改用户信息
      } else {
        // type为0为添加
        await apiPutUser(e) // 发送添加用户
      }
      await this.init() // 添加后重新初始化
    }

  }
}
</script>

<style lang="less" scoped>
.user{
  display: flex;
  flex-direction: column;
}
.row{
  padding: 0 0 20px 0;
}
.operation{
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
