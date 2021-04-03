import axios from '../utils/request'

/**
 * @description: 获取用户列表
 * @param {*}
 * @return {*}
 */
export function apiGetBlogList(params) {
	return axios({
		url: '/blog/list',
		method: 'GET',
		data: params
	})
}