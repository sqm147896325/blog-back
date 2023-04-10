<template>
    <div class="blog">

		<el-row :gutter="0" class="row">
			<el-col :span="12" :offset="0">
				<my-search holder="值" :option="option" v-model="defaultValue" @search="search" @selectchange="select"></my-search>
			</el-col>
			<el-col :span="2" :offset="1">
				<el-button type="success" size="small" @click="add" class="el-icon-plus">添加</el-button>
			</el-col>
			<el-col :span="2">
				<el-button type="success" size="small" @click="format">格式</el-button>
			</el-col>
		</el-row>


		<!-- 表格区域 -->
		<el-table :data="userList" border style="width: 100%" :stripe="true" :header-cell-style="{color:'#606266', fontFamily:'微软雅黑'}">
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
					<template #default="{ row }">
						<div v-if="item.field === 'created_at' || item.field === 'updated_at'">
							<div>{{row.created_at | dateFilter(0)}}</div>
							<div>{{row.created_at | dateFilter(1)}}</div>
						</div>
						<div v-else-if="item.field === 'operation'" class="operation">
							<el-button type="success" size="small" :disabled="row.author_id | notMyBlog(that)" @click="change(row)">查看</el-button>
							<el-button type="danger" size="small" :disabled="row.author_id | notMyBlog(that)" @click="del(row)">删除</el-button>
						</div>
						<span v-else>
							{{row[item.field]}}
						</span>
					</template>
				</el-table-column>
			</template>
		</el-table>

		<!-- 分页器 -->
		<my-pagination @turnPage="turnPage" @changePagesize="changePagesize" :total="total" ></my-pagination>
		
		<!-- 格式 -->
		<table-format :visible.sync="formatVisible" :table-option="tableOption" @setTableOption="setTableOption" />
    </div>
</template>

<script>
import { apiGetBlogList , apiDeleteBlog } from '@/api/blog.js';
import Search from '@/components/Search/Search.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import TableFormat from '@/components/TableFormat/TableFormat.vue';

export default {
	name: 'blog',
	components: { 'my-search': Search , 'my-pagination': Pagination, TableFormat },
	data(){
		return {
			// that
			that: this,

			// 需要渲染的数据
			userList: [],

			/* 搜索组件 */
			// 搜索类型
			option: [
				{label: '默认', value:''},
				{label: '作者id', value:'author_id'},
				{label: '标题', value:'title'},
				{label: '内容', value:'content'},
				{label: '描述', value:'des'},
				{label: '关键字', value:'keyword'},
				{label: '作者名', value:'author'},
			],
			defaultValue: '',

			/* 分页组件 */
			// 分页搜索数据
			query: {
				page: 1,
				pagesize: 5,
				query: '',
				key: ''
			},
			// 页数
			total: 0,

			/* 格式组件 */
			formatVisible: false,
			tableOption: [
					{ field: 'title', cname: '标题', cshow: true, align: 'center', showname: '标题', clock: false, width:180 },
					{ field: 'author', cname: '作者名', cshow: true, align: 'center', showname: '作者名', clock: false, width:100 },
					{ field: 'author_id', cname: '作者id', cshow: true, align: 'center', showname: '作者id', clock: false, width:80 },
					{ field: 'des', cname: '描述', cshow: true, align: 'center', showname: '描述', clock: false, width:160 },
					{ field: 'keyword', cname: '关键字', cshow: true, align: 'center', showname: '关键字', clock: false, width:160 },
					{ field: 'lenght', cname: '字数', cshow: true, align: 'center', showname: '字数', clock: false, width:160 },
					{ field: 'visited', cname: '访问次数', cshow: true, align: 'center', showname: '访问次数', clock: false, width:160 },
					{ field: 'created_at', cname: '创建时间', cshow: true, align: 'center', showname: '创建时间', clock: false, width:120 },
					{ field: 'updated_at', cname: '更新时间', cshow: true, align: 'center', showname: '更新时间', clock: false, width:160 },
					{ field: 'operation', cname: '操作', cshow: true, align: 'center', showname: '操作', clock: true, width:270 }
			]
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
			await this.search();
		},

		/* 顶部 */
		// 搜素对象选择
		select(e){
			if(e !== 'author_id' && this.defaultValue === this.$store.state.user.userInfo.id) {
				this.defaultValue = ''
			} 
			if (e === 'author_id') {
				this.defaultValue = this.$store.state.user.userInfo.id
			}
			this.query.key = e;
			this.search()
		},
		// 搜索
		async search(){
			this.query.query = this.defaultValue;		// 传入要搜索的值
			let { dataInfo } = await apiGetBlogList(this.query);
			this.total = dataInfo.count;
			this.userList = dataInfo.rows;
		},
		// 添加
		add(){
			// this.$router.push(`/edit/0?type=0`)
			window.open(`${import.meta.env.VITE_APP_ROUTE_PATH}/edit/0?type=0`)
		},
		// 打开格式遮罩
		format() {
            this.formatVisible = true
		},

		/* 表格 */
		// 修改
		change(row){
			// this.$router.push(`/edit/${row.id}?type=1`);
			window.open(`${import.meta.env.VITE_APP_ROUTE_PATH}/edit/${row.id}?type=1`)
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
				this.init();
			}).catch((err) => {
				console.log(err)
			});
		},

		/* 分页器组件 */
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

		/* 格式组件 */
		// 设置格式回调
		setTableOption(tableOption) {
			this.tableOption = tableOption
		}
	}
}
</script>

<style lang="less" scoped>
.row{
	padding: 0 0 15px 0;
}
.operation{
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>