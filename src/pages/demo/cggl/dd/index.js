/*
 * @Author: 焦质晔
 * @Date: 2019-11-23 15:19:39
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2019-12-01 13:22:09
 */
import React, { Component } from 'react';
import classnames from 'classnames';
import css from './index.module.less';
import dict from '@/utils/dict';
import auth from '@/utils/auth';

@dict
@auth
class DemoDd extends Component {
  render() {
    console.log(this.props)
    return <div>备件采购订单</div>;
  }
}

export default DemoDd;
