import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非200是抛错 可结合自己业务进行修改, response.status为链接返回的回调，一样做报错处理
     */
    const res = response.data
    const resState = response.status
    if (res.code !== 200 || resState !== 200) {
      Message({
        message: res.message,
        type: 'error',
        duration: 3 * 1000
      })
      // 422 seesion过期了;
      if (res.code === 405 || resState === 405) {
        MessageBox.confirm(
          '您的用户信息已过期，您可以停留在当前页面或者重新登录',
          '提示',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('错误信息：' + error) // for debug
    Message({
      message: '出错啦：' + error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
