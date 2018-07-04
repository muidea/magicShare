import { request, config } from 'utils'

const { api } = config
const { noFoundPageUrl } = api

export async function queryNoFound(params) {
  return request({
    url: noFoundPageUrl,
    method: 'get',
    data: params,
  })
}
