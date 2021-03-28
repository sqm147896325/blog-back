<template>
	<div class="Layout">
		<el-container>
				<l-aside />
			<el-container direction="vertical">
				<l-header />
				<el-main>
					<router-view />
				</el-main>
				<l-footer />
			</el-container>
		</el-container>
	</div>
</template>

<script>
import Aside from './components/Aside';
import Header from './components/Header';
import Footer from './components/Footer';

export default {
	name: 'Layout',
	components:{
		'l-aside': Aside,
		'l-header': Header,
		'l-footer': Footer
	}
}
</script>

<style lang="less" scoped>
.Layout{
	min-width: 800px;
}
</style>