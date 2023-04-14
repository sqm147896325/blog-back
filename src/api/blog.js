import axios from '../utils/request'

const baseUrl = import.meta.env.VITE_APP_BASE_PATH

/**
 * @description: 获取博客列表
 * @param {*}
 * @return {*}
 */
export function apiGetBlogList (params) {
  return axios({
    url: baseUrl + '/blog/list',
    method: 'GET',
    params
  })
}

/**
 * @description: 添加博客
 * @param {*}
 * @return {*}
 */
export function apiPutBlog (params) {
  return axios({
    url: baseUrl + '/blog',
    method: 'PUT',
    data: params
  })
}

/**
 * @description: 修改博客
 * @param {*}
 * @return {*}
 */
export function apiPostBlog (params) {
  return axios({
    url: baseUrl + '/blog',
    method: 'POST',
    data: params
  })
}

/**
 * @description: 获取单个博客
 * @param {*}
 * @return {*}
 */
export function apiGetBlog (params) {
  return axios({
    url: baseUrl + '/blog',
    method: 'GET',
    params
  })
}

/**
 * @description: 删除博客
 * @param {*}
 * @return {*}
 */
export function apiDeleteBlog (params) {
  return axios({
    url: baseUrl + '/blog',
    method: 'DELETE',
    data: params
  })
}

/**
 * @author sqm
 * @description 获取所有标签及标签下对应的博客数量
 * @param {*}
 * @backDes
 */
export function apiGetKeyword (params) {
  return axios({
    url: baseUrl + '/blog/keyword',
    method: 'get',
    data: params
  })
}
