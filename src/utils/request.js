import axios from "axios";
import { Message } from 'element-ui';
import router from '@/router/index.js';
import qs from 'qs';

// 请求基础路径
axios.defaults.baseURL = ''; // 不在这里设置,基地址不唯一

// 响应时间设置,由于有文件传输，这里设置为30秒
axios.defaults.timeout = 30000;

// 默认的post传参方式就是application/x-www-form-urlencoded;charset=UTF-8，不过使用该方式时需要用qs对post进行传参序列化
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// token 白名单url
const tokenWL = ['/user/login'];

// request 请求拦截器
//挂载请求拦截器 (相当于请求的预验证，请求到达服务器之前先验证这次请求)
axios.interceptors.request.use(config => {

	// 如果浏览器中有token且该地址不在白名单中，则为请求头添加token
	if(localStorage.getItem("token") && !tokenWL.includes(config.url)){
		//为请求头添加对象，添加token验证的Authorization字段
		config.headers.Authorization = 'Bearer ' + localStorage.getItem("token");
	}

	// 如果是post请求，使用qs序列化对象
	if(config.method  === 'post'){
        config.data = qs.stringify(config.data);
    }
	return config;
});

// response 响应拦截器
axios.interceptors.response.use(
	// 响应处理
	response => {
		const code = response.status;
		// 自定义响应码，233为直接渲染显示错误信息
		if(code == 233){
			Message[response.data.dataInfo.type](response.data.msg);
			return response;
		}
		// 自定义响应码，仅在控制台输出错误信息
		if(code == 250){
			console.warn('[响应提示]',response.data.msg);
			return response;
		}
		if(code == 200){
			return response.data;
		}
		// 默认返回为 response，如果修改默认返回可能导致option请求不通
	},

	//响应错误拦截
	error => {
		// 鉴权失败
		if(error && error.response.status == 401){
			Message.warning(error.response.data.msg);
			localStorage.removeItem('token');
			router.push({
				path: '/login'
			})
			return response;
		}
		return Promise.reject(error);
	}
);

export default axios;