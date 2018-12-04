import request from '@/utils/request'

/* 查询所有资源（树结构）*/
export function getFwResList(params) {
  return request({
    url: '/fwResource/getFwResList',
    method: 'get',
    params
  })
}

/* 验证资源链接是否可用*/
export function isFwResOnly(params) {
  return request({
    url: '/fwResource/isFwResOnly',
    method: 'get',
    params
  })
}

/* 新增资源*/
export function addFwRes(params) {
  return request({
    url: '/fwResource/addFwRes',
    method: 'post',
    params
  })
}

/* 通过主键删除资源*/
export function deleteFwResById(params) {
  return request({
    url: '/fwResource/deleteFwResById',
    method: 'post',
    params
  })
}

/* 修改资源*/
export function updateFwRes(params) {
  return request({
    url: '/fwResource/updateFwRes',
    method: 'get',
    params
  })
}

/* 通过主键查询资源*/
export function getFwResById(params) {
  return request({
    url: '/fwResource/getFwResById',
    method: 'get',
    params
  })
}

/* 查询子级资源*/
export function findFwResList(params) {
  return request({
    url: '/fwResource/findFwResList',
    method: 'post',
    params
  })
}

