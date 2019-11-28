/*
 * @Author: 焦质晔
 * @Date: 2019-11-28 14:32:05
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-11-29 00:09:29
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actionCreators from '@/store/actions';
import classnames from 'classnames';
import css from './index.module.less';

import Logo from './Logo';
import NavMenu from './NavMenu';

import { Layout } from 'antd';
const { Sider } = Layout;

@connect(
  state => ({ collapsed: state.app.collapsed }),
  dispatch => ({
    actions: bindActionCreators(actionCreators, dispatch)
  })
)
class SideMenu extends Component {
  render() {
    const { collapsed } = this.props;
    return (
      <Sider className={classnames(css['sidebar'])} collapsible collapsed={collapsed} trigger={null}>
        <Logo />
        <NavMenu />
      </Sider>
    );
  }
}

export default SideMenu;
