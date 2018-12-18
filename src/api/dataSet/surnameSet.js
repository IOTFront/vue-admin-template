import request from '@/utils/request'

/* 验证姓氏是否可用				POST*/
export function isFwSurnameOnly(params) {
  return request({
    url: '/fwSurname/isFwSurnameOnly',
    method: 'post',
    params
  })
}

/* 对接新增姓氏					POST*/
export function addFwSurname(params) {
  return request({
    url: '/fwSurname/addFwSurname',
    method: 'post',
    params
  })
}

/* 对接删除姓氏					POST*/
export function deleteFwSurnameById(params) {
  return request({
    url: '/fwSurname/deleteFwSurnameById',
    method: 'post',
    params
  })
}

/* 对接修改姓氏					POST*/
export function updateFwSurname(params) {
  return request({
    url: '/fwSurname/updateFwSurname',
    method: 'post',
    params
  })
}

/* 对接通过主键查询姓氏			GET*/
export function getFwSurnameById(params) {
  return request({
    url: '/fwSurname/getFwSurnameById',
    method: 'post',
    params
  })
}

/* 对接查询所有姓氏（分页）		GET*/
export function findFwSurname(params) {
  return request({
    url: '/fwSurname/findFwSurname',
    method: 'post',
    params
  })
}

