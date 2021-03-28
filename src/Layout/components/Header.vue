<template>
    <div class="header">
        <el-header class="main">
			<i :class="collapse()?'el-icon-s-unfold':'el-icon-s-fold'" @click="setOpen"></i>
			<el-breadcrumb class="breadcrumb" separator="/">
				<el-breadcrumb-item to="/">首页</el-breadcrumb-item>
				<el-breadcrumb-item v-for="item in matched" :key="item.path" :to="item.path">{{item.name}}</el-breadcrumb-item>
			</el-breadcrumb> 

			<el-dropdown @command="headMenu" class="dropdown">
				<span class="dropdown-head">
					<el-avatar shape="square" :size="36"> user </el-avatar>
					<i class="el-icon-arrow-down el-icon--right"></i>
				</span>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item v-for="( item , index ) in option" :key="index" :command="item.value">{{item.lable}}</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>

		</el-header>
    </div>
</template>

<script>
export default {
	name: 'Header',
	data(){
		return {
			// 路由原型，存储路由父子级及重定向信息
			matched: [],
			// 
			option: [
				{ value: -1 , lable: '登出'},
				{ value: 1 , lable: '个人中心'},
			]
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
		},
		
		// 头像菜单选项
		headMenu(command){
			switch (command) {
				// 登出操作
				case -1:
					sessionStorage.removeItem('token');
					this.$router.replace('/login');
					this.$message.success('退出成功');
					break;
				// 个人中心
				case 1:
					this.$message.success('个人中心')
					break;
				default:
					console.warn('[header] 意外的命令');
					break;
			}
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
	position: relative;


	// 面包屑位置
	.breadcrumb{
		margin-left: 10px;

	}

	.dropdown{
		position: absolute;
		right: 20px;
	}

	.dropdown-head{
		display: flex;
		align-items: center;
		padding: 10px;
		border-radius: 6px;
	}
}
</style>