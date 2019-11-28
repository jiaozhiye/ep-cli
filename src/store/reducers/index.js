/*
 * @Author: 焦质晔
 * @Date: 2019-11-28 15:16:46
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-11-28 15:16:46
 */
import { combineReducers } from 'redux';

import { appReducer } from './app';

// dispatch 提交后，所有的 reducer 都会收到 action，这个过程是 redux 自动处理的
// reducer 通过 action.type 来进行判定处理
// 如果某个 reducer 没能匹配到任何动作分支，就会走 default 分支，把 state 原样返回

// app -> 为了区分不同 reducer 中的 state，相当于添加了查找 state 的调用前缀

// 合并 reducers
export default combineReducers({
  app: appReducer
});
