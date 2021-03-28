import axios from '../utils/request'

export function apiPostLogin(params) {
	return axios({
	  url: '/user/login',
	  method: 'POST',
	  data: params
	})
  }