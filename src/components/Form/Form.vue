/**
 * @description: 自定义form组件，用于快速完成简单的表单功能 
 * @param {*}	
 *	formdate表单数据如：{ username: {label: '用户名',value: ''} , id: {label: '账号id',value: ''} }
 *	rules校验规则，遵循element form组件中rules所使用的规则
 * @return {*}	submitFrom确定按钮、cancelFrom取消按钮
 */

<template>
	<el-form :model="formdata" ref="form" :rules="rules" label-width="60px" :inline="false" size="normal">
		<el-form-item v-for="(item , index ) in formdata" :key="index" :label="item.label">
			<el-input v-model="item.value"></el-input>
		</el-form-item>
		<div class="foot-button">
			<el-button type="primary" @click="submit">确定</el-button>
			<el-button @click="cancel">取消</el-button>
		</div>
	</el-form>
</template>

<script>
export default {
	name: 'Form',
	props:{
		// 表单显示所需要的数据
		formdata: {
			type: Object,
			default: ()=>{},
		},
		// 表单对应的规则
		rules: {
			type: Object,
			default: ()=>{},
		}
	},
	data(){
		return{

		}
	},
	methods: {
		// 确定修改
		submit(){
			this.$refs['form'].validate(state => {
				if(state){
					this.$emit('submitFrom',this.formdata);
				}
			})
		},
		// 取消修改，在父组件中定义关闭
		cancel(){
			this.$emit('cancelFrom');
		}
	}
}
</script>

<style lang="less" scoped>
.foot-button{
	display: flex;
	justify-content: center;
}
</style>