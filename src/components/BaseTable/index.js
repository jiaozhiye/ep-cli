/*
 * @Author: 焦质晔
 * @Date: 2020-01-14 19:25:10
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-01-30 10:04:29
 */
import React, { Component } from 'react';

import FilterTable from './filterTable';
import EditableTable from './editableTable';
import PageTable from './pageTable';
import LayoutTable from './layoutTable';
import { Table } from 'antd';

@FilterTable
@EditableTable
@PageTable
@LayoutTable
class BaseTable extends Component {
  // 向外公开的方法
  START_LOADING = () => {
    this.props.pageTableRef.startTableLoading();
  };

  STOP_LOADING = () => {
    this.props.pageTableRef.stopTableLoading();
  };

  render() {
    return <Table {...this.props} rowKey={x => x._uid} />;
  }
}

export default BaseTable;
