/*
 * @Author: 焦质晔
 * @Date: 2019-11-23 15:11:58
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-11-23 23:15:07
 */
import React, { Component } from 'react';
import { renderRoutes } from '@/routes/routeConfig';
import classnames from 'classnames';
import css from './index.module.less';

class RouteView extends Component {
  render() {
    const { route } = this.props;
    return renderRoutes(route.routes);
  }
}

export default RouteView;
