/*
 * @Author: 焦质晔
 * @Date: 2019-11-28 14:32:05
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-01-07 10:15:55
 */
import React, { Component } from 'react';
import classnames from 'classnames';
import css from './index.module.less';

import { Menu, Dropdown, Avatar } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';

class UserCenter extends Component {
  onMenuClick = () => {};
  render() {
    const menu = (
      <Menu selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="userCenter">
          <UserOutlined />
          个人中心
        </Menu.Item>
        <Menu.Item key="userinfo">
          <SettingOutlined />
          个人设置
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <LogoutOutlined />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return (
      <Dropdown overlay={menu} className={classnames(css['user'])}>
        <span>
          <Avatar size="small" src={'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'} alt="avatar" />
          <span className={classnames(css['user-name'])}>管理员</span>
        </span>
      </Dropdown>
    );
  }
}

export default UserCenter;
