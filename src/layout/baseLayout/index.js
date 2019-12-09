/*
 * @Author: 焦质晔
 * @Date: 2019-11-23 14:18:27
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-12-09 08:52:47
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { renderRoutes, matchRoutes } from '@/routes/routeConfig';
import routes from '@/routes';
import config from '@/config';
import classnames from 'classnames';
import css from './index.module.less';

import { Layout } from 'antd';
import SideMenu from './modules/SideMenu';
import TopHeader from './modules/TopHeader';
import BreadCrumb from './modules/BreadCrumb';

@withRouter
class BaseLayout extends Component {
  createDocumentTitle() {
    const lastRoute = matchRoutes(routes, this.props.location.pathname)
      .map(x => x.route)
      .pop();
    if (!lastRoute) return;
    const { title = '' } = lastRoute.meta || {};
    document.title = `${config.systemName}-${title}`;
  }
  render() {
    const { route } = this.props;
    this.createDocumentTitle();
    return (
      <Layout className={classnames(css.app)}>
        <SideMenu />
        <Layout>
          <TopHeader />
          <Layout.Content style={{ overflowY: 'auto' }}>
            {config.isBreadcrumb && <BreadCrumb />}
            <main className={classnames(css.main)}>{renderRoutes(route.routes)}</main>
          </Layout.Content>
        </Layout>
      </Layout>
    );
  }
}

export default BaseLayout;
