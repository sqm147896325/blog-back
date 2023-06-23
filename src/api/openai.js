import axios from '../utils/request'

const baseUrl = import.meta.env.VITE_APP_BASE_PATH

/**
 * @description: 发送对话
 * @param {*} data
 * @return {*}
 */
export function converse (data) {
  return axios({
    url: baseUrl + '/openai/converse',
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
