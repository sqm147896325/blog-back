<template>
	<el-dialog :title="'修改账号'" :visible.sync="visible" width="33%" @close="cancel" @closed="closed">
		<el-form :model="rowData" ref="form" :rules="rules" label-width="80px" :inline="false" size="normal">
			<el-form-item v-for="(value , key ) in formdata" :key="key" :label="value.label" :prop="key">
				<el-input :type="value.type ? value.type : ''" v-model="rowData[key]"></el-input>
			</el-form-item>
			<div class="foot-button">
				<el-button type="primary" @click="submit">确定</el-button>
				<el-button @click="cancel">取消</el-button>
			</div>
		</el-form>
	</el-dialog>
</template>

<script>
/**
 * @description: 基于elementui自定义form组件，用于快速完成固定的表单功能 
 * @param {props}	formdate 	表单格式，如：{ key值: {label: '别名',value: '绑定值'}}
 * @param {props}	row 		表单数据，新增时无数据，修改时从外部传入当前行的数据
 * @param {props}	rules 		校验规则，遵循element form组件中rules所使用的规则
 * @param {props}	show 		遮罩控制，默认false关闭
 * @param {methods}	submitFrom	表单确定
 * @param {methods}	cancelFrom	表单取消
 */
export default {
	name: 'Form',
	props:{
		// 表单显示格式
		formdata: {
			type: Object,
			default: ()=>{},
		},
		// 表单显示数值
		row: {
			type: Object,
			default: ()=>{},
		},
		// 表单对应的规则
		rules: {
			type: Object,
			default: ()=>{},
		},
		show: {
			type: Boolean,
			default: ()=>false
		}
	},
	data(){
		return {
			// ? 深拷贝row为子组件内部数据
			rowData: {...this.row},
			// ? 子组件内部接收遮罩开关c
			visible: this.show,
			// ? 根据row判断当前是添加还是修改,没有值为添加 0 ，有值为修改 1
			type: Object.keys(this.row).length == 0 ? 0 : 1
			
		}
	},
	watch: {
		// ? 内部数据与props动态关联
		row(newValue){
			this.rowData = {...this.row};
			this.type = Object.keys(this.row).length == 0 ? 0 : 1;
		},
		// ? 内部数据与props动态关联
		show(newValue){
			this.visible = newValue;
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
					this.$emit('submitFrom',{...this.rowData},this.type);		// 解构赋值数据，去除__ob__监视器
				}
			})
		},
		// 取消修改，在父组件中定义关闭
		cancel(){
			this.$emit('cancelForm');
		},
		// 关闭动画回调
		closed(){
			this.$refs['form'].resetFields();	// 清除表单验证，动画中清除表单符合观感
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