import router from './router'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { getToken } from '@/utils/auth' // 验权
import { Message } from 'element-ui'

const whiteList = ['/login', '/404'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    var Menus = JSON.parse(getToken())
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is homePage will not trigger	afterEach hook, so manually handle it
    } else if (to.path === '/404') {
      next(`/404`)
      NProgress.done() // if current page is homePage will not trigger	afterEach hook, so manually handle it
    } else {
      var TurnBol = false
      Menus.forEach(a => {
        if (a.MENU_PATH === to.path) {
          TurnBol = true
        }
      })
      if (TurnBol) {
        next()
      } else {
        // Message.error('您没有相关权限，请联系管理员或退出重试！')
      }
      next()

      /* if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          next()
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        next()
      }*/
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
