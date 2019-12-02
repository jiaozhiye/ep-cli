/*
 * @Author: 焦质晔
 * @Date: 2019-11-28 14:32:05
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-12-02 11:33:20
 */
import React, { Component } from 'react';
import classnames from 'classnames';
import css from './index.module.less';

import UserCenter from './UserCenter';

class OperationArea extends Component {
  render() {
    return (
      <div className={classnames(css['operation'], 'fr')}>
        <UserCenter />
      </div>
    );
  }
}

export default OperationArea;
