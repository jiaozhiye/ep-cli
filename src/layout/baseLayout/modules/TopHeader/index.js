/*
 * @Author: 焦质晔
 * @Date: 2019-11-28 14:32:05
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-11-29 00:04:08
 */
import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actionCreators from '@/store/actions';

import classnames from 'classnames';
import css from './index.module.less';

import { Layout, Icon } from 'antd';
const { Header } = Layout;

@connect(
  state => ({ collapsed: state.app.collapsed }),
  dispatch => ({
    actions: bindActionCreators(actionCreators, dispatch)
  })
)
class TopHeader extends Component {
  clickHandle = () => {
    const { collapsed } = this.props;
    this.props.actions.createAsideCollapsed(!collapsed);
  };
  render() {
    const { collapsed } = this.props;
    return (
      <Header className={classnames(css['header'])}>
        <Icon className={classnames(css['header-trigger'], 'fl')} type={collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.clickHandle} />
      </Header>
    );
  }
}

export default TopHeader;
