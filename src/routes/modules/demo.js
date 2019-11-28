/*
 * @Author: 焦质晔
 * @Date: 2019-11-23 14:50:47
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-11-28 18:44:55
 */
import RouteView from '@/layout/routeView';

export default [
  {
    path: '/bjgl',
    meta: { title: '备件管理', icon: 'asdasd' },
    component: RouteView,
    routes: [
      { path: '/bjgl', exact: true, redirect: '/bjgl/cggl' },
      {
        path: '/bjgl/cggl',
        meta: { title: '采购管理' },
        component: RouteView,
        routes: [
          { path: '/bjgl/cggl', exact: true, redirect: '/bjgl/cggl/dd' },
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
