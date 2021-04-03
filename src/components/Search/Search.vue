<template>
	<el-input size="small" :placeholder="'请输入' + option[select] " v-model="input" :clearable="true" @clear="search" @keydown.enter.native="search" class="input-with-select">
		<el-select v-model="select" slot="prepend" placeholder="请选择" @change="change">
			<el-option v-for="(item , index) in option" :label="item" :value="index" :key="index" ></el-option>
		</el-select>
		<el-button type="primary" size="small" @click="search" slot="append" icon="el-icon-search">搜索</el-button>
	</el-input>
</template>

<script>
export default {
	name: 'Search',
	props:{
		holder:{
			type: String,
			default: ''
		},
		option: {
			type: Array,
			default: ()=>[]
		}
	},
	data(){
		return{
			input: '',
			select: 0
		}
	},
	methods: {
		change(){
			// 向父组件传递输入的值
			this.$emit('change',this.select);
		},
		search(){
			// 向父组件传递输入的值
			this.$emit('search',this.input);
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