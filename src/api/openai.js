import axios from '../utils/request'

const baseUrl = import.meta.env.VITE_APP_BASE_PATH

/**
 * @description: 发送对话
 * @param {*} data
 * @return {*}
 */
export function conversation (data) {
  return axios({
    url: baseUrl + '/openai/conversation',
    method: 'post',
    data
  })
};

/**
 * @description: 获取历史对话
 * @param {*} data
 * @return {*}
 */
export function getConversationHistory (data) {
  return axios({
    url: baseUrl + '/openai/getConversationHistory',
    method: 'post',
    data
  })
};

/**
 * @description: 发送ai绘画请求
 * @param {*} data
 * @return {*}
 */
export function painter (data) {
  return axios({
    url: baseUrl + '/openai/painter',
    method: 'post',
    data
  })
};
