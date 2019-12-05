/*
 * @Author: 焦质晔
 * @Date: 2019-11-28 15:19:25
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-12-05 08:48:08
 */
import { ASIDE_COLLAPSED, MENU_LIST, TOP_TAB_MENU, DICT_DATA } from '../types';
import { deepMapRoutes, flatMapMenus } from '@/routes/routeConfig';
import routes from '@/routes';

/**
 * 初始化 state
 */
const initState = {
  collapsed: false, // 侧栏展开/收起状态
  menuList: [], // 侧栏菜单数据
  tabMenus: [], // 顶部选项卡菜单数据
  dict: {} // 数据字典
};

// 给导航数据添加图标属性
const createNavIcon = list => {
  list.forEach(x => {
    if (Array.isArray(x.children)) {
      createNavIcon(x.children);
    }
    const { meta } = deepMapRoutes(routes, x.path) || {};
    x.icon = meta ? meta.icon : undefined;
  });
};

// 设置侧栏导航的 展开/收起 状态
const setCollapsed = (state, payload) => {
  return Object.assign({}, state, {
    collapsed: payload
  });
};

// 设置导航菜单
const setMenuList = (state, payload) => {
  // 处理菜单图标
  createNavIcon(payload);
  return Object.assign({}, state, {
    menuList: payload
  });
};

// 设置顶部选项卡菜单
const setTopTabMenus = (state, payload) => {
  return Object.assign({}, state, {
    tabMenus: payload
  });
};

// 设置数据字典
const setDictData = (state, payload) => {
  return Object.assign({}, state, {
    dict: payload
  });
};

// 必须要给 state 参数默认赋值 initState
export const appReducer = (state = initState, action) => {
  switch (action.type) {
    case ASIDE_COLLAPSED:
      return setCollapsed(state, action.payload);
    case MENU_LIST:
      return setMenuList(state, action.payload);
    case TOP_TAB_MENU:
      return setTopTabMenus(state, action.payload);
    case DICT_DATA:
      return setDictData(state, action.payload);
    default:
      return state;
  }
};
