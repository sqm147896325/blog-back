import axios from '../utils/request'

const baseUrl = import.meta.env.VITE_APP_BASE_PATH

/**
 * @description: 查询对话列表
 * @param {*} data
 * @return {*}
 */
export function conversationList (params) {
  return axios({
    url: baseUrl + '/conversation/list',
    method: 'get',
    params
  })
};

/**
 * @description: 创建对话
 * @param {*} data
 * @return {*}
 */
export function conversationCreate (data) {
  return axios({
    url: baseUrl + '/conversation/create',
    method: 'post',
    data
  })
};

/**
 * @description: 创建对话
 * @param {*} data
 * @return {*}
 */
export function conversationDelete (data) {
  return axios({
    url: baseUrl + '/conversation/delete',
    method: 'delete',
    data
  })
};
