/*
 * @Author: 焦质晔
 * @Date: 2019-11-24 11:05:38
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-11-29 13:11:26
 */
import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { matchRoutes } from '@/routes/routeConfig';
import routes from '@/routes';

import classnames from 'classnames';
import css from './index.module.less';

import { Breadcrumb, Icon } from 'antd';

@withRouter
class BreadCrumb extends Component {
  createBreadcrumb(arr) {
    return arr.map((x, i) => {
      const { route } = x;
      const { meta = {} } = route;
      const last = i === arr.length - 1;
      return (
        <Breadcrumb.Item key={route.path}>
          {last ? (
            <span>{meta.title}</span>
          ) : (
            <Link to={route.path} className="ant-breadcrumb-link">
              {i === 0 && meta.icon ? <Icon type={meta.icon} /> : null}
              <span>{meta.title}</span>
            </Link>
          )}
        </Breadcrumb.Item>
      );
    });
  }

  render() {
    const { pathname: path } = this.props.location;
    return (
      <div className={classnames(css['breadcrumb'])}>
        <span>位置导航：</span>
        <Breadcrumb className={classnames(css['breadcrumb-wrap'])}>{this.createBreadcrumb(matchRoutes(routes, path))}</Breadcrumb>
      </div>
    );
  }
}

export default BreadCrumb;
