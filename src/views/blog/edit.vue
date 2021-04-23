<template>
	<div>
		<!-- 博客信息 -->
		<el-row>
			<el-col :span="12">
				<el-row>
					<span>标题：</span>
					<el-input class="input-normal" size="small" v-model="title"></el-input>
				</el-row>

				<el-row class="margin-top tag">
					<span>标签：</span>
					<el-select
					class="input-normal"
					size="small"
					v-model="keyword"
					multiple
					filterable
					allow-create
					default-first-option
					placeholder="请选择文章标签">
						<el-option
						v-for="item in options"
						:key="item.value"
						:label="item.value"
						:value="item.value">
						</el-option>
					</el-select>
				</el-row>
			</el-col>

			<el-col :span="12" class="textarea">
				<div class="span-label">描述：</div>
				<el-input type="textarea" size="small" class="textarea-input" :rows="3" v-model="des"></el-input>
			</el-col>
		</el-row>
		
		<!-- 编辑器 -->
		<div id="vditor" class="margin-top"></div>

		<!-- 功能按钮 -->
		<div class="bottom-button">
			<el-button type="success" size="small" @click="save">保存</el-button>
			<el-button type="warning" size="small" @click="back">返回</el-button>
		</div>
	</div>
</template>

<script>
import Vditor from "vditor";
import "vditor/dist/index.css";
import { apiGetBlog , apiPostBlog , apiPutBlog } from '../../api/blog';

export default {
	data(){
		return {
			id: this.$route.params.id,	// 标志博客id，0时为新建博客

			/* 标题 */
			title: '',
			constTitle: '',

			/* 标签 */
			keyword: [],
			constKeyword: [],
			options: [],

			/* 描述 */
			des: '',
			constDes: '',

			/* 编辑器数据 */
			content: '',			// 编辑器中的值
			constContent: '',				// 原本博客中的值
		}
	},
	mounted(){
		this.init();
	},
	beforeRouteLeave(to, from, next){
		this.$confirm(`确定离开编辑页面`, '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(() => {
			next();
		}).catch(() => {
			next(false);
		});
	},
	methods: {
		async init(){
			// 缩入菜单栏
			this.$store.commit('setOpen',true);
			// 初始化编辑器
			this.content = new Vditor("vditor",{
				height: 320,		// 编辑器高度
				toolbarConfig:{
					pin:true
				},
				cache:{
					enable:false
				},
				placeholder: 'Hello,please!',	// 提示
				after:async ()=>{
					// 加载后执行的内容
					if(this.id != 0){
						// 如果不是新增则发送请求获取数据
						let { dataInfo } = await apiGetBlog({id:this.id});
						this.title = this.constTitle = dataInfo.title;
						this.des = this.constDes = dataInfo.des;
						this.keyword = this.constKeyword = dataInfo.keyword.split(',');
						this.constContent = dataInfo.content;
						this.content.setValue(dataInfo.content);
					}else{
						this.content.setValue('');
					}
				}
			});
		},

		// 保存
		async save(){
			let response;
			let params = {
				author_id: this.$store.state.userInfo.id,
				author: this.$store.state.userInfo.username,
				title: this.title,
				content: this.content,
				des: this.des,
				keyword: this.keyword
			}
			if(this.id != 0){
				// 修改模式
				response = await apiPostBlog(params);
			}
			// 新建模式
			response = await apiPutBlog(params);
			console.log(response);
		},
		// 返回
		back(){
			this.$router.replace('/manage/blog');
		},
	}
}
</script>

<style lang="less" scoped>
// 标题输入框
.input-normal{
	width: 320px;
	// margin-left: 10px;
}

// 描述文本框
.textarea{
	// margin-top: 5px;
	display: flex;
	justify-items: center;
	.span-label{
		width: 48px;
		height: 32px;
		line-height: 32px;
	}
	.textarea-input{
		width: 300px;
		height: 100%;
	}
}

// 编辑器的bar被挤下来了，去除粘性布局可以移上去
::v-deep .vditor-toolbar--pin{
	position: relative;
}

// 上边距
.margin-top{
	margin-top: 10px;
}

// 底部按钮
.bottom-button{
	padding-top: 10px;
	display: flex;
	align-items: center;
	justify-content: space-evenly;
}
</style>