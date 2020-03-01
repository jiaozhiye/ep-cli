/*
 * @Author: 焦质晔
 * @Date: 2020-02-08 10:11:59
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-02-08 10:30:56
 */

// 生成 uuid key
export const createUidKey = () => {
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    let r = (Math.random() * 16) | 0;
    let v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
  return uuid;
};

// 获取 column 展平后的一维数组
export const columnsFlatMap = columns => {
  let res = [];
  columns.forEach(x => {
    let target = { ...x };
    if (Array.isArray(target.children)) {
      res.push(...columnsFlatMap(target.children));
    }
    delete target.children;
    res.push(target);
  });
  return res;
};

// 深度查找 column
export const deepFindColumn = (columns, mark) => {
  let res = null;
  for (let i = 0; i < columns.length; i++) {
    if (Array.isArray(columns[i].children)) {
      res = deepFindColumn(columns[i].children, mark);
    }
    if (res) {
      return res;
    }
    if (columns[i].dataIndex === mark) {
      return columns[i];
    }
  }
  return res;
};

// 列字段的配置项属性的检索
export const isColumnPropertyExist = (columns, key) => {
  let res = false;
  for (let i = 0; i < columns.length; i++) {
    if (Array.isArray(columns[i].children)) {
      res = isColumnPropertyExist(columns[i].children, key);
    }
    if (res) {
      return true;
    }
    if (typeof columns[i][key] !== 'undefined') {
      return true;
    }
  }
  return res;
};

// 数字格式化
export const formatNumber = (value = '') => {
  value += '';
  const list = value.split('.');
  const prefix = list[0].charAt(0) === '-' ? '-' : '';
  let num = prefix ? list[0].slice(1) : list[0];
  let result = '';
  while (num.length > 3) {
    result = `, ${num.slice(-3)}${result}`;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
};
