<template>
  <div class="network-disk">
    <div class="title-bar">
      <div class="left">
        <el-button
          :disabled="backId.length == 0"
          type="primary"
          @click="back"
        >
          返回
        </el-button>
        <el-button
          :disabled="checkArr.length == 0"
          type="danger"
          @click="del"
        >
          删除
        </el-button>
      </div>
      <div class="right">
        <el-button
          :disabled="checkArr.length == 0"
          type="primary"
          @click="downFile"
        >
          下载
        </el-button>
        <el-button
          type="success"
          @click="mkdir"
        >
          新建文件夹
        </el-button>
        <el-button
          type="primary"
          @click="upload"
        >
          上传
        </el-button>
      </div>
    </div>
    <el-table
      ref="table"
      highlight-current-row
      height="100%"
      :data="tableData"
      @row-dblclick="rowDblclick"
      @row-click="rowClick"
      @selection-change="checkChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        label="名称"
        width="200"
      >
        <template #default="{ row }">
          {{ filterFlieName(row) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="size"
        label="大小"
        width="100"
      />
      <el-table-column
        prop="upload_time"
        label="上传时间"
      />
      <el-table-column
        label="操作"
        align="center"
      >
        <template #default="{ row }">
          <el-button
            v-if="row.file_type !== 'dir'"
            type="primary"
            @click.stop="preview(row)"
          >
            预览
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :model-value="visible"
      title="上传文件"
      width="400"
      @close="uploadClose"
    >
      <el-upload
        class="upload-center"
        drag
        action
        :http-request="uploadSectionFile"
        :on-change="flieChange"
        :on-remove="flieChange"
        :file-list="fileList"
        multiple
      >
        <el-icon>
          <Upload />
        </el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            只能上传文件，且单个大小不超过100mb
          </div>
        </template>
      </el-upload>
      <template #footer>
        <span>
          <el-button
            @click="visible = false"
          >取消</el-button>
          <el-button
            type="primary"
            @click="save"
          >上传至此</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { apiPostFlie, apiPutFlie, apiDeleteFile, apiPutDir } from '@/api/app.js'
export default {
  name: 'NetworkDisk',
  data () {
    return {
      visible: false,
      tableData: [],
      path: '/', // 当前路径，默认为'/'
      uuid: 0, // 当前目录的id,默认为0
      fileList: [], // 文件列表
      backId: [], // 需要返回的id
      checkArr: [] // 选中的数组
    }
  },
  async mounted () {
    await this.init()
  },
  methods: {
    async init () {
      await this.postFile()
    },

    /* 顶部按钮相关 */
    // 点击返回
    async back () {
      this.uuid = this.backId.pop()
      await this.init()
    },
    // 删除
    async del () {
      const delArr = this.checkArr.map(e => e.uuid)
      await this.deleteFile({ delArr, user_id: this.$store.state.user.userInfo.id })
      await this.init()
    },
    // 下载
    async downFile () {
      let isDir = false
      const downloadArr = this.checkArr.map(e => {
        if (e.file_type === 'dir') {
          isDir = true
        }
        return e.uuid
      })
      if (!isDir && downloadArr.length === 1) {
        // 下载单文件的接口
        window.open(`${import.meta.env.VITE_APP_BASE_PATH}/file/fileLink?fileId=${downloadArr[0]}&user_id=${this.$store.state.user.userInfo.id}&download=true`)
      } else {
        // 下载压缩包
        window.open(`${import.meta.env.VITE_APP_BASE_PATH}/file/downloadZip?downloadArr=${downloadArr}&user_id=${this.$store.state.user.userInfo.id}`)
      }
    },
    // 创建文件夹
    async mkdir () {
      const msg = '新建文件夹'
      this.$prompt('请输入文件夹名称', msg, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: (value) => value !== '' && value !== null,
        inputErrorMessage: '名称不能为空',
        type: 'warning'
      }).then(async ({ value }) => {
        const name = value
        const params = {
          parentId: this.uuid,
          user_id: this.$store.state.user.userInfo.id,
          name,
          size: '0kb'
        }
        await this.putDir(params)
        this.$message.success(`${msg}成功!`)
        await this.init()
      }).catch((err) => {
        console.error('错误捕捉', err)
        this.$message.info(`已取消${msg}`)
      })
    },
    // 点击上传
    upload () {
      this.visible = true
    },
    // 上传关闭
    uploadClose () {
      this.fileList = []
      this.visible = false
    },

    /* 表格相关 */
    // 行单击
    rowClick (row, col) {
      this.$refs.table.toggleRowSelection(row)
    },
    // 行双击
    async rowDblclick (row, col) {
      if (row.file_type === 'dir') {
        this.backId.push(this.uuid)
        this.uuid = row.uuid
        await this.init()
      }
    },
    // 勾选改变回调
    checkChange (check) {
      this.checkArr = check
    },
    preview (row) {
      window.open(`${import.meta.env.VITE_APP_BASE_PATH}/file/fileLink?fileId=${row.uuid}&user_id=${this.$store.state.user.userInfo.id}`)
    },

    /* 上传文件遮罩 */
    // 覆盖默认的上传文件方法
    uploadSectionFile (params) {
      const file = params.file
      const isLt = file.size / 1024 / 1024 < 100
      if (!isLt) {
        this.$message.error('只能上传文件大小小于100M')
        return false
      }
    },
    // 文件改变
    flieChange (file, fileList) {
      this.fileList = fileList
    },
    // 保存
    async save () {
      const form = new FormData()
      if (this.fileList.length >= 1) {
        this.fileList.forEach((e) => {
          form.append('file', e.raw)
        })
        form.append('parentId', this.uuid)
        form.append('user_id', this.$store.state.user.userInfo.id)
        await this.putFile(form)
        this.visible = false
        await this.init()
      } else {
        this.$message.warning('请选择上传的文件')
      }
    },

    /* 请求相关 */
    // 获取文件或文件夹相关信息
    async postFile () {
      const res = await apiPostFlie({ uuid: this.uuid, user_id: this.$store.state.user.userInfo.id })
      this.tableData = res.dataInfo.content
    },
    // 存入文件
    async putFile (params) {
      await apiPutFlie(params)
    },
    // 存入文件夹
    async putDir (params) {
      await apiPutDir(params)
    },
    // 删除文件或文件夹
    async deleteFile (params) {
      await apiDeleteFile(params)
    },

    /* 过滤函数 */
    filterFlieName (row) {
      if (row.file_type === 'dir') {
        return row.name
      }
      return row.name + row.file_type
    }
  }
}
</script>

<style lang="less" scoped>
.network-disk{
  display: flex;
    flex-direction: column;
}
.title-bar{
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
  .left{
    display: flex;
  }
  .right{
    display: flex;
  }
}
.upload-center{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
