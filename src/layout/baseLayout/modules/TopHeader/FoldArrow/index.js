/*
 * @Author: 焦质晔
 * @Date: 2019-11-28 14:32:05
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-11-30 08:16:14
 */
import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actionCreators from '@/store/actions';

import classnames from 'classnames';
import css from './index.module.less';

import { Icon } from 'antd';

@connect(
  state => ({ collapsed: state.app.collapsed }),
  dispatch => ({
    actions: bindActionCreators(actionCreators, dispatch)
  })
)
class FoldArrow extends Component {
  clickHandle = () => {
    const { collapsed } = this.props;
    this.props.actions.createAsideCollapsed(!collapsed);
  };

  render() {
    const { collapsed } = this.props;
    return <Icon className={classnames(css['trigger'], 'fl')} type={collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.clickHandle} />;
  }
}

export default FoldArrow;
