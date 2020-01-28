/*
 * @Author: 焦质晔
 * @Date: 2020-01-26 19:00:22
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-01-27 22:30:11
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

import { Alert, Button } from 'antd';

import classnames from 'classnames';
import css from './index.module.less';

const noop = () => {};

export class TableInfo extends Component {
  static propTypes = {
    total: PropTypes.number.isRequired, // 数据总数
    selection: PropTypes.shape({
      selectedRowKeys: PropTypes.array.isRequired // 选中项的 key 数组
    }),
    onClearHandle: PropTypes.func // 清空方法
  };

  static defaultProps = {
    onClearHandle: noop
  };

  clickHandle = e => {
    e.preventDefault();
    this.props.onClearHandle();
  };

  render() {
    const { total, selection } = this.props;
    const messageNode = (
      <>
        总共 {total} 条数据{_.isObject(selection) && `，已选择 ${selection.selectedRowKeys.length} 项`}
        <a href="#" className={classnames(css[`table-top-info-link`])} onClick={this.clickHandle}>
          清空
        </a>
      </>
    );
    return <Alert className={classnames(css['table-top-info'])} message={messageNode} type="info" showIcon />;
  }
}
