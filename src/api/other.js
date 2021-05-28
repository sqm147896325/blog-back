import axios from '../utils/request'


/**
 * @description: 登录接口 
 * @param {*} params
 * @return {*}
 */
export function apiGetApi(params) {
	return axios({
		url: '/api/index',
		method: 'get',
		data: params
	})
};