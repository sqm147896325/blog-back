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
 * @param {*}		page		要搜索的页码
 * @param {*}		pagesize	每页大小
 * @param {*}		query		查询内容
 * @param {*}		key			查询字段
 * @return {*}
 */
export function apiGetUserList(params) {
	return axios({
		url: '/user/list',
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
		url: '/user',
		method: 'DELETE',
		data: params
	})
}