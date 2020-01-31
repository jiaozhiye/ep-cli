/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-01-31 15:45:04
 */
export default [
  {
    title: '备件管理',
    path: '/bjgl',
    children: [
      {
        title: '采购管理',
        path: '/bjgl/cggl',
        children: [
          {
            title: '备件采购订单',
            path: '/bjgl/cggl/dd',
            permission: ['save', 'update']
          },
          {
            title: '备件采购入库',
            path: '/bjgl/cggl/rk'
          },
          {
            title: '备件采购退库',
            path: '/bjgl/cggl/tk'
          }
        ]
      },
      {
        title: '库存管理',
        path: '/bjgl/kcgl',
        children: [
          {
            title: '备件清单列表',
            path: '/bjgl/kcgl/lb'
          }
        ]
      }
    ]
  },
  {
    title: '销售管理',
    path: '/xsgl',
    children: [
      {
        title: '线索管理',
        path: '/xsgl/xugl',
        children: [
          {
            title: '线索分配',
            path: '/xsgl/xugl/fp'
          },
          {
            title: '线索记录',
            path: '/xsgl/xugl/jl'
          },
          {
            title: '线索跟进计划',
            path: '/xsgl/xugl/jh'
          },
          {
            title: '线索转移',
            path: '/xsgl/xugl/zy'
          }
        ]
      },
      {
        title: '机会管理',
        path: '/xsgl/jhgl',
        children: [
          {
            title: '销售机会',
            path: '/xsgl/jhgl/xsjh'
          },
          {
            title: '跟进计划设置',
            path: '/xsgl/jhgl/jhsz'
          },
          {
            title: '机会跟进计划',
            path: '/xsgl/jhgl/gjjh'
          }
        ]
      },
      {
        title: '客户管理',
        path: '/xsgl/khgl',
        children: [
          {
            title: '客户订单管理',
            path: '/xsgl/khgl/dd'
          },
          {
            title: '车辆资源查询',
            path: '/xsgl/khgl/cx'
          },
          {
            title: '车辆资源管理',
            path: '/xsgl/khgl/gl'
          }
        ]
      }
    ]
  },
  {
    title: '客服管理',
    path: '/kfgl',
    children: [
      {
        title: '回访',
        path: '/kfgl/hf',
        children: [
          {
            title: '销售回访',
            path: '/kfgl/hf/xs'
          },
          {
            title: '回访分配',
            path: '/kfgl/hf/fp'
          }
        ]
      },
      {
        title: '投诉',
        path: '/kfgl/ts',
        children: [
          {
            title: '投诉管理',
            path: '/kfgl/ts/gl'
          }
        ]
      }
    ]
  }
];
