import axios from '../utils/request'

const baseUrl = import.meta.env.VITE_APP_BASE_PATH

/**
 * @description: 登录接口 
 * @param {*} params
 * @return {*}
 */
export function apiPostLogin(params) {
	return axios({
		url: baseUrl + '/login',
		method: 'POST',
		data: params,
		config: {
			md5: ['password']
		}
	})
};

/**
 * @description: 获取用户列表
 * @param {*}		page		要搜索的页码
 * @param {*}		pagesize	每页大小
 * @param {*}		query		查询内容
 * @param {*}		key			查询字段
 * @return {*}
 */
export function apiGetUserList(params) {
	return axios({
		url: baseUrl + '/user/list',
		method: 'GET',
		params: params
	})
}

/**
 * @description: 添加用户
 * @param {*}
 * @return {*}
 */
 export function apiPutUser(params) {
	return axios({
		url: baseUrl + '/user',
		method: 'PUT',
		data: params,
		config: {
			md5: ['password']
		}
	})
}

/**
 * @description: 修改用户
 * @param {*}
 * @return {*}
 */
 export function apiPostUser(params) {
	return axios({
		url: baseUrl + '/user',
		method: 'POST',
		data: params,
		config: {
			md5: ['password']
		}
	})
}

/**
 * @description: 获取单个用户
 * @param {*}
 * @return {*}
 */
export function apiGetUser(params) {
	return axios({
		url: baseUrl + '/user',
		method: 'GET',
		params: params
	})
}

/**
 * @description: 删除用户
 * @param {*}
 * @return {*}
 */
 export function apiDeleteUser(params) {
	return axios({
		url: baseUrl + '/user',
		method: 'DELETE',
		data: params
	})
}

/**
 * @description: 设置用户权限
 * @param {*}
 * @return {*}
 */
 export function apiPostPower(params) {
	return axios({
		url: baseUrl + '/user/power',
		method: 'POST',
		data: params
	})
}

/**
 * @description: 发送用户验证码
 * @param {*}	params
 * @return {*}
 */
 export function apiToolEmailVerify(params) {
	return axios({
		url: baseUrl + '/user/emailVerify',
		method: 'post',
		data: params
	})
};

/**
 * @description: 邮箱验证码设置用户信息
 * @param {*}	params
 * @return {*}
 */
 export function apiToolEmailSetUser(params) {
	return axios({
		url: baseUrl + '/user/emailSetUser',
		method: 'post',
		data: params,
		config: {
			md5: ['password']
		}
	})
};