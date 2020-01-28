/*
 * @Author: 焦质晔
 * @Date: 2020-01-14 19:25:10
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-01-28 21:01:59
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
import { TableInfo } from './tableInfo';
import { ColumnSort } from './columnSort';

import { Table } from 'antd';

import classnames from 'classnames';
import css from './index.module.less';

@FilterTable()
@EditableTable()
@PageTable()
class BaseTable extends Component {
  // 创建列筛选后的列字段数组
  createFilterColumns = columns => {
    let res = [];
    columns.forEach(x => {
      let target = { ...x };
      if (Array.isArray(x.children)) {
        target.children = this.createFilterColumns(x.children);
      }
      if (!target.hidden) {
        res.push(target);
      }
    });
    return res;
  };

  // 清空 Table 组件所有操作的方法
  clearTableHandle = () => {
    // 清空选择列的选中状态
    this.props.pageTableRef.clearRowSelection();
    // 清空表头筛选条件
    this.props.filterTableRef.clearFilters();
    // 清空表头排序
    this.props.filterTableRef.clearSorter();
  };

  // 向外公开的方法
  START_LOADING = () => {
    this.props.pageTableRef.startTableLoading();
  };

  STOP_LOADING = () => {
    this.props.pageTableRef.stopTableLoading();
  };

  render() {
    const wrapProps = Object.assign({}, this.props, {
      columns: this.createFilterColumns(this.props.columns)
    });
    return (
      <div className={classnames(css['table'])}>
        <div className={classnames(css['table-top'], `clearfix`)}>
          <div className={classnames(css[`table-top-wrap`], `fl`)}>
            <TableInfo total={wrapProps.pagination.total} selection={wrapProps.rowSelection} onClearHandle={this.clearTableHandle} />
          </div>
          <div className={classnames(css[`table-top-wrap`], `fr`)}>
            <ColumnSort columns={this.props.columns} onChange={columns => this.props.onColumnsChange(columns)} />
          </div>
        </div>
        <Table {...wrapProps} rowKey={x => x._uid} />
      </div>
    );
  }
}

export default BaseTable;
