<template>
  <el-dialog
    title="格式"
    v-bind="$attrs"
    width="560px"
  >
    <div class="format-row">
      <el-button
        type="primary"
        @click="sure"
      >
        确定
      </el-button>
      <el-button
        type="primary"
        @click="reset"
      >
        重置
      </el-button>
      <el-button
        type="primary"
        :disabled="currIndex === null"
        @click="move('top')"
      >
        最上
      </el-button>
      <el-button
        type="primary"
        :disabled="currIndex === null"
        @click="move('up')"
      >
        上移
      </el-button>
      <el-button
        type="primary"
        :disabled="currIndex === null"
        @click="move('down')"
      >
        下移
      </el-button>
      <el-button
        type="primary"
        :disabled="currIndex === null"
        @click="move('lowest')"
      >
        最下
      </el-button>
    </div>
    <div class="format-list">
      <el-table
        :data="tableData"
        stripe
        border
        height="300"
        highlight-current-row
        :row-class-name="tableRowIndex"
        @current-change="handleCurrentChange"
      >
        <el-table-column
          align="center"
          header-align="center"
          type="index"
          width="50"
          label="序号"
        />
        <el-table-column
          align="center"
          header-align="center"
          prop="cname"
          label="名称"
          width="100"
        />
        <el-table-column
          align="center"
          header-align="center"
          prop="cshow"
          label="显示"
          width="50"
        >
          <template #default="{ row }">
            <el-checkbox v-model="row.cshow" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          prop="align"
          label="对齐方式"
          width="auto"
        >
          <template #default="{ row }">
            <el-select
              v-model="row.align"
            >
              <el-option
                v-for="item in alignList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          prop="showname"
          label="显示名称"
          width="120"
        >
          <template #default="{ row }">
            <el-input
              v-model="row.showname"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          prop="clock"
          label="锁定"
          width="50"
        >
          <template #default="{ row }">
            <el-checkbox v-model="row.clock" />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'TableFormat',
  props: {
    tableOption: {
      type: Array,
      default: () => []
    }
  },
  emits: ['setTableOption', 'update:modelValue'],
  data () {
    return {
      alignList: [
        { value: 'left', label: '左对齐' },
        { value: 'center', label: '居中' },
        { value: 'right', label: '右对齐' }
      ],
      tableData: [],
      rawData: [], // 存放原始数据
      currIndex: null // 控制上移下移的高亮行索引
    }
  },
  watch: {
    // 表格数据是对tableOption进行处理
    tableOption (newValue) {
      this.dataChange(newValue)
    }
  },
  mounted () {
    this.dataChange(this.tableOption)
  },
  methods: {
    sure () {
      const tableData = [...this.tableData].map(e => {
        e = JSON.parse(JSON.stringify(e))
        delete e.index
        return e
      })
      this.$emit('setTableOption', tableData)
      this.$emit('update:modelValue', false)
    },
    reset () {
      this.currIndex = null
      this.tableData = this.rawData.map(e => {
        const tableRow = JSON.parse(JSON.stringify(e))
        return tableRow
      })
    },
    move (type) {
      const index = this.currIndex
      switch (type) {
        case 'top':
          if (index !== 0) {
            this.tableData.unshift(this.tableData.splice(index, 1)[0])
            this.currIndex = 0
          }
          break
        case 'up':
          if (index !== 0) {
            this.tableData[index] = this.tableData.splice(index - 1, 1, this.tableData[index])[0]
            this.currIndex = this.currIndex - 1
          } else {
            this.tableData.push(this.tableData.shift())
            this.currIndex = this.tableData.length - 1
          }
          break
        case 'down':
          if (index !== this.tableData.length - 1) {
            this.tableData[index] = this.tableData.splice(index + 1, 1, this.tableData[index])[0]
            this.currIndex = this.currIndex + 1
          } else {
            this.tableData.unshift(this.tableData.splice(index, 1)[0])
            this.currIndex = 0
          }
          break
        case 'lowest':
          if (index !== this.tableData.length - 1) {
            this.tableData.push(this.tableData.splice(index, 1)[0])
            this.currIndex = this.tableData.length - 1
          }
          break
        default:
          break
      }
    },
    /* 表格方法 */
    // 高亮行改变
    handleCurrentChange (currentRow) {
      if (currentRow && currentRow.index !== null) {
        this.currIndex = currentRow.index
      }
    },
    // 当前行index
    tableRowIndex ({ row, rowIndex }) {
      row.index = rowIndex
    },
    /* 数据变化监听 */
    dataChange (newValue) {
      this.rawData = newValue.map((e, i) => {
        const tableRow = JSON.parse(JSON.stringify(e))
        return tableRow
      })
      this.tableData = newValue.map((e, i) => {
        const tableRow = JSON.parse(JSON.stringify(e))
        return tableRow
      })
    }
  }
}
</script>

<style lang="less" scoped>
.format-row{
    display: flex;
    margin-bottom: 10px;
}
.format-list{
    height: 320px;
    overflow-y: scroll;
}
</style>
