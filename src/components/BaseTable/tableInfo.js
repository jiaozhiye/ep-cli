/*
 * @Author: 焦质晔
 * @Date: 2020-01-26 19:00:22
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-01-26 23:35:43
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
    selects: PropTypes.number, // 选中的条数
    clearHandle: PropTypes.func // 清空方法
  };

  static defaultProps = {
    selects: 0,
    clearHandle: noop
  };

  render() {
    const { total, selects, clearHandle } = this.props;
    const messageNode = (
      <>
        总共 {total} 条数据，已选择 {selects} 项
        <Button type="link" size="small" onClick={clearHandle}>
          清空
        </Button>
      </>
    );
    return <Alert className={classnames(css['table-top-info'])} message={messageNode} type="info" showIcon />;
  }
}
