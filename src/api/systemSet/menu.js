import request from '@/utils/request'

/* 获取目录树*/
export function getMenuTree(params) {
  return request({
    url: '/fwMenu/getFwMenuList',
    method: 'get',
    params
  })
}

/* 根据目录ID获取下级目录列表*/
export function getMenuList(params) {
  return request({
    url: '/fwMenu/findFwMenyList',
    method: 'get',
    params
  })
}

/* 根据目录ID获取下级目录列表*/
export function delMenuById(params) {
  return request({
    url: '/fwMenu/deleteFwMenuById',
    method: 'post',
    params
  })
}

/* 新增菜单*/
export function creatMenu(params) {
  return request({
    url: '/fwMenu/addFwMenu',
    method: 'post',
    params
  })
}

/* 根据ID查询菜单信息*/
export function getFwMenuById(params) {
  return request({
    url: '/fwMenu/getFwMenuById',
    method: 'get',
    params
  })
}

/* 修改菜单信息*/
export function updateFwMenu(params) {
  return request({
    url: '/fwMenu/updateFwMenu',
    method: 'post',
    params
  })
}

