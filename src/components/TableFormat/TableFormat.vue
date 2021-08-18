<template>
    <el-dialog
        title="格式"
        v-bind="$attrs"
        width="500px"
        v-on="$listeners"
    >
        <div class="format-row">
            <el-button type="primary" size="small" @click="sure">确定</el-button>
            <el-button type="primary" size="small" @click="reset">重置</el-button>
            <el-button type="primary" size="small" @click="move('top')">最上</el-button>
            <el-button type="primary" size="small" @click="move('up')">上移</el-button>
            <el-button type="primary" size="small" @click="move('down')">下移</el-button>
            <el-button type="primary" size="small" @click="move('lowest')">最下</el-button>
        </div>
        <div class="format-list">
            <el-table
                ref="xTable"
                border
                reserve
                show-overflow
                highlight-hover-row
                highlight-current-row
                keep-source
                :data="tableData"
                :edit-config="{trigger: 'click', mode: 'cell'}"
            >
                <!-- <el-table-column align="center" header-align="center" type="selection" width="50" label="序号" /> -->
                <el-table-column align="center" header-align="center" prop="cname" label="名称" width="100" />
                <el-table-column align="center" header-align="center" prop="cshow" label="显示" width="50">
                    <template #default="{ row }">
                        <el-checkbox v-model="row.cshow" />
                    </template>
                </el-table-column>
                <el-table-column align="center" header-align="center" prop="align" label="对齐方式" width="auto" :edit-render="{name: 'select', options: alignList }" />
                <el-table-column align="center" header-align="center" prop="showname" label="显示名称" width="100" :edit-render="{name: 'input', attrs: {type: 'text', placeholder: '请输入显示名称'}}" />
                <el-table-column align="center" header-align="center" prop="clock" label="锁定" width="50">
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
    data() {
        return {
            alignList: [
                { value: 'left', label: '左对齐' },
                { value: 'center', label: '居中' },
                { value: 'right', label: '右对齐' }
            ],
            tableData: [],
            rawData: [] // 存放原始数据
        }
    },
    watch: {
        // 表格数据是对tableOption进行处理
        tableOption(newValue) {
            this.rawData = newValue.map(e => {
                return JSON.parse(JSON.stringify(e))
            })
            this.tableData = newValue.map(e => {
                return JSON.parse(JSON.stringify(e))
            })
        }
    },
    mounted() {
        this.rawData = this.tableOption.map(e => {
            return JSON.parse(JSON.stringify(e))
        })
        this.tableData = this.tableOption.map(e => {
            return JSON.parse(JSON.stringify(e))
        })
    },
    methods: {
        sure() {
            this.$emit('setTableOption', this.tableData)
            this.$emit('update:visible', false)
        },
        reset() {
            console.log('重置')
            this.tableData = this.rawData.map(e => {
                return JSON.parse(JSON.stringify(e))
            })
        },
        move(type) {
            const row = this.$refs.xTable.getCurrentRecord()
            const index = this.$refs.xTable.getRowIndex(row)
            switch (type) {
                case 'top':
                    if (index !== 0) {
                        this.tableData.unshift(this.tableData.splice(index, 1)[0])
                    }
                    break
                case 'up':
                    if (index !== 0) {
                        this.tableData[index] = this.tableData.splice(index - 1, 1, this.tableData[index])[0]
                    } else {
                        this.tableData.push(this.tableData.shift())
                    }
                    break
                case 'down':
                    if (index !== this.tableData.length - 1) {
                        this.tableData[index] = this.tableData.splice(index + 1, 1, this.tableData[index])[0]
                    } else {
                        this.tableData.unshift(this.tableData.splice(index, 1)[0])
                    }
                    break
                case 'lowest':
                    if (index !== this.tableData.length - 1) {
                        this.tableData.push(this.tableData.shift())
                    }
                    break
                default:
                    break
            }
        }
    }
}
</script>

<style lang="less" scoped>
.format-row{
    display: flex;
}
.format-list{
    height: 360px;
    overflow-y: scroll;
}
</style>
