import axios from '../utils/request'


/**
 * @description: 登录接口 
 * @param {*} params
 * @return {*}
 */
export function apiPostLogin(params) {
	return axios({
		url: '/user/login',
		method: 'POST',
		data: params
	})
};

/**
 * @description: 获取用户列表
 * @param {*}
 * @return {*}
 */
export function apiGetUserList(params) {
	return axios({
		url: '/user/list',
		method: 'GET',
		data: params
	})
}

/**
 * @description: 修改用户，也做删除
 * @param {*}
 * @return {*}
 */
export function apiPostUpdataUser(params) {
	return axios({
		url: '/user/updateUser',
		method: 'POST',
		data: params
	})
}