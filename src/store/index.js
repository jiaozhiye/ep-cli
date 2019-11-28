/*
 * @Author: 焦质晔
 * @Date: 2019-11-28 15:07:53
 * @Last Modified by:   焦质晔
 * @Last Modified time: 2019-11-28 15:07:53
 */
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducer from './reducers';

const store = createStore(reducer, applyMiddleware(thunkMiddleware));

export default store;
