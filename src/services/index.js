import { request, config } from 'utils'

const { api } = config
const { indexQuery, batchAdd } = api

export async function queryIndex(params) {
  return request({
    url: indexQuery,
    method: 'get',
    data: params,
  })
}

export async function batchAddFile(params) {
  return request({
    url: batchAdd,
    method: 'post',
    data: params,
  })
}
