/*
 * @Author: 焦质晔
 * @Date: 2019-11-28 15:17:14
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-12-01 12:44:45
 */
import { ASIDE_COLLAPSED, MENU_LIST, TOP_TAB_MENU, DICT_DATA } from '../types';
import dicts from '@/config/dicts';
import _ from 'lodash';
import { getMenuList, getDictData } from '@/api/app';

// 设置侧栏导航的 展开/收起 状态
export const createAsideCollapsed = params => ({
  type: ASIDE_COLLAPSED,
  payload: params
});

// 设置导航菜单
export const createMenuList = () => async (dispatch, getState) => {
  const { app } = getState();
  if (app.menuList.length) return;

  let data = [];
  if (process.env.REACT_APP_MOCK_DATA === 'true') {
    data = require('@/mock/sideMenu').default;
  } else {
    const res = await getMenuList();
    if (res.resultCode === 200) {
      data = res.data;
    } else {
      data.push({});
    }
  }

  dispatch({
    type: MENU_LIST,
    payload: data
  });
};

// 设置顶部选项卡菜单
export const createTopTabMenus = params => ({
  type: TOP_TAB_MENU,
  payload: params
});

// 设置数据字典
export const createDictData = () => async (dispatch, getState) => {
  let data = { ...dicts };
  if (process.env.REACT_APP_MOCK_DATA === 'true') {
    data = Object.assign({}, data, require('@/mock/dictData').default);
  } else {
    const res = await getDictData();
    if (res.resultCode === 200) {
      // region 省市区
      data = Object.assign({}, data, res.data.dict, { region: res.data.region });
    }
  }
  dispatch({
    type: DICT_DATA,
    payload: data
  });
  // 数据字典本地存储
  if (!_.isEqual(data, JSON.parse(localStorage.getItem('dict')))) {
    localStorage.setItem('dict', JSON.stringify(data));
  }
};
