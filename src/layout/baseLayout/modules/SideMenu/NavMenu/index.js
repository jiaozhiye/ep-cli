/*
 * @Author: 焦质晔
 * @Date: 2019-11-28 14:32:05
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-12-09 08:56:06
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

const getOpenKeys = props => {
  const { pathname: path } = props.location;
  const stepMatchs = matchRoutes(routes, path).map(x => x.match);
  return stepMatchs.map(x => x.path).slice(1);
};

@withRouter
@connect(
  state => ({ menuList: state.app.menuList, collapsed: state.app.collapsed }),
  dispatch => ({
    actions: bindActionCreators(actionCreators, dispatch)
  })
)
class NavMenu extends Component {
  state = {
    path: '',
    selectedKeys: [],
    openKeys: []
  };

  static getDerivedStateFromProps(nextProps, state) {
    const { pathname: path } = nextProps.location;
    if (!path) return null;
    let res = { selectedKeys: [path] };
    if (path !== state.path) {
      res = { ...res, path, openKeys: getOpenKeys(nextProps) };
    }
    return res;
  }

  componentDidMount() {
    this.props.actions.createMenuList();
  }

  onOpenChange = openKeys => {
    // ...
    this.setState({ openKeys });
  };

  // 获得菜单子节点
  getNavMenuItems = (menus, parent) => {
    if (!menus) return [];
    return menus
      .filter(x => x.title && !x.hideInMenu)
      .map(x => this.getSubMenuOrItem(x, parent))
      .filter(x => x);
  };

  // 获取 SubMenu or Item
  getSubMenuOrItem = item => {
    if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.title)) {
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
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    }
    return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
  };

  // 判断是否是http链接 返回 Link 或 a
  getMenuItemPath = item => {
    const path = this.conversionPath(item.path);
    const { target } = item;
    // Is it a http link
    if (/^https?:\/\//.test(path)) {
      return (
        <a href={path} target={target}>
          {item.icon && <Icon type={item.icon} />}
          <span>{item.title}</span>
        </a>
      );
    }
    const { location } = this.props;
    return (
      <Link to={path} target={target} replace={path === location.pathname}>
        {item.icon && <Icon type={item.icon} />}
        <span>{item.title}</span>
      </Link>
    );
  };

  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

  render() {
    const { openKeys, selectedKeys } = this.state;
    const { menuList, collapsed } = this.props;
    const { sideBgColor } = variables;
    const defaultProps = collapsed ? {} : { openKeys };
    return (
      <div className={classnames(css['nav-menu'])}>
        <Menu theme="dark" mode="inline" style={{ backgroundColor: sideBgColor }} {...defaultProps} selectedKeys={selectedKeys} onOpenChange={this.onOpenChange}>
          {this.getNavMenuItems(menuList)}
        </Menu>
      </div>
    );
  }
}

export default NavMenu;
