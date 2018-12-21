/* eslint-disable one-var */

/*  Json2Tree
*   FnName：将平级的带有层级关系的JSON 转为树形JSON
*   params：
*         a:原数据集
*         idStr:id对应的key
*         pidStr:对应存储的父级关联id的ket
*         chindrenStrL:子集存放集合对应的key
*    return:
*           r：格式化之后的数据
* */
export default function Json2Tree(a, idStr, pidStr, chindrenStr) {
  var r = [], hash = {}, id = idStr, pid = pidStr, children = chindrenStr, i = 0, j = 0, len = a.length
  for (; i < len; i++) {
    hash[a[i][id]] = a[i]
  }
  for (; j < len; j++) {
    var aVal = a[j], hashVP = hash[aVal[pid]]
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = [])
      hashVP[children].push(aVal)
    } else {
      r.push(aVal)
    }
  }
  return r
}
