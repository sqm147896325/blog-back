<template>
    <div class="blog">

		<el-row :gutter="0" class="row">
			<el-col :span="12" :offset="0">
				<my-search holder="值" :option="option" :defaultValue="defaultValue" @search="search" @change="select"></my-search>
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
			<el-table-column prop="lenght" label="字数" width="160" align="center" />
			<el-table-column prop="visited" label="访问次数" width="160" align="center" />
			<el-table-column prop="created_at" label="创建时间" width="120" align="center">
				<template class="operation" slot-scope="scope">
					<div>{{scope.row.created_at | dateFilter(0)}}</div>
					<div>{{scope.row.created_at | dateFilter(1)}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="updated_at" label="更新时间" width="160" align="center">
				<template class="operation" slot-scope="scope">
					<div>{{scope.row.updated_at | dateFilter(0)}}</div>
					<div>{{scope.row.updated_at | dateFilter(1)}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="operation" label="操作" align="center" width="270" fixed="right" >
				<template class="operation" slot-scope="scope">
					<el-button type="success" size="small" :disabled="scope.row.author_id | notMyBlog(that)" @click="change(scope.row)">查看</el-button>
					<el-button type="danger" size="small" :disabled="scope.row.author_id | notMyBlog(that)" @click="del(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页器 -->
		<my-pagination @turnPage="turnPage" @changePagesize="changePagesize" :total="total" ></my-pagination>
		
    </div>
</template>

<script>
import { apiGetBlogList , apiDeleteBlog } from '@/api/blog.js';
import Search from '@/components/Search/Search.vue';
import Pagination from '@/components/Pagination/Pagination.vue';

export default {
	components: { 'my-search': Search , 'my-pagination': Pagination },
	data(){
		return {
			// that
			that: this,

			// 需要渲染的数据
			userList: [],

			/* 搜索组件 */
			// 搜索类型
			option: [
				{label: '作者id', value:'author_id'},
				{label: '标题', value:'title'},
				{label: '内容', value:'content'},
				{label: '描述', value:'des'},
				{label: '关键字', value:'keyword'},
				{label: '作者名', value:'author'},
			],
			defaultValue: this.$store.state.user.userInfo.id,

			/* 分页组件 */
			// 分页搜索数据
			query: {
				page: 1,
				pagesize: 5,
				query: '',
				key: 'author_id'
			},
			// 页数
			total: 0
		}
	},
	filters: {
		// 判断当前博客是否可以控制
		notMyBlog(e,that){
			if(that.$store.state.user.isAdmin){
				// 超级管理员可以访问所有
				return false;
			}
			return e != that.$store.state.user.userInfo.id;
		},
		// 时间过滤器
		dateFilter(date,type){
			if(!date){
				// 如果没有这一字段直接返回''
				return '';
			}
			if(type == 0){
				return date.split('T')[0];
			}else{
				return date.split('T')[1].split('.')[0];
			};
		}
	},
	async mounted(){
		await this.init();
	},
	methods: {
		async init(){
			await this.search(this.$store.state.user.userInfo.id);
		},
		// 添加
		add(){
			this.$router.push(`/edit/0?type=0`)
		},
		// 修改
		change(row){
			this.$router.push(`/edit/${row.id}?type=1`);
		},
		// 删除
		del(row){
			let msg = `删除${row.id}`;
			this.$confirm(`是否${msg}`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(async () => {
				await apiDeleteBlog({id: row.id});
				this.$message.success(`${msg}成功!`);
				this.init();
			}).catch((err) => {
				console.log(err)
				this.$message.info(`已取消${msg}`);
			});
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