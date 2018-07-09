import { request, config } from 'utils'

const { api } = config
const { queryFileUrl, fileRegistryUrl } = api

export async function queryFile(params) {
  return request({
    url: queryFileUrl,
    method: 'get',
    data: params,
  })
}

export async function downloadFile(params) {
  return request({
    url: fileRegistryUrl,
    method: 'get',
    data: params,
  })
}
