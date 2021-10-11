<template>
	<el-dialog
		title="消息控制台"
		width="80%"
		:close-on-click-modal="false"
		v-on="$listeners"
		v-bind="$attrs"
	>
		<div class="message-content">
			
		</div>
	</el-dialog>
  
</template>

<script>
export default {
	data() {
		return {

		}
	},
	mounted() {

	},
	methods: {

	}
}
</script>

<style lang="less" scoped>
.message-content{
	height: 60vh;
}
</style>