/*
 * @Author: 焦质晔
 * @Date: 2019-11-28 20:16:56
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-01-28 22:46:49
 */
import moment from 'moment';

// No-op function
export const noop = () => {};

// 等待
export const sleep = async timeLen => {
  return new Promise(resolve => setTimeout(resolve, timeLen));
};

// 捕获基于 Promise 操作的异常
export const errorCapture = async promise => {
  try {
    const res = await promise;
    return [null, res];
  } catch (e) {
    return [e, null];
  }
};

// 函数防抖
export const debounce = (fn, delay) => {
  return function(...args) {
    fn.timer && clearTimeout(fn.timer);
    fn.timer = setTimeout(() => fn.apply(this, args), delay);
  };
};

// 函数节流
export const throttle = (fn, delay) => {
  return function(...args) {
    let nowTime = +new Date();
    if (!fn.lastTime || nowTime - fn.lastTime > delay) {
      fn.apply(this, args);
      fn.lastTime = nowTime;
    }
  };
};

// moment 日期对象 -> 字符串
export const dateFormat = date => {
  return moment(date).format('YYYY-MM-DD');
};

// moment 日期对象 -> 字符串
export const dateTimeFormat = date => {
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
};

// 字符串 -> moment 日期对象
export const dateToMoment = dateText => {
  return dateText ? moment(dateText, 'YYYY-MM-DD') : null;
};

// 字符串 -> moment 日期对象
export const dateTimeToMoment = dateText => {
  return dateText ? moment(dateText, 'YYYY-MM-DD HH:mm:ss') : null;
};

export const contains = (root, target) => {
  let node = target;
  while (node) {
    if (node === root) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
};
