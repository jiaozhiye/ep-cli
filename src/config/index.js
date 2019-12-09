/**
 * @Author: 焦质晔
 * @Date: 2019/6/20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-12-09 08:08:04
 */
export default {
  systemName: '奥迪EP系统',
  maxCacheNum: 10, // 路由组件最大缓存数量
  maxStarMenus: 10, // 收藏导航的最大数量
  isBreadcrumb: true, // 是否展示导航面包屑
  table: {
    pageNum: 1,
    pageSize: 20,
    serverSort: false,
    serverFilter: false
  },
  charts: {
    // 文字大小
    textSize: 12,
    // 文字颜色
    textColor: 'rgba(0, 0, 0, 0.65)',
    // 悬浮框背景颜色
    bgColor: 'rgba(255, 255, 255, 0.85)',
    // 柱状图/折线图鼠标经过的背景颜色
    barBgColor: 'rgba(0, 0, 0, 0.05)',
    // 盒子外发光效果
    boxShadow: '0 0 4px rgba(0, 0, 0, 0.35)',
    // 坐标轴颜色
    lineColor: 'rgba(0, 0, 0, 0.35)'
  }
};
