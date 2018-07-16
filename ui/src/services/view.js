import { request, config } from 'utils'

const { api, fileRegistry } = config
const { queryFileUrl } = api

export async function queryFile(params) {
  return request({
    url: queryFileUrl,
    method: 'get',
    data: params,
  })
}

export async function downloadFile(params) {
  return request({
    url: fileRegistry,
    method: 'get',
    data: params,
  })
}
