import { request, config } from 'utils'

const { api } = config
const { userStatusUrl, userLoginUrl, userLogoutUrl } = api

export async function queryStatus(params) {
  return request({
    url: userStatusUrl,
    method: 'get',
    data: params,
  })
}

export async function loginUser(params) {
  return request({
    url: userLoginUrl,
    method: 'post',
    data: params,
  })
}

export async function logoutUser(params) {
  return request({
    url: userLogoutUrl,
    method: 'delete',
    data: params,
  })
}
