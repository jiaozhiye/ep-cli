/*
 * @Author: 焦质晔
 * @Date: 2019-11-28 14:32:05
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-12-01 11:42:36
 */
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { matchRoutes } from '@/routes/routeConfig';
import routes from '@/routes';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actionCreators from '@/store/actions';

import classnames from 'classnames';
import css from './index.module.less';
import variables from '@/assets/css/variables.less';

import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;

@withRouter
@connect(
  state => ({ menuList: state.app.menuList, collapsed: state.app.collapsed }),
  dispatch => ({
    actions: bindActionCreators(actionCreators, dispatch)
  })
)
class NavMenu extends Component {
  state = {
    selectedKeys: [],
    openKeys: []
  };

  static getDerivedStateFromProps(nextProps, state) {
    const { pathname: path } = nextProps.location;
    if (!path) return;
    const stepRoutes = matchRoutes(routes, path);
    return { selectedKeys: [path], openKeys: stepRoutes.map(x => x.match.path) };
  }

  componentDidMount() {
    this.props.actions.createMenuList();
  }

  createMenuTree = arr => {
    return arr.map(item => {
      if (Array.isArray(item.children) && item.children.length) {
        return (
          <SubMenu
            key={item.path}
            title={
              <span>
                {item.icon && <Icon type={item.icon} />}
                <span>{item.title}</span>
              </span>
            }
          >
            {this.createMenuTree(item.children)}
          </SubMenu>
        );
      }
      return (
        <Menu.Item key={item.path}>
          <Link to={item.path}>
            {item.icon && <Icon type={item.icon} />}
            <span>{item.title}</span>
          </Link>
        </Menu.Item>
      );
    });
  };

  render() {
    const { openKeys, selectedKeys } = this.state;
    const { menuList } = this.props;
    const { sideBgColor } = variables;
    return (
      <Menu theme="dark" mode="inline" selectedKeys={selectedKeys} defaultOpenKeys={openKeys} style={{ backgroundColor: sideBgColor }}>
        {this.createMenuTree(menuList)}
      </Menu>
    );
  }
}

export default NavMenu;
