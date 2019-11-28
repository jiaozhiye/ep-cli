/*
 * @Author: 焦质晔
 * @Date: 2019-11-23 14:29:53
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-11-28 11:24:47
 */
import { processRoutes } from './routeConfig';

import modulesRoute from './modules';
import BaseLayout from '@/layout/baseLayout';
import Login from '@/pages/login';
import Nomatch from '@/pages/nomatch';

const routes = [
  {
    path: '/login',
    exact: true,
    meta: { title: '用户登录' },
    component: Login
  },
  {
    path: '/',
    component: BaseLayout,
    meta: { title: '首页' },
    routes: [
      ...modulesRoute,
      {
        path: '/',
        exact: true,
        redirect: '/home'
      },
      {
        path: '*',
        component: Nomatch
      }
    ]
  }
];

export default processRoutes(routes);
