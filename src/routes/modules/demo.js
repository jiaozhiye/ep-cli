/*
 * @Author: 焦质晔
 * @Date: 2019-11-23 14:50:47
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-11-29 07:51:12
 */
import RouteView from '@/layout/routeView';

export default [
  {
    path: '/bjgl',
    meta: { title: '备件管理', icon: 'appstore' },
    redirect: '/bjgl/cggl',
    component: RouteView,
    routes: [
      {
        path: '/bjgl/cggl',
        meta: { title: '采购管理' },
        redirect: '/bjgl/cggl/dd',
        component: RouteView,
        routes: [
          {
            path: '/bjgl/cggl/dd',
            exact: true,
            meta: { title: '备件采购订单', keepAlive: true },
            page: 'demo/cggl/dd'
          }
        ]
      }
    ]
  }
];
