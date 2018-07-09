import { request, config } from 'utils'

const { api } = config
const { queryAllFileUrl, deleteFileUrl, batchAddFileUrl } = api

export async function queryAllFile(params) {
  return request({
    url: queryAllFileUrl,
    method: 'get',
    data: params,
  })
}

export async function deleteFile(params) {
  return request({
    url: deleteFileUrl,
    method: 'delete',
    data: params,
  })
}


export async function batchAddFile(params) {
  return request({
    url: batchAddFileUrl,
    method: 'post',
    data: params,
  })
}
