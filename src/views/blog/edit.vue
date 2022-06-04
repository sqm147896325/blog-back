<template>
	<div>
		<!-- 博客信息 -->
		<el-row class="margin-bottom">
			<el-col :span="8">
				<!-- 标题 -->
				<el-row>
					<span>标题：</span>
					<el-input class="input-normal" size="small" v-model="title"></el-input>
				</el-row>

				<!-- 标签 -->
				<el-row class="margin-top tag">
					<span>标签：</span>
					<tags-input placeholder="请输入标签" :keyword="keyword" :options="options" @change="changeTags"></tags-input>
				</el-row>
			</el-col>

			<!-- 描述 -->
			<el-col :span="8" class="textarea">
					<div class="span-label">描述：</div>
					<el-input type="textarea" size="small" class="textarea-input" :rows="4" v-model="des"></el-input>
			</el-col>

			<!-- 上传 -->
			<el-col :span="8">
				<read-one-file accept=".txt,.md" @readText="readText"></read-one-file>
			</el-col>
		</el-row>
		
		<!-- 编辑器 -->
		<div class="md-edit">
			<div id="vditor" class="margin-bottom"></div>
		</div>

		<!-- 功能按钮 -->
		<div class="bottom-button">
			<el-button type="success" size="small" @click="save" :disabled="dataChange">保存</el-button>
			<el-button type="warning" size="small" @click="back">返回</el-button>
		</div>
	</div>
</template>

<script>
import Vditor from "vditor";
import "vditor/dist/index.css";
import { apiGetBlog , apiPostBlog , apiPutBlog , apiGetKeyword } from '../../api/blog';
import readOneFile from '../../components/readOneFile/readOneFile.vue';
import TagsInput from '../../components/TagsInput/TagsInput.vue';

export default {
	components: { readOneFile , TagsInput },
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
			content: '',			// 编辑器对象
			constContent: '',		// 初始请求到的值
			editChange: false,		// 编辑器是否改变
			contentLenght: 0		// 内容字数
		}
	},
	computed: {
		dataChange(){
			// 判断数据是否发生了改变
			const titleFalg = this.title == this.constTitle
			const keywordFlag = JSON.stringify(this.keyword) == JSON.stringify(this.constKeyword)
			const desFlag = this.des == this.constDes
			return titleFalg && keywordFlag && desFlag && !this.editChange;
		}
	},
	mounted(){
		
	},
	activated() {
		this.init();
	},
	// 组件路由守卫（离开）
	beforeRouteLeave(to, from, next){
		// 离开页面提示
		if(to.path == '/login' || to.query.save == 'true' || this.dataChange == true){
			// 跳转首页时，设置query的save为true时，值未发生改变时；这三种情况直接跳转	
			next();
			return false;
		}
		this.$confirm(`确定不保存离开编辑页面吗？`, '提示', {
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
			this.$store.commit('aside/setOpen',true);
			// 重新为data赋值
			this.id = this.$route.params.id
			await this.initEdit();
			const { dataInfo } = await apiGetKeyword();
			this.options  = Object.keys(dataInfo);
		},

		// 改变标签回调
		changeTags(data){
			this.keyword = data;
		},
		// 读取成功回调
		readText(fileName, data){
			this.content.setValue(data);	// 设置内容
			this.title = fileName.substring(0,fileName.lastIndexOf('.'));;	// 设置去后缀后的标题
			this.$message.success('读取成功');
			this.checkEdit();
		},
		// 初始化Vditor编辑器
		async initEdit(){
			// 初始化编辑器
			this.content = new Vditor("vditor",{
				// height: 400,		// 编辑器高度, 这里不给在css自定义
				toolbarConfig:{
					pin:true
				},
				cache:{
					enable:false
				},
				placeholder: 'Hello,please!',	// 提示
				// 开启计数器
				counter: {
					enable: true,
					type: 'markdown',	// 统计类型
					after: (lenght) => {
						this.contentLenght = lenght; // 使用回调统计文章字数
					}
				},
				// 输入触发（延迟较大）
				input: () => {
					this.checkEdit();
				},
				blur: () => {
					this.checkEdit();
				},
				after:async ()=>{
					// 加载后执行的内容
					if(this.id != 0){
						// 如果不是新增则发送请求获取数据
						await this.initData();
					}else{
						this.content.setValue('');
					}
				}
			});
		},
		// 检测编辑器内的值是否发生改变
		checkEdit(){
			if(this.constContent == this.content.getValue()){
				// 值未改变
				this.editChange = false;
			}else{
				// 值发生改变
				this.editChange = true;
			}
		},

		// 保存
		async save(){
			// 检查规则
			if(this.checkFail()){
				return false;
			}
			let params = {
				author_id: this.$store.state.user.userInfo.id,
				// author: this.$store.state.user.userInfo.username,
				title: this.title,
				content: this.content.getValue(),
				des: this.des,
				keyword: this.keyword.toString(),
				lenght: this.contentLenght
			}
			if(this.id != 0){
				// 修改模式
				params.id = this.id;
				await apiPostBlog(params);
				this.initData();
				return false
			}
			// 新建模式
			let { data } = await apiPutBlog(params);
			this.id = data.dataInfo.id;							// 获取新建后的id
			this.$router.replace(`/edit/${this.id}?type=1`);	// 替换路由params与query，更改为修改模式
			await this.initData();	// 数据初始化
		},
		// 返回
		back(){
			// 页面可能不进行跳转，需要用catch捕捉导航故障
			this.$router.replace('/manage/blog').catch(err => {});
		},

		// 检测提交的数据是否符合规则
		checkFail(){
			if(this.title == ''){
				this.$message.error('标题不能为空');
				return true;
			}
		},

		// 获取初始化数据,注：不能直接调用，需要再edit初始化后才可以调用
		async initData(){
			let { dataInfo } = await apiGetBlog({id:this.id});
			if(!dataInfo){
				// 如果不存在该博客则进行跳转
				this.$router.replace('/dashboard?save=true');
				return false;
			}
			if(dataInfo.author_id != this.$store.state.user.userInfo.id && !this.$store.state.user.isAdmin){
				// 如果id校验正确且不为超级管理员则进行拦截
				this.$router.replace('/dashboard?save=true');
				return false;
			}

			/* 满足进入该页面的要求则进行访问 */
			this.title = this.constTitle = dataInfo.title;
			this.des = this.constDes = dataInfo.des;
			// 分割关键字时要考虑没有关键字的情况
			this.keyword = this.constKeyword = dataInfo.keyword == '' ? [] : dataInfo.keyword.split(',');
			this.constContent = dataInfo.content;
			this.content.setValue(dataInfo.content);
			// 将编辑器更改的标识符重置为未更改，即false
			this.editChange = false;
			return dataInfo;
		}
	}
}
</script>

<style lang="less" scoped>
// 标题输入框
.input-normal{
	width: 220px;
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
		width: 240px;
	}
}

// 编辑器的bar被挤下来了，去除粘性布局可以移上去
::v-deep .vditor-toolbar--pin{
	position: relative;
}
#vditor{
	height: calc(100vh - 270px);
}
.md-edit{
	// height: 70vh;
}

// 上边距
.margin-top{
	margin-top: 10px;
}
.margin-bottom{
	margin-bottom: 10px;
}

// 底部按钮
.bottom-button{
	padding-top: 10px;
	display: flex;
	align-items: center;
	justify-content: space-evenly;
}
</style>