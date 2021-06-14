<template>
  <div>
	<div class="title-bar">
		<div class="left">
			<el-button :disabled="backId.length == 0" type="primary" size="small" @click="back">返回</el-button>
			<el-button :disabled="checkArr.length == 0" type="danger" size="small" @click="del">删除</el-button>
		</div>
		<div class="right">
			<el-button type="success" size="small" @click="mkdir">新建文件夹</el-button>
			<el-button type="primary" size="small" @click="upload">上传</el-button>
		</div>
	</div>
	<el-table :data="tableData" @row-click="rowClick" @selection-change="checkChange">
		<el-table-column type="selection" width="55"></el-table-column>
		<el-table-column label="名称" width="200">
			<template slot-scope="{ row }">
				{{row | filterFlieName}}
			</template>
		</el-table-column>
		<el-table-column prop="size" label="大小" width="100"></el-table-column>
		<el-table-column prop="upload_time" label="上传时间"></el-table-column>
	</el-table>
	<el-dialog title="上传文件" :visible.sync="visible" width="400">
		<el-upload class="upload-center" drag action :http-request="uploadSectionFile" :on-change="flieChange" :on-remove="flieChange" multiple>
			<i class="el-icon-upload"></i>
			<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
			<div class="el-upload__tip" slot="tip">只能上传文件，且单个大小不超过500mb</div>
		</el-upload>
		<span slot="footer">
			<el-button @click="visible = false" size="small">取消</el-button>
			<el-button type="primary" @click="save" size="small">上传至此</el-button>
		</span>
	</el-dialog>
	
  </div>
</template>

<script>
import { apiPostFlie, apiPutFlie, apiDeleteFile , apiPutDir } from '@/api/app.js'
export default {
	name: 'networkDisk',
	data() {
		return {
			visible: false,
			tableData: [],
			path: '/',		// 当前路径，默认为'/'
			uuid: 0,		// 当前目录的id,默认为0
			fileList: [],	// 文件列表
			backId: [],		// 需要返回的id
			checkArr: []	// 选中的数组
		}
	},
	async mounted() {
		await this.init()
	},
	filters: {
		filterFlieName(row) {
			if(row.file_type == 'dir'){
				return row.name;
			}
			return row.name + row.file_type;
		}
	},
	methods: {
		async init() {
			await this.postFile();
		},

		/* 顶部按钮相关 */
		// 点击返回
		async back() {
			this.uuid = this.backId.pop();
			await this.init();
		},
		// 删除
		async del() {
			console.log(this.checkArr);
			let delArr = this.checkArr.map(e => e.uuid);
			let res = await this.deleteFile({delArr,user_id:this.$store.state.user.userInfo.id});
			console.log(res);
			await this.init();
		},
		// 创建文件夹
		async mkdir(){
			let msg = '新建文件夹'
			this.$prompt('请输入文件夹名称',msg, {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputValidator: (value) => value !== '' && value !== null ,
				inputErrorMessage: '名称不能为空',
				type: 'warning'
			}).then(async ({ value }) => {
				const name = value
				let params = {
					parentId: this.uuid,
					user_id:this.$store.state.user.userInfo.id,
					name,
					size: '0kb'
				}
				await this.putDir(params);
				this.$message.success(`${msg}成功!`);
				await this.init();
			}).catch((err) => {
				console.log(err)
				this.$message.info(`已取消${msg}`);
			});
		},
		// 点击上传
		upload(){
			this.visible = true;
		},

		/* 表格相关 */
		// 行点击
		async rowClick(row,col) {
			if( row.file_type == 'dir' ) {
				this.backId.push(this.uuid);
				this.uuid = row.uuid;
				await this.init();
			}
		},
		// 勾选改变回调
		checkChange(check) {
			this.checkArr = check;
			console.log(this.checkArr)
		},

		/* 上传文件遮罩 */
		// 覆盖默认的上传文件方法
		uploadSectionFile(params) {
			const file = params.file;
            const isLt = file.size / 1024 / 1024 < 500;
			if (!isLt) {
				this.$message.error("只能上传文件大小小于500M");
				return false;
			}
		},
		// 文件改变
		flieChange(file,fileList) {
			this.fileList = fileList;
		},
		// 保存
		async save() {
			const form = new FormData();
			if(this.fileList.length >= 1){
				this.fileList.map(e => {
					form.append('file', e.raw);
				})
				form.append('parentId',this.uuid);
				form.append('user_id',this.$store.state.user.userInfo.id);
				await this.putFile(form);
				this.visible = false;
				await this.init();
			} else  {
				this.$message.warning('请选择上传的文件');
			}
		},

		/* 请求相关 */
		// 获取文件或文件夹相关信息
		async postFile() {
			let res = await apiPostFlie({uuid:this.uuid,user_id:this.$store.state.user.userInfo.id});
			this.tableData = res.dataInfo.content;
			console.log(res)
		},
		// 存入文件
		async putFile(params) {
			let res = await apiPutFlie(params);
			console.log(res)
		},
		// 存入文件夹
		async putDir(params) {
			let res = await apiPutDir(params);
			console.log(res);
		},
		// 删除文件或文件夹
		async deleteFile(params) {
			let res = await apiDeleteFile(params);
			console.log(res);
		}
	}
}
</script>

<style lang="less" scoped>
.title-bar{
	margin-top: 20px;
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