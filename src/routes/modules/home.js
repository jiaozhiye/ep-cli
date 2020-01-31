/*
 * @Author: 焦质晔
 * @Date: 2019-11-23 14:50:47
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-01-31 15:11:52
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
