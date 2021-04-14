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
 * @description: 添加用户
 * @param {*}
 * @return {*}
 */
 export function apiPutUser(params) {
	return axios({
		url: '/user',
		method: 'PUT',
		data: params
	})
}

/**
 * @description: 修改用户
 * @param {*}
 * @return {*}
 */
 export function apiPostUser(params) {
	return axios({
		url: '/user',
		method: 'POST',
		data: params
	})
}

/**
 * @description: 获取单个用户
 * @param {*}
 * @return {*}
 */
export function apiGetUser(params) {
	return axios({
		url: '/user',
		method: 'GET',
		data: params
	})
}

/**
 * @description: 删除用户
 * @param {*}
 * @return {*}
 */
 export function apiDeleteUser(params) {
	return axios({
		url: '/user',
		method: 'DELETE',
		data: params
	})
}