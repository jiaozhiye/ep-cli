/*
 * @Author: 焦质晔
 * @Date: 2019-11-28 15:17:14
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-11-29 08:27:47
 */
import { ASIDE_COLLAPSED, MENU_LIST } from '../types';
import { getMenuList } from '@/api/app';

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
