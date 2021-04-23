<template>
    <div class="blog">

		<!-- 功能栏 -->
		<el-row :gutter="0" class="row">
			<el-col :span="12" :offset="0">
				<my-search :option="option" @search="search" @change="select"></my-search>
			</el-col>
			<el-col :span="2" :offset="1">
				<el-button type="success" size="small" @click="add" class="el-icon-plus">添加</el-button>
			</el-col>
		</el-row>


		<!-- 表格区域 -->
		<el-table :data="userList" border style="width: 100%" :stripe="true" :header-cell-style="{color:'#606266', fontFamily:'微软雅黑'}">
			<el-table-column prop="username" label="用户名" width="100" align="center" />
			<el-table-column prop="id" label="账号id" width="80" align="center" />
			<el-table-column prop="tel" label="电话" width="120" align="center" />
			<el-table-column prop="emil" label="邮箱" width="160" align="center" />
			<el-table-column prop="des" label="描述" align="center" />
			<el-table-column prop="operation" label="操作" align="center" width="180" >
				<template class="operation" slot-scope="scope">
					<el-button type="primary" size="small" @click="change(scope.row)">修改</el-button>
					<el-button type="danger" size="small" @click="del(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页器 -->
		<my-pagination @turnPage="turnPage" @changePagesize="changePagesize" :total="total" ></my-pagination>
		
		<!-- 遮罩 -->
		<my-form :formdata="formdata" :row="row" :rules="rules" :show="dialogVisible" @cancelForm="cancelForm" @submitFrom="submitFrom"></my-form>
		
    </div>
</template>

<script>
import { apiGetUserList , apiPutUser , apiPostUser , apiDeleteUser } from '@/api/user.js';
import Search from '@/components/Search/Search.vue';
import From from '@/components/Form/Form.vue';
import Pagination from '@/components/Pagination/Pagination.vue';

export default {
	components: { 'my-search': Search , 'my-form': From , 'my-pagination': Pagination },
	data(){
		return {
			userList: [],	// 需要渲染的数据

			/* 搜索组件 */
			option: [ 
				{label: '用户名', value:'username'},
				{label: '账号id', value:'id'},
				{label: '电话', value:'tel'},
			],	// 搜索类型

			/* 分页组件 */
			query: {
				page: 1,
				pagesize: 5,
				query: '',
				key: 'username'
			},	// 分页搜索数据
			total: 0,				// 页数

			/* 表单组件及遮罩 */
			dialogVisible: false,	// 遮罩
			formdata: {
				username: {label: '用户名',value: ''},
				password: {label: '密码',value: ''},
				tel: {label: '电话',value: ''},
				emil: {label: '邮箱',value: ''},
				des: {label: '描述',value: ''},
			},	// 表单
			rules:{
				username:[ { required: true, message: '请输入用户名', trigger: 'blur' } ],
				password: [ { required:true, message: '请输入密码',trigger: 'blur' } ]
			},	// 表单验证规则
			row: {}
		}
	},
	mounted(){
		this.init();
	},
	methods: {
		async init(){
			await this.search()
		},

		// 添加
		add(){
			this.resetFormdata();		// 先清空表单
			this.dialogVisible = true;	// 再打开遮罩
		},

		// 修改
		change(row){
			row.password = '';		// api中不返回密码字段，自定义空的key值
			this.row = row;
			this.dialogVisible = true;
		},

		// 删除
		async del(row){
			let msg = `删除${row.id}`;
			this.$confirm(`是否${msg}`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(async () => {
				await apiDeleteUser({id: row.id});
				this.$message.success(`${msg}成功!`);
				this.init();
			}).catch(() => {
				this.$message.info(`已取消${msg}`);
			});
		},

		// 搜索
		async search(e){
			this.query.query = e;		// 传入要搜索的值
			let { dataInfo } = await apiGetUserList(this.query);
			this.total = dataInfo.count;
			this.userList = dataInfo.rows;
		},

		// 翻页
		async turnPage(e){
			this.query.page = e;
			this.search();
		},

		// 改变页面大小
		async changePagesize(e){
			this.query.pagesize = e;
			this.search();
		},
		
		// 搜素对象选择
		select(e){
			this.query.key = e;
		},

		// 取消遮罩
		cancelForm(){
			this.dialogVisible = false;
		},

		// 重置formdata
		resetFormdata(){
			this.row = {};
			// for(let key in this.formdata){
			// 	this.formdata[key].value = '';
			// }
		},

		// 确定表单信息
		async submitFrom(e,type){
			this.dialogVisible = false;
			let response;
			if(type == 1){
				// type为1为修改
				response = await apiPostUser(e);	// 发送更改用户信息
			}else{
				// type为0为添加
				response = await apiPutUser(e);		// 发送添加用户
			}
			console.log('[response]',response);
			await this.init();		// 添加后重新初始化
		}
	}
}
</script>

<style lang="less" scoped>
.row{
	padding: 0 0 20px 0;
}
.operation{
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>