<template>
	<div class="aside">
		<el-aside class="main" width="100%">
			<el-menu :default-active="defaultActive()" class="menu" @open="handleOpen" :collapse="collapse()" :router="true">
				<aside-item />
			</el-menu>
		</el-aside>
	</div>
</template>

<script>
import AsideItem from './AsideItem.vue';

export default {
	name: 'Aside',
	components: { AsideItem },
	data() {
		return {
		};
	},
	mounted(){
	},
	methods: {
		// 打开菜单回调
		handleOpen(key, keyPath) {
			console.log(key, keyPath);
		},
		// 关闭菜单回调
		handleClose(key, keyPath) {
			console.log(key, keyPath);
		},

		/* store中的状态 */
		// 默认选中的菜单
		defaultActive(){
			return this.$store.state.aside.activeMenu;
		},
		// 侧边栏是否展开
		collapse(){
			return this.$store.state.aside.asideClose;
		}
	}
}
</script>

<style lang='less' scoped>
// 自定义侧边栏样式
/deep/ .menu{
	height: 100vh;
	background: @bg-bar;
	color: @c-white;
	font-size: @fz-big;
	/deep/ & i{
		color: @c-black;
	}
	/deep/ & span{
		color: @c-black;
	}
	/deep/ & .el-menu-item.is-active{
		color: @c-black;
		span,i {
			font-weight: 1000;
		}
	}
	// 消除侧边栏聚焦颜色
	/deep/ & .el-menu-item:focus {
		background: rgba(0, 0, 0, 0);
	}
}
// 自定义展开时宽度
/deep/ .el-menu:not(.el-menu--collapse){
	width: 200px;
}
</style>