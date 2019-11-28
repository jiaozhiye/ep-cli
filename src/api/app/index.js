/*
 * @Author: 焦质晔
 * @Date: 2019-11-28 18:24:57
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-11-28 18:26:02
 */
import axios from '@/api';
import SERVER from '@/api/server';

// 获取导航菜单列表
export const getMenuList = params => axios.get(`${SERVER.DMSCLOUD_BASEDATA}/system/getMenu`, { params });
