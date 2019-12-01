/*
 * @Author: 焦质晔
 * @Date: 2019-12-01 09:39:10
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-12-01 13:24:50
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actionCreators from '@/store/actions';

export default WrappedComponent => {
  @withRouter
  @connect(
    state => ({ menuList: state.app.menuList }),
    dispatch => ({})
  )
  class Auth extends Component {
    // displayName -> 定义调试时的组件 name
    static displayName = `HOC(${WrappedComponent.displayName || WrappedComponent.name})`;

    state = {
      auths: []
    };

    componentDidMount() {
      const { menuList, location } = this.props;
      const { pathname: path } = location;
      const target = this.deepMapMenu(menuList, path);
      if (!target) return;
      if (Array.isArray(target.permission) && target.permission.length) {
        this.setState({ auths: target.permission });
      }
    }

    deepMapMenu = (menus, mark) => {
      let res = null;
      for (let i = 0; i < menus.length; i++) {
        if (Array.isArray(menus[i].children)) {
          res = this.deepMapMenu(menus[i].children, mark);
        }
        if (res !== null) {
          return res;
        }
        if (menus[i].path === mark) {
          res = menus[i];
        }
      }
      return res;
    }

    render() {
      const { auths } = this.state;
      return <WrappedComponent {...this.props} auths={auths} />
    }
  };
  return Auth;
};

