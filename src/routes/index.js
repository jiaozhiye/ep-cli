/*
 * @Author: 焦质晔
 * @Date: 2019-11-23 14:29:53
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-11-29 12:27:59
 */
import { processRoutes } from './routeConfig';
import modulesRoute from './modules';
import BaseLayout from '@/layout/baseLayout';
import Login from '@/pages/login';

const routes = [
  {
    path: '/login',
    exact: true,
    meta: { title: '用户登录' },
    component: Login
  },
  {
    path: '/',
    meta: { title: '首页', icon: 'home' },
    redirect: '/home',
    component: BaseLayout,
    routes: [...modulesRoute]
  }
];

export default processRoutes(routes);
