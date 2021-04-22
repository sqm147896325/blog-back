<template>
    <div class="blog">

		<el-row :gutter="0" class="row">
			<el-col :span="12" :offset="0">
				<my-search holder="值" :option="option" @search="search" @change="select"></my-search>
			</el-col>
			<el-col :span="2" :offset="1">
				<el-button type="success" size="small" @click="add" class="el-icon-plus">添加</el-button>
			</el-col>
		</el-row>


		<!-- 表格区域 -->
		<el-table :data="userList" border style="width: 100%" :stripe="true" :header-cell-style="{color:'#606266', fontFamily:'微软雅黑'}">
			<el-table-column prop="title" label="标题" width="100" align="center" />
			<el-table-column prop="author" label="作者名" width="100" align="center" />
			<el-table-column prop="author_id" label="作者id" width="80" align="center" />
			<el-table-column prop="des" label="描述" width="160" align="center" />
			<el-table-column prop="keyword" label="关键字" width="160" align="center" />
			<el-table-column prop="created_at" label="创建时间" width="120" align="center" />
			<el-table-column prop="updated_at" label="更新时间" width="160" align="center" />
			<el-table-column prop="operation" label="操作" align="center" width="270" fixed="right" >
				<template class="operation">
					<el-button type="success" size="small" @click="change">查看</el-button>
					<el-button type="danger" size="small" @click="del">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页器 -->
		<my-pagination @turnPage="turnPage" @changePagesize="changePagesize" :total="total" ></my-pagination>
		
		<!-- 遮罩 -->
		<el-dialog :title="'修改账号'" :visible.sync="dialogVisible" width="33%">
			<my-form :formdata="formdata" :rules="rules" @cancelFrom="cancelFrom" @submitFrom="submitFrom"></my-form>
		</el-dialog>
		
    </div>
</template>

<script>
import { apiGetBlogList } from '@/api/blog.js';
import Search from '@/components/Search/Search.vue';
import From from '@/components/Form/Form.vue';
import Pagination from '@/components/Pagination/Pagination.vue';

export default {
	components: { 'my-search': Search , 'my-form': From , 'my-pagination': Pagination },
	data(){
		return {
			// 需要渲染的数据
			userList: [],

			/* 搜索组件 */
			// 搜索类型
			option: [ 
				{label: '标题', value:'title'},
				{label: '内容', value:'content'},
				{label: '描述', value:'des'},
				{label: '关键字', value:'keyword'},
				{label: '作者名', value:'author'},
			],

			/* 分页组件 */
			// 分页搜索数据
			query: {
				page: 1,
				pagesize: 2,
				query: '',
				key: 'title'
			},
			// 页数
			total: 0,

			/* 表单组件及遮罩 */
			// 遮罩
			dialogVisible: false,
			// 表单
			formdata: {
				title: {label: '标题',value: ''},
				des: {label: '描述',value: ''},
				keyword: {label: '关键字',value: ''}
			},
			// 表单验证规则
			rules:{
				title:[ { required: true, message: '标题', trigger: 'blur' } ]
			}
		}
	},
	mounted(){
		this.init();
	},
	methods: {
		async init(){
			await this.search();
		},
		// 添加
		add(){
			this.resetFormdata();		// 先清空表单
			this.dialogVisible = true;	// 再打开遮罩
		},
		// 修改
		change(row){
			// 遍历row的keys，如果有在formdata中相应定义的key值则覆盖其value
			Object.keys(row).forEach(e => {
				if(this.formdata[e] != undefined){
					this.formdata[e].value = row[e];
				}
			});
			this.dialogVisible = true;
		},
		// 删除
		del(){
			this.$confirm(`是否${{msg}}`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$message.success(`${{msg}}成功!`);
			}).catch(() => {
				this.$message.info(`已取消${{msg}}`);
			});
			// apiPostUpdataUser()
		},
		// 搜索
		async search(e){
			this.query.query = e;		// 传入要搜索的值
			let { dataInfo } = await apiGetBlogList(this.query);
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
		cancelFrom(){
			this.dialogVisible = false;
		},
		// 重置formdata
		resetFormdata(){
			for(let key in this.formdata){
				this.formdata[key].value = '';
			}
		},
		// 确定表单信息
		submitFrom(e){
			console.log('[blog]',e);
			this.dialogVisible = false;
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