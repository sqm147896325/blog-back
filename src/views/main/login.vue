<template>
	<div class="login">
		<div class="title">LS后台</div>
		<div class="card">
			<el-form :model="loginInfo" :rules="rules" ref="loginForm" class='loginForm'>
				<el-form-item prop="id" class="item">
					<el-input placeholder="请输入内容" v-model="loginInfo.id" @keyup.enter.native="login">
						<template slot="prepend">账号</template>
					</el-input>
				</el-form-item>
				<el-form-item prop="password" class="item">
					<el-input placeholder="请输入内容" v-model="loginInfo.password" @keyup.enter.native="login" show-password>
						<template slot="prepend">密码</template>
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-button @click="register" type="info">注册</el-button>
					<el-button @click="login" type="info">登录</el-button>
					<el-button @click="forget" type="info">忘记密码</el-button>
				</el-form-item>
			</el-form>
		</div>
		<my-form :title="title" :formdata="formdata" :row="bindData" :rules="rules" :visible.sync="dialogVisible" @cancelForm="handleClose" @submitFrom="submitFrom"></my-form>
	</div>
</template>

<script>
import { apiPostLogin } from '@/api/user.js';
import From from '@/components/Form/Form.vue';

export default {
	name: 'Login',
	components: { 'my-form': From },
	data(){
		return{
			loginInfo: {
				id: new String,
				password: new String
			},
			rules: {
				id: [
					{ required: true, message: '请输入账号id', trigger: 'blur' },
					{ min: 1, message: '请输入账号id', trigger: 'blur' }
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{ min: 6, max: 20, message: '密码在6-20个字符', trigger: 'blur' }
				],
			},
			formdata: {
				username: {label: '用户名',value: ''},
				emil: {label: '邮箱',value: ''},
				password: {label: '密码',value: '', type: 'password'},
				rePassword: {label: '确认密码',value: '', type: 'password'},
			},	// 表单
			bindData: {
				username: '',
				emil: '',
				password: '',
				rePassword: '',
			},
			title: '注册',
			dialogVisible: false
		}
	},
	mounted(){
		this.init();
	},
	methods: {
		init(){

		},
		login(){
			this.$refs['loginForm'].validate(async (valid) => {
				if (!valid) {
					console.log('[login] 校验失败')
				}else{
					let res = await apiPostLogin(this.loginInfo);
					// 存在res且flag为1则表示登录成功
					if(res?.flag == 1){
						localStorage.setItem('token',res.dataInfo.token);
						let userInfo = res.dataInfo.userInfo;
						localStorage.setItem('userInfo',JSON.stringify(userInfo));
						this.$store.commit('user/setUserInfo',userInfo);
						this.$router.push('/');
						this.$message.success('登录成功');
					}
				}
			});
		},
		register() {
			this.dialogVisible = true
			this.title = '注册'
		},
		forget() {
			this.dialogVisible = true
			this.title = '忘记密码'
		},
		handleClose() {

		},
		submitFrom() {

		}
	}
}
</script>

<style lang="less" scoped>
.login{
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	width: 100vw;
	background: @bg-other;
}
.title{
	position: absolute;
	top: 120px;
	font-size: @fz-big-title;
	font-family: '微软雅黑';
	letter-spacing: 10px;
	background-clip: text;
	color: @c-black;
}
.card{
	height: 200px;
	width: 300px;
	background: @bg-bar;
	padding: 20px;
	box-shadow: 10px 10px 5px #666666;
	opacity: 0.9;
	border-radius: 10px;

}
.loginForm{
	padding-top: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
	.item{
		width: 100%;
	}
}

v:deep .el-form-item__error{
	color: rgb(53, 220, 20);
}
</style>
