<template>
    <div class="header">
        <el-header class="main">
			<i :class="collapse()?'el-icon-s-unfold':'el-icon-s-fold'" @click="setOpen"></i>
			<el-breadcrumb class="breadcrumb" separator="/">
				<el-breadcrumb-item to="/">首页</el-breadcrumb-item>
				<el-breadcrumb-item v-for="item in matched" :key="item.path" :to="item.path">{{item.name}}</el-breadcrumb-item>
			</el-breadcrumb> 
		</el-header>
    </div>
</template>

<script>
export default {
	name: 'Header',
	data(){
		return {
			// 路由原型，存储路由父子级及重定向信息
			matched: []
		}
	},
	mounted(){
		this.init();
	},
	watch: {
		// 监听路由
		$route(){
			this.routeChange()
		}
	},
	methods: {
		init(){
			this.routeChange()
		},
		// 路由改变面包屑内容也应该相应改变
		routeChange(){
			// 剔除首页
			this.matched = this.$route.matched.filter(e => {
				return e.name != '首页'
			});
		},
		setOpen(){
			this.$store.commit('setOpen');
		},

		/* 获取store中状态 */
		// 侧边栏是否展开
		collapse(){
			return this.$store.state.aside.asideOpen;
		}
	}
}
</script>

<style lang="less" scoped>
// header整体布局
.header{
	border-bottom: solid 1px #e6e6e6;
}
.main{
	display: flex;
	justify-content: flex-start;
	align-items: center;
	height: 50px;
}
// 面包屑位置
.breadcrumb{
	margin-left: 10px;
}
</style>