<template>
  <div class="api-doc">
    <el-table
      height="100%"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column type="expand">
        <template #default="props">
          <el-form
            label-position="left"
            inline
            class="demo-table-expand"
          >
            <el-form-item label="作者名">
              <span>{{ props.row.author }}</span>
            </el-form-item>
            <el-form-item
              v-for="(item,index) in props.row.param"
              :key="index"
              label="参数"
            >
              <span>{{ props.row.param[index] }}</span>
            </el-form-item>
            <el-form-item label="返回值描述">
              <span>{{ props.row.backDes }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="路径"
        prop="path"
      />
      <el-table-column
        label="方法"
        prop="method"
      />
      <el-table-column
        label="描述"
        prop="description"
      />
    </el-table>
  </div>
</template>

<script>
import { apiGetApi } from '../../../api/app.js'
export default {
  name: 'ApiDoc',
  data () {
    return {
      tableData: []
    }
  },
  async mounted () {
    await this.init()
  },
  methods: {
    async init () {
      const res = await apiGetApi()
      this.tableData = res.dataInfo
    }
  }
}
</script>

<style lang="less" scoped>
.api-doc{
    display: flex;
    flex-direction: column;
}
.demo-table-expand {
    font-size: 0;
}
.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}
.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
}
</style>
