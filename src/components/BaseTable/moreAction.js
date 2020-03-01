/*
 * @Author: 焦质晔
 * @Date: 2020-02-06 19:26:48
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-02-06 23:21:15
 */
import React, { Component } from 'react';
import memoizeOne from 'memoize-one';
import PropTypes from 'prop-types';

import { Dropdown, Menu, Button } from 'antd';

import classnames from 'classnames';
import css from './index.module.less';

export class MoreAction extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
        onClick: PropTypes.func
      })
    )
  };

  get menuList() {
    return this.getMenuList(this.props.items);
  }

  getMenuList = memoizeOne(items => {
    return (
      <Menu>
        {items.map((x, i) => (
          <Menu.Item key={i} onClick={() => this.clickHandle(x.onClick)}>
            {x.title}
          </Menu.Item>
        ))}
      </Menu>
    );
  });

  clickHandle = fn => {
    fn && fn();
  };

  render() {
    return (
      <Dropdown overlay={this.menuList} trigger={['click']} className={classnames(css[`table-top-wrap-action`])}>
        <Button>更多操作</Button>
      </Dropdown>
    );
  }
}
