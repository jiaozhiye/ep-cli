/*
 * @Author: 焦质晔
 * @Date: 2019-11-23 14:12:19
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-11-23 23:36:51
 */
import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { BrowserRouter as Router } from 'react-router-dom';
import { renderRoutes } from '@/routes/routeConfig';
import routes from '@/routes';
import { ConfigProvider } from 'antd';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/es/locale/zh_CN';

console.log(routes);

@hot(module)
class App extends Component {
  render() {
    return (
      <ConfigProvider locale={zhCN}>
        <Router>{renderRoutes(routes)}</Router>
      </ConfigProvider>
    );
  }
}

export default App;
