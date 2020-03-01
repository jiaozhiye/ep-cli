/*
 * @Author: 焦质晔
 * @Date: 2020-01-14 19:25:10
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-02-08 13:51:52
 */
import React, { Component, createRef } from 'react';
import memoizeOne from 'memoize-one';
import { TableContext } from './tableContext';

import { TableInfo } from './tableInfo';
import { ColumnSort } from './columnSort';
import { MoreAction } from './moreAction';
import { SummationTable } from './summationTable';

import _ from 'lodash';
import config from '@/config';
import { isColumnPropertyExist } from './utils';

import classnames from 'classnames';
import css from './index.module.less';

export default WrappedComponent => {
  class LayoutTable extends Component {
    static contextType = TableContext;

    tableWrapRef = createRef();

    get filterColumns() {
      return this.createFilterColumns(this.props.columns);
    }

    get isSummation() {
      return isColumnPropertyExist(this.filterColumns, 'summation');
    }

    get isMoreActions() {
      const { moreActions, rowSelection } = this.props;
      return this.getIsMoreActions(moreActions, rowSelection);
    }

    getIsMoreActions = memoizeOne((actions, selection) => {
      const bool1 = _.isArray(actions) && actions.length;
      const bool2 = _.isObject(selection) && selection.selectedRowKeys.length;
      return Boolean(bool1 && bool2);
    });

    get layoutScroll() {
      return this.getLayoutScroll(this.props.scroll);
    }

    getLayoutScroll = memoizeOne(scroll => {
      return Object.assign({}, scroll, { scrollToFirstRowOnChange: true });
    });

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
      const { serverFilter } = config.table;
      // 清空选择列的选中状态
      this.props.pageTableRef.clearRowSelection();
      // 清空表头筛选条件
      this.props.filterTableRef.clearFilters();
      // 清空表头排序
      this.props.filterTableRef.clearSorter();
      // 在非服务端筛选时，处理分页总数
      if (!serverFilter) {
        this.context.onTotalChange(this.props.dataSource.length);
      }
    };

    // 创建表格底部合计
    createSummationHandle() {
      const { dataSource, size, bordered, rowSelection, scroll } = this.props;
      return this.isSummation
        ? {
            footer: currentPageData => {
              return (
                <SummationTable
                  tableWrapRef={this.tableWrapRef}
                  columns={this.filterColumns}
                  dataSource={currentPageData}
                  size={size}
                  bordered={bordered}
                  rowSelection={rowSelection}
                  scroll={scroll}
                />
              );
            }
          }
        : null;
    }

    render() {
      const { forwardedRef, ...rest } = this.props;
      const wrapProps = Object.assign({}, rest, {
        columns: this.filterColumns,
        scroll: this.layoutScroll,
        ...this.createSummationHandle()
      });
      return (
        <div className={classnames(css['table'])}>
          <div className={classnames(css['table-top'], `clearfix`)}>
            <div className={classnames(css[`table-top-wrap`], `fl`)}>
              <TableInfo total={this.context.total} selection={wrapProps.rowSelection} onClearHandle={this.clearTableHandle} />
              {this.isMoreActions && <MoreAction items={wrapProps.moreActions} />}
            </div>
            <div className={classnames(css[`table-top-wrap`], `fr`)}>
              <div className={classnames(css[`table-top-wrap-extra`])}>{wrapProps.extra}</div>
              <ColumnSort columns={this.props.columns} onChange={columns => this.props.onColumnsChange(columns)} />
            </div>
          </div>
          <div ref={this.tableWrapRef}>
            <WrappedComponent ref={forwardedRef} {...wrapProps} />
          </div>
        </div>
      );
    }
  }

  return React.forwardRef((props, ref) => {
    return <LayoutTable {...props} forwardedRef={ref} />;
  });
};
