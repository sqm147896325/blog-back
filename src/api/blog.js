import axios from '../utils/request'

/**
 * @description: 获取博客列表
 * @param {*}
 * @return {*}
 */
export function apiGetBlogList(params) {
	return axios({
		url: '/blog/list',
		method: 'GET',
		params: params
	})
}

/**
 * @description: 添加博客
 * @param {*}
 * @return {*}
 */
 export function apiPutBlog(params) {
	return axios({
		url: '/blog',
		method: 'PUT',
		data: params
	})
}

/**
 * @description: 修改博客
 * @param {*}
 * @return {*}
 */
 export function apiPostBlog(params) {
	return axios({
		url: '/blog',
		method: 'POST',
		data: params
	})
}

/**
 * @description: 获取单个博客
 * @param {*}
 * @return {*}
 */
export function apiGetBlog(params) {
	return axios({
		url: '/blog',
		method: 'GET',
		params: params
	})
}

/**
 * @description: 删除博客
 * @param {*}
 * @return {*}
 */
 export function apiDeleteBlog(params) {
	return axios({
		url: '/blog',
		method: 'DELETE',
		data: params
	})
}