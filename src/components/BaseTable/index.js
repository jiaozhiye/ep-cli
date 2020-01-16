/*
 * @Author: 焦质晔
 * @Date: 2020-01-14 19:25:10
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-01-16 16:00:45
 */
// index -> BaseTable 组件
// filterTable -> FilterTable 组件，设计成高阶组件，用来修饰当前组件
// editableTable -> EditableTable 组件，设计成高阶组件，用来修饰当前组件
// pageTable -> PageTable 组件，设计成高阶组件，用来修饰当前组件
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import config from '@/config';

import FilterTable from './filterTable';
import EditableTable from './editableTable';
import PageTable from './pageTable';

import { Table } from 'antd';

import classnames from 'classnames';
import css from './index.module.less';

@FilterTable()
@EditableTable()
@PageTable()
class BaseTable extends Component {
  render() {
    const wrapProps = Object.assign({}, this.props);
    return <Table {...wrapProps} rowKey={x => x._uid} />;
  }
}

export default BaseTable;
