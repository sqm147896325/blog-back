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
		
    </div>
</template>

<script>
import { apiGetBlogList } from '@/api/blog.js';
import Search from '@/components/Search/Search.vue';

export default {
	components: { 'my-search': Search },
	data(){
		return {
			userList: [],
			option: [ '标题' , '分类' , '内容' , '作者名' ]
		}
	},
	mounted(){
		this.init();
	},
	methods: {
		async init(){
			let { dataInfo } = await apiGetBlogList();
			this.userList = dataInfo.rows;
		},
		// 添加
		add(){
			
		},
		// 查看
		change(){

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
		search(e){
			console.log(e);
		},
		// 搜素对象选择
		select(e){
			console.log(e);
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