/*
 * @Author: 焦质晔
 * @Date: 2019-11-28 14:32:05
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-11-30 13:14:15
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import routes from '@/routes';
import { deepMapRoutes } from '@/routes/routeConfig';
import _ from 'lodash';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actionCreators from '@/store/actions';

import classnames from 'classnames';
import css from './index.module.less';

import { Tabs } from 'antd';
const { TabPane } = Tabs;

@withRouter
@connect(
  state => ({ tabMenus: state.app.tabMenus }),
  dispatch => ({
    actions: bindActionCreators(actionCreators, dispatch)
  })
)
class MultiTabNav extends Component {
  state = { activeKey: '' };

  static getDerivedStateFromProps(nextProps, state) {
    const { location, actions, tabMenus } = nextProps;
    const { pathname } = location;
    // 匹配路由对象
    const target = deepMapRoutes(routes, pathname);
    if (target !== null) {
      const { path, meta = {} } = target;
      // 对数据去重
      const res = _.uniqBy([...tabMenus, { path, title: meta.title, keepAlive: meta.keepAlive }], 'path');
      if (!_.isEqual(tabMenus, res)) {
        // 设置顶部选项卡菜单
        actions.createTopTabMenus(res);
      }
      return { activeKey: path };
    }
    return { activeKey: '' };
  }

  onChange = activeKey => {
    const { history } = this.props;
    // 路由跳转
    history.push(activeKey);
    this.setState({ activeKey });
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  remove = targetKey => {
    const { tabMenus, actions, history } = this.props;
    let { activeKey } = this.state;
    let lastIndex;
    tabMenus.forEach((x, i) => {
      if (x.path === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = tabMenus.filter(x => x.path !== targetKey);
    if (panes.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        activeKey = panes[lastIndex].path;
      } else {
        activeKey = panes[0].path;
      }
      // 路由跳转
      history.push(activeKey);
    }
    // 设置顶部选项卡菜单
    actions.createTopTabMenus(panes);
    this.setState({ activeKey });
  };

  render() {
    const { tabMenus } = this.props;
    const { activeKey } = this.state;
    return (
      <div className={classnames(css.multitab)}>
        <Tabs hideAdd onChange={this.onChange} activeKey={activeKey} type="editable-card" onEdit={this.onEdit}>
          {tabMenus.map(pane => (
            <TabPane tab={pane.title} key={pane.path} closable={tabMenus.length > 1} />
          ))}
        </Tabs>
      </div>
    );
  }
}

export default MultiTabNav;
