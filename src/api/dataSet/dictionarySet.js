import request from '@/utils/request'

/* 对接验证字典分类标识是否可用		POST*/
export function isFwDictClasszOnly(params) {
  return request({
    url: '/fwDictionaryClassz/isFwDictClasszOnly',
    params
  })
}

/* 对接新增字典分类					POST*/
export function addFwDictClassz(params) {
  return request({
    url: '/isFwDictClasszOnly/addFwDictClassz',
    params
  })
}

/* 对接通过主键删除字典分类			POST*/
export function deleteFwDictClasszById(params) {
  return request({
    url: '/fwDictionaryClassz/deleteFwDictClasszById',
    params
  })
}

/* 对接修改字典分类					POST*/
export function updateFwDictClassz(params) {
  return request({
    url: '/fwDictionaryClassz/updateFwDictClassz',
    params
  })
}

/* 对接通过主键查询字典分类			GET*/
export function getFwDictClasszById(params) {
  return request({
    url: '/fwDictionaryClassz/getFwDictClasszById',
    params
  })
}

/* 对接查询所有字典分类				GET*/
export function getFwDictClasszList(params) {
  return request({
    url: '/fwDictionaryClassz/getFwDictClasszList',
    params
  })
}


/* 对接新增字典					POST*/
export function addFwDict(params) {
  return request({
    url: '/fwDictionary/addFwDict',
    params
  })
}

/* 对接通过主键删除字典			POST*/
export function deleteFwDictById(params) {
  return request({
    url: '/fwDictionary/deleteFwDictById',
    params
  })
}

/* 对接修改字典复制				POST*/
export function updateFwDict(params) {
  return request({
    url: '/fwDictionary/updateFwDict',
    params
  })
}

/* 对接通过主键查询字典			GET*/
export function getFwDictById(params) {
  return request({
    url: '/fwDictionary/getFwDictById',
    params
  })
}

/* 对接通过分类标识查询字典数据	GET*/
export function getFwDictListByCode(params) {
  return request({
    url: '/fwDictionary/getFwDictListByCode',
    params
  })
}

/* 对接查询子级字典				GET*/
export function findFwDictList(params) {
  return request({
    url: '/fwDictionary/findFwDictList',
    params
  })
}

/* 对接批量删除字典				POST*/
export function deleteBatchFwDict(params) {
  return request({
    url: '/fwDictionary/deleteBatchFwDict',
    params
  })
}

