import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/homePage/index'),
        name: '首页',
        meta: { title: '首页', icon: 'home', noCache: true }
      }
    ]
  },
  {
    path: '/systemSet',
    component: Layout,
    redirect: '/systemSet/menu',
    name: '系统设置',
    meta: { title: '系统设置', icon: 'sysSet' },
    children: [
      {
        path: 'user',
        name: '用户管理',
        component: () => import('@/views/systemSet/user'),
        meta: { title: '用户管理', icon: 'userSet' }
      },
      {
        path: 'organization',
        name: '机构管理',
        component: () => import('@/views/systemSet/organization'),
        meta: { title: '机构管理', icon: 'tree' }
      },
      {
        path: 'menu',
        name: '菜单管理',
        component: () => import('@/views/systemSet/menu'),
        meta: { title: '菜单管理', icon: 'menuSet' }
      },
      {
        path: 'resource',
        name: '资源管理',
        component: () => import('@/views/systemSet/resource'),
        meta: { title: '资源管理', icon: 'resourceSet' }
      },
      {
        path: 'role',
        name: '角色管理',
        component: () => import('@/views/systemSet/role'),
        meta: { title: '角色管理', icon: 'roleSet' }
      }
    ]
  },
  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/svg-icons/index'),
        name: 'Icons',
        meta: { title: 'icons', icon: 'icon', noCache: true }
      }
    ]
  },
  {
    path: '/business',
    component: Layout,
    redirect: '/business/test',
    name: '业务系统',
    meta: { title: '业务系统', icon: 'sysSet' },
    children: [
      {
        path: 'test',
        name: '测试地址',
        component: () => import('@/views/business/test'),
        meta: { title: '测试地址', icon: 'userSet' }
      }
    ]
  },
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
