/*
 * @Author: 焦质晔
 * @Date: 2020-01-26 19:00:22
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-01-26 19:10:54
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

import { Alert, Button } from 'antd';

import classnames from 'classnames';
import css from './index.module.less';

export class TableInfo extends Component {
  static propTypes = {
    total: PropTypes.number.isRequired
  };

  render() {
    const messageNode = (
      <>
        总共 50 条数据，已选择 0 项
        <Button type="link" size="small">
          清空
        </Button>
      </>
    );
    return <Alert className={classnames(css['table-top-info'])} message={messageNode} type="info" showIcon />;
  }
}
