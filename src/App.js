/*
 * @Author: 焦质晔
 * @Date: 2019-11-23 14:12:19
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-01-31 15:08:59
 */
import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { BrowserRouter as Router } from 'react-router-dom';
import { renderRoutes } from '@/routes/routeConfig';
import { Provider } from 'react-redux';
import store from '@/store';
import actionCreators from '@/store/actions';
import routes from '@/routes';
import '@/config/globle';
import { ConfigProvider } from 'antd';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/es/locale/zh_CN';

import '@/assets/css/style.less';
import '@/assets/css/iconfont.css';

@hot(module)
class App extends Component {
  componentDidMount() {
    // 获取数据字典
    store.dispatch(actionCreators.createDictData());
  }
  render() {
    return (
      <ConfigProvider locale={zhCN}>
        <Provider store={store}>
          <Router>{renderRoutes(routes)}</Router>
        </Provider>
      </ConfigProvider>
    );
  }
}

export default App;
