/*
 * @Author: 焦质晔
 * @Date: 2019-11-28 14:32:05
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-12-02 11:29:46
 */
import React, { Component } from 'react';
import classnames from 'classnames';
import css from './index.module.less';

import FoldArrow from './FoldArrow';
import MultiTabNav from './MultiTabNav';
import OperationArea from './OperationArea';

import { Layout } from 'antd';
const { Header } = Layout;

class TopHeader extends Component {
  render() {
    return (
      <Header className={classnames(css['header'])}>
        <FoldArrow />
        <OperationArea />
        <MultiTabNav />
      </Header>
    );
  }
}

export default TopHeader;
