/*
 * @Author: 焦质晔
 * @Date: 2019-11-28 14:32:05
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-11-30 13:07:51
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';

import config from '@/config';

import classnames from 'classnames';
import css from './index.module.less';

const logo = require('@/assets/img/logo.png');
const logoEp = require('@/assets/img/logo_ep.png');

@connect(
  state => ({ collapsed: state.app.collapsed }),
  dispatch => ({})
)
class Logo extends Component {
  // 是否首次渲染
  isFirstRender = true;

  componentDidMount() {
    this.isFirstRender = false;
  }

  render() {
    const { collapsed } = this.props;
    const imgUrl = !collapsed ? logoEp : logo;
    const cls = !collapsed ? [css['imgZK'], this.isFirstRender ? css['none'] : null] : [css['imgSQ']];
    return (
      <div className={classnames(css.logo)}>
        <Link to="/" title={config.systemName} className={classnames(css['logo-link'])}>
          <img className={classnames(css['logo-link-img'], ...cls)} src={imgUrl} alt="" />
        </Link>
      </div>
    );
  }
}

export default Logo;
