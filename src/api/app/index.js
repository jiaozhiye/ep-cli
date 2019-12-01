/*
 * @Author: 焦质晔
 * @Date: 2019-11-28 18:24:57
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-12-01 11:27:03
 */
import axios from '@/api';
import SERVER from '@/api/server';

// 登录
export const doLogin = params => axios.post(`${SERVER.DMSCLOUD_BASEDATA}/system/login`, params);

// 获取导航菜单列表
export const getMenuList = params => axios.get(`${SERVER.DMSCLOUD_BASEDATA}/system/getMenu`, { params });

// 获取应用数据字典
export const getDictData = params => axios.get(`${SERVER.DMSCLOUD_BASEDATA}/system/dict`, { params });
