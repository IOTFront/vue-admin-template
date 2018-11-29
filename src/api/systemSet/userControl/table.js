import request from '@/utils/request'

export function getUserList(params) {
  return request({
    url: '/fwUser/findFwUser',
    method: 'get',
    params
  })
}
