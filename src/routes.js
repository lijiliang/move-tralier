// 前端路由
import AC from './components/async_load'  // 动态加载

export default [
  {
    name: '首页',
    icon: 'home',
    path: '/',
    component: AC(() => import('./views/home'))
  },
  {
    name: '详情页',
    icon: 'detail',
    path: '/detail/:id',
    component: AC(() => import('./views/movie/detail'))
  },
  {
    name: '后台入口',
    icon: 'admin',
    path: '/admin',
    component: AC(() => import('./views/admin/login'))
  }
]