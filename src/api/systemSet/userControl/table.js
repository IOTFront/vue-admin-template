import request from '@/utils/request'

/*  查询所有用户（分页）*/
export function getUserList(params) {
  return request({
    url: '/fwUser/findFwUser',
    method: 'get',
    params
  })
}
/*  新增用户*/
export function addFwUser(params) {
  return request({
    url: '/fwUser/addFwUser',
    method: 'post',
    params
  })
}
/*  修改用户组织机构*/
export function updateFwUserOrg(params) {
  return request({
    url: '/fwUser/updateUserOrg',
    method: 'post',
    params
  })
}
/*  通过主键删除用户*/
export function deleteFwUserById(params) {
  return request({
    url: '/fwUser/deleteFwUserById',
    method: 'get',
    params
  })
}
/*  通过主键查询用户*/
export function getFwUser(params) {
  return request({
    url: '/fwUser/loadUserInfo',
    method: 'get',
    params
  })
}
/*  验证账号是否可用*/
export function isFwUserOnly(params) {
  return request({
    url: '/fwUser/isFwUserOnly',
    method: 'get',
    params
  })
}

/*  修改账号密码*/
export function updateUserPassword(params) {
  return request({
    url: '/fwUser/updateUserPassword',
    method: 'post',
    params
  })
}

