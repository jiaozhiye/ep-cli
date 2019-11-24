/*
 * @Author: 焦质晔
 * @Date: 2019-11-23 14:18:27
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-11-24 11:35:31
 */
import React, { Component } from 'react';
import { renderRoutes } from '@/routes/routeConfig';
import Breadcrumb from './modules/Breadcrumb';
import classnames from 'classnames';
import css from './index.module.less';

class BaseLayout extends Component {
  render() {
    const { route } = this.props;
    return (
      <div>
        <header>
          <Breadcrumb />
        </header>
        <div>{renderRoutes(route.routes)}</div>
      </div>
    );
  }
}

export default BaseLayout;
