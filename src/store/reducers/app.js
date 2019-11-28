/*
 * @Author: 焦质晔
 * @Date: 2019-11-28 15:19:25
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-11-28 20:12:03
 */
import { ASIDE_COLLAPSED, MENU_LIST } from '../types';
import routes from '@/routes';

/**
 * 初始化 state
 */
const initState = {
  collapsed: false, // 侧栏展开/收起状态
  menuList: [] // 菜单数据
};

// 数组的递归查找
const deepFind = (arr, mark) => {
  let res = null;
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i].routes)) {
      res = deepFind(arr[i].routes, mark);
    }
    if (res !== null) {
      return res;
    }
    if (arr[i].path === mark) {
      res = arr[i];
    }
  }
  return res;
};

// 给导航数据添加图标属性
const createNavIcon = list => {
  list.forEach(x => {
    if (Array.isArray(x.children)) {
      createNavIcon(x.children);
    }
    const { meta } = deepFind(routes, x.path) || {};
    x.icon = meta ? meta.icon : undefined;
  });
};

// 提取可点击的菜单项
const formateMenu = list => {
  const res = [];
  list.forEach(x => {
    if (Array.isArray(x.children)) {
      res.push(...formateMenu(x.children));
    } else {
      res.push(x);
    }
  });
  return res;
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

// 必须要给 state 参数默认赋值 initState
export const appReducer = (state = initState, action) => {
  switch (action.type) {
    case ASIDE_COLLAPSED:
      return setCollapsed(state, action.payload);
    case MENU_LIST:
      return setMenuList(state, action.payload);
    default:
      return state;
  }
};
