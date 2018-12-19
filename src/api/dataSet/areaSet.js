import request from '@/utils/request'

/* 对接验证区划名称是否可用			POST*/
export function isFwRegionOnly(params) {
  return request({
    url: '/fwRegion/isFwRegionOnly',
    params
  })
}

/* 对接区划基础信息初始化			POST*/
export function loadRegionInfo(params) {
  return request({
    url: '/fwRegion/loadRegionInfo',
    params
  })
}

/* 对接通过主键查询区划				GET*/
export function getFwRegion(params) {
  return request({
    url: '/fwRegion/getFwRegion',
    params
  })
}

/* 对接查询下级区划（一层）			GET*/
export function getFwRegionLower(params) {
  return request({
    url: '/fwRegion/getFwRegionLower',
    params
  })
}

/* 对接查询下级区划（递归）			GET*/
export function getFwRegionLowerAll(params) {
  return request({
    url: '/fwRegion/getFwRegionLowerAll',
    params
  })
}

/* 对接搜索区划（模糊匹配）			GET*/
export function getFwRegionQuery(params) {
  return request({
    url: '/fwRegion/getFwRegionQuery',
    params
  })
}

/* 对接新增区划						POST*/
export function addFwRegionOn(params) {
  return request({
    url: '/fwRegion/addFwRegionOn',
    params
  })
}

/* 对接删除区划						POST*/
export function deleteFwRegionById(params) {
  return request({
    url: '/fwRegion/deleteFwRegionById',
    params
  })
}

/* 对接修改区划						POST*/
export function updateFwRegion(params) {
  return request({
    url: '/fwRegion/updateFwRegion',
    params
  })
}
