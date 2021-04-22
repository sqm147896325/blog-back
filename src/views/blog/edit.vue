<template>
	<div>
		edit
	</div>
</template>

<script>
export default {
	data(){
		return {
			id: this.$route.params.id
		}
	},
	mounted(){
		this.init();
	},
	methods: {
		init(){
			console.log(this.id)
		},
	}
}
</script>

<style lang="less" scoped>

</style>