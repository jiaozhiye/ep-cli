/*
 * @Author: 焦质晔
 * @Date: 2019-11-23 14:50:47
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-11-23 15:13:11
 */
import RouteView from '@/layout/routeView';

export default [
  {
    path: '/home',
    exact: true,
    meta: { title: '概览页', keepAlive: true },
    page: 'dashboard'
  }
];
