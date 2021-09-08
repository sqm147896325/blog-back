<template>
	<el-input
		class="input-with-select"
		size="small"
		v-on="$listeners"
		v-bind="$attrs"
		:placeholder="'请输入' + option[select].label"
		:clearable="true"
		@clear="search"
		@keydown.enter.native="search"
	>
		<el-select v-model="select" slot="prepend" placeholder="请选择" @change="selectchange">
			<el-option v-for="(item , index) in option" :label="item.label" :value="index" :key="index" ></el-option>
		</el-select>
		<el-button type="primary" size="small" @click="search" slot="append" icon="el-icon-search">搜索</el-button>
	</el-input>
</template>

<script>
/**
 * @description: 基于element-ui的自定义搜索组件
 * @param {props}		option			搜索类型,[{lable：'显示的名称',value: '对应的值'}]
 * @param {method}		selectchange	更改搜索类型，返回更改后对应的值
 * @param {method}		search			搜索
 */
export default {
	name: 'Search',
	props:{
		option: {
			type: Array,
			default: ()=>[]
		},
	},
	data(){
		return{
			input: '',
			select: 0
		}
	},
	mounted(){
		// 如果有value，则使input的值为value
		// this.input = this.value;
	},
	methods: {
		selectchange(e){
			// 向父组件传递输入的值
			this.$emit('selectchange',this.option[e].value);
		},
		search(){
			// 向父组件传递输入的值
			this.$emit('search');
		}
	}
}
</script>

<style lang="less" scoped>
.row{
	padding: 20px 0px !important;
	margin: 0 !important;
}
/deep/ .el-select .el-input {
    width: 130px;
  }
/deep/ .el-input-group__prepend {
	background-color: #fff;
}
/deep/ .el-input-group__append {
	background-color: #409EFF;
	color: #FFF;
}
</style>