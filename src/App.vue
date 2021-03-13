<template>
<div id="app">
		<!-- 
			如果使用Layout组件则使用Layout中的router-view
			否则使用该页面的router-view
		-->
	<router-view />
</div>
</template>

<script>
export default {
	name: 'App'
}
</script>

<style lang="less">
body{
	margin: 0;
}
</style>
