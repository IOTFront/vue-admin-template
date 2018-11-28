import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
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
        duration: 5 * 1000
      })

      // 422 过期了;
      if (res.code === 422 || resState === 422) {
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
      } else if (res.code === 403 || res.code === 420 || res.code === 421 || res.code === 425 || resState === 403 || resState === 420 || resState === 421 || resState === 425) { // 403 420 421 425过期了;
        MessageBox.alert(
          res.message,
          '提示',
          {
            confirmButtonText: '确定'
          }
        ).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      } else {
        MessageBox.alert(
          '您的访问有误，请稍后再试！',
          '提示',
          {
            confirmButtonText: '确定'
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
