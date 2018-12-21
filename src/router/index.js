import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
import Frame from '../views/frame/frame'

/**
 * hidden: true                   如果`.:true'不会显示在侧栏中（默认为false）
 * alwaysShow: true               如果设置为true，将始终显示根菜单，无论其子路由长度如何
 *                                如果未设置alwaysShow，则在子节点下仅多于一条路径
 *                                它将变成嵌套模式，否则不显示根菜单
 * redirect: noredirect           如果“重定向：no redirect”在面包屑中不会重定向
 * name:'router-name'             名称由keep-alive使用（必须设置！！！！）
 * meta : {
    title: 'title'                子菜单和面包屑（建议集）中的名称显示
    icon: 'svg-name'              边栏中显示的图标，
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
    path: '/dataSet',
    component: Layout,
    redirect: '/dataSet/dictionarySet',
    name: '数据管理',
    meta: { title: '数据管理', icon: 'example' },
    children: [
      {
        path: 'dictionarySet',
        name: '字典管理',
        component: () => import('@/views/dataSet/dictionarySet'),
        meta: { title: '字典管理', icon: 'dictionarySet' }
      },
      {
        path: 'areaSet',
        name: '区划设置',
        component: () => import('@/views/dataSet/areaSet'),
        meta: { title: '区划设置', icon: 'areaSet' }
      },
      {
        path: 'surnameSet',
        name: '姓氏管理',
        component: () => import('@/views/dataSet/surnameSet'),
        meta: { title: '姓氏管理', icon: 'surnameSet' }
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
  mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
