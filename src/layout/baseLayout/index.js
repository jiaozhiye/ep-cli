/*
 * @Author: 焦质晔
 * @Date: 2019-11-23 14:18:27
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-12-02 12:34:56
 */
import React, { Component } from 'react';
import { renderRoutes } from '@/routes/routeConfig';
import config from '@/config';
import classnames from 'classnames';
import css from './index.module.less';

import { Layout } from 'antd';
import SideMenu from './modules/SideMenu';
import TopHeader from './modules/TopHeader';
import BreadCrumb from './modules/BreadCrumb';

class BaseLayout extends Component {
  render() {
    const { route } = this.props;
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
