import request from '@/utils/request'

/* 对接验证角色标识是否可用*/
export function isRoleCodeOnly(params) {
  return request({
    url: '/fwRole/isRoleCodeOnly',
    method: 'post',
    params
  })
}

/* 对接新增角色*/
export function addFwRole(params) {
  return request({
    url: '/fwRole/addFwRole',
    method: 'post',
    params
  })
}

/* 对接通过主键删除角色*/
export function deleteFwRoleById(params) {
  return request({
    url: '/fwRole/deleteFwRoleById',
    method: 'post',
    params
  })
}

/* 对接修改角色*/
export function updateFwRole(params) {
  return request({
    url: '/fwRole/updateFwRole',
    method: 'post',
    params
  })
}

/* 对接修改角色用户*/
export function updateFwRoleUser(params) {
  return request({
    url: '/fwRole/updateFwRoleUser',
    method: 'post',
    params
  })
}

/* 对接修改角色资源*/
export function updateFwRoleResource(params) {
  return request({
    url: '/fwRole/updateFwRoleResource',
    method: 'post',
    params
  })
}

/* 对接修改角色菜单*/
export function updateFwRoleMenu(params) {
  return request({
    url: '/fwRole/updateFwRoleMenu',
    method: 'post',
    params
  })
}

/* 对接通过主键查询角色*/
export function getFwRoleById(params) {
  return request({
    url: '/fwRole/getFwRoleById',
    method: 'post',
    params
  })
}

/* 对接通过角色标识查询角色*/
export function getFwRoleByCode(params) {
  return request({
    url: '/fwRole/getFwRoleByCode',
    method: 'post',
    params
  })
}

/* 对接查询角色拥有的资源*/
export function getFwRoleToResource(params) {
  return request({
    url: '/fwRole/getFwRoleToResource',
    method: 'post',
    params
  })
}

/* 对接查询角色拥有的菜单*/
export function getFwRoleToMenu(params) {
  return request({
    url: '/fwRole/getFwRoleToMenu',
    method: 'post',
    params
  })
}

/* 对接查询所有角色（分页）*/
export function findFwRole(params) {
  return request({
    url: '/fwRole/findFwRole',
    method: 'post',
    params
  })
}
