<template>
	<div class="Layout">
		<el-container>
				<l-aside />
			<el-container class="container" direction="vertical">
				<l-header />
				<el-main>
					<transition name="fade" mode="out-in">
						<keep-alive>
							<router-view class="view"></router-view>
						</keep-alive>
					</transition>
					<l-footer />
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
import Aside from './components/Aside.vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

export default {
	name: 'Layout',
	components:{
		'l-aside': Aside,
		'l-header': Header,
		'l-footer': Footer
	},
	watch: {
		"$route":function(to,from){
			const toDepth = to.path.split('/').length;
			const fromDepth = from.path.split('/').length;
			this.transition = toDepth < fromDepth ? 'slide-right' : 'slide-left';
		}
	}
}
</script>

<style lang="less" scoped>
.Layout{
	min-width: 1050px;
}
.container{
	height: 100vh;
}
.view{
	min-height: 84vh;
}
.fade-enter-active, .fade-leave-active {
	transition: opacity .2s;
}
.fade-enter, .fade-leave-to  {
	opacity: 0;
}
// 覆盖el-main样式
.el-main{
	padding: 10px;
}
</style>