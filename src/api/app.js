import axios from '../utils/request'


/**
 * @description: 获取api 
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

/**
 * @description: 获取网盘单个文件或文件夹信息
 * @param {*}	params
 * @return {*}
 */
 export function apiPostFlie(params) {
	return axios({
		url: '/file/index',
		method: 'post',
		data: params
	})
};

/**
 * @description: 删除网盘文件或文件夹
 * @param {*}	params
 * @return {*}
 */
 export function apiDeleteFile(params) {
	return axios({
		url: '/file/index',
		method: 'delete',
		data: params
	})
};

/**
 * @description: 创建网盘文件
 * @param {*}	params
 * @return {*}
 */
 export function apiPutFlie(params) {
	return axios({
		headers: {"content-type": "multipart/form-data"},
		url: '/file/index',
		method: 'put',
		data: params
	})
};

/**
 * @description: 创建网盘文件夹
 * @param {*}	params
 * @return {*}
 */
 export function apiPutDir(params) {
	return axios({
		url: '/file/index',
		method: 'put',
		data: params
	})
};

/**
 * @description: 下载文件（不推荐使用该方法，转而使用window.open更方便些）
 * @param {*}	params
 * @return {*}
 */
 export function apiFileDownload(params,success) {
	return axios({
		responseType: 'blob',
		url: '/file/download',
		method: 'get',
		data: params
	})
};

/**
 * @description: 发送邮件
 * @param {*}	params
 * @return {*}
 */
 export function apiToolEmailVerify(params) {
	return axios({
		url: '/tool/emailVerify',
		method: 'get',
		data: params
	})
};

/**
 * @description: 发送邮件验证码
 * @param {*}	params
 * @return {*}
 */
 export function apiToolEmail(params) {
	return axios({
		url: '/tool/email',
		method: 'get',
		data: params
	})
};
