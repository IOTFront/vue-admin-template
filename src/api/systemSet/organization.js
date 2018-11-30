import request from '@/utils/request'

/* 查询所有机构（树结构）*/
export function getFwOrgList(params) {
  return request({
    url: '/fwOrg/getFwOrgList',
    method: 'get',
    params
  })
}

/* 通过主键查询机构*/
export function getFwOrgById(params) {
  return request({
    url: '/fwOrg/getFwOrgById',
    method: 'get',
    params
  })
}

/* 通过主键删除机构*/
export function deleteFwOrgById(params) {
  return request({
    url: '/fwOrg/deleteFwOrgById',
    method: 'post',
    params
  })
}

/* 新增机构*/
export function addFwOrg(params) {
  return request({
    url: 'fwOrg/addFwOrg',
    method: 'post',
    params
  })
}

/* 根据ID查询机构信息*/
export function getFwOrgListById(params) {
  return request({
    url: '/fwMenu/getFwOrgListById',
    method: 'get',
    params
  })
}

/* 修改机构*/
export function updateFwOrg(params) {
  return request({
    url: '/fwOrg/updateFwOrg',
    method: 'post',
    params
  })
}

