/**
 * @description: 自定义form组件，用于快速完成简单的表单功能 
 * @param {*}	
 *	formdate 表单数据如：{ username: {label: '用户名',value: ''} , id: {label: '账号id',value: ''} }
 *	rules 校验规则，遵循element form组件中rules所使用的规则
 * @return {*}	submitFrom确定按钮、cancelFrom取消按钮
 */

<template>
	<el-form :model="data" ref="form" :rules="rules" label-width="80px" :inline="false" size="normal">
		<el-form-item v-for="(value , key) in formdata" :key="key" :label="value.label" :prop="key">
			<el-input v-model="data[key]"></el-input>
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
			formKey: Object.keys(this.formdata),
			data: {}
		}
	},
	mounted(){
		this.init();
	},
	methods: {
		init(){
		},
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