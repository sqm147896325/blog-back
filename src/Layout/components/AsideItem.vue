<template>
	<div >
		<div class="aside-item" v-for="item in routesMenu" :key='item.name'>
			<el-menu-item v-if="typeof item.children == 'undefined'" :index="item.path" @click="chooseMenu(item.path)">
				<i :class="item.icon || 'el-icon-menu'"></i>
				<span slot="title">{{item.name}}</span>
			</el-menu-item>
			<el-menu-item v-else-if="item.children.length == 1" :index="item.children[0].path" @click="chooseMenu(item.children[0].path)">
				<i :class="item.children[0].icon || 'el-icon-menu'"></i>
				<span slot="title">{{item.children[0].name}}</span>
			</el-menu-item>
			<el-submenu v-else :index="item.name"  @click="chooseMenu(item.path)">
				<template slot="title">
					<i :class="item.icon || 'el-icon-menu'"></i>
					<span slot="title">{{item.name}}</span>
				</template>
				<aside-item :itemMenu="item.children"/>
			</el-submenu>
		</div>
	</div>
</template>

<script>

export default {
	// 递归调用AsideItem组件完成菜单的创建,组件递归调用自己时仅需要name
	name: 'AsideItem',
	props:{
		itemMenu: {
			type: Array,
			default: () => []
		}
	},
	data(){
		return {
			// 要在侧边栏渲染出的菜单
			routesMenu: [],
		}
	},
	mounted(){
		this.init();
	},
	methods:{
		init(){
			if(this.itemMenu.length == 0){
				// 初始时，根据vuex中存储的菜单信息生成目录
				this.routesMenu = this.$store.state.aside.menu;
			}else{
				// 递归调用时，使用递归的props进行生成
				this.routesMenu = this.itemMenu;
			}
		},
		// 选择菜单子项时的点击事件
		chooseMenu(path){
			this.$store.commit('setActiveMenu',path);
		},
	}
}
</script>

<style lang="less" scoped>
/**
*	这里将element菜单组件单独提出使用会导致收起时样式不正常,
*	这里自定义收起样式解决该问题
*/
.el-menu.el-menu--collapse .el-submenu__title span{
	display: none;
}
</style>