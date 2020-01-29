/*
 * @Author: 焦质晔
 * @Date: 2020-01-14 19:25:10
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-01-30 00:07:56
 */
import React, { Component } from 'react';
import { TableContext } from './tableContext';

import { TableInfo } from './tableInfo';
import { ColumnSort } from './columnSort';

import classnames from 'classnames';
import css from './index.module.less';

export default WrappedComponent => {
  class LayoutTable extends Component {
    static contextType = TableContext;

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

    render() {
      const { forwardedRef, ...rest } = this.props;
      const wrapProps = Object.assign({}, rest, {
        columns: this.createFilterColumns(this.props.columns)
      });
      return (
        <div className={classnames(css['table'])}>
          <div className={classnames(css['table-top'], `clearfix`)}>
            <div className={classnames(css[`table-top-wrap`], `fl`)}>
              <TableInfo total={this.context.total} selection={wrapProps.rowSelection} onClearHandle={this.clearTableHandle} />
            </div>
            <div className={classnames(css[`table-top-wrap`], `fr`)}>
              <ColumnSort columns={this.props.columns} onChange={columns => this.props.onColumnsChange(columns)} />
            </div>
          </div>
          <WrappedComponent ref={forwardedRef} {...wrapProps} />
        </div>
      );
    }
  }

  return React.forwardRef((props, ref) => {
    return <LayoutTable {...props} forwardedRef={ref} />;
  });
};
