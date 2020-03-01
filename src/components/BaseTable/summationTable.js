/*
 * @Author: 焦质晔
 * @Date: 2020-02-07 18:47:05
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-02-08 10:42:55
 */
import React, { Component, createRef } from 'react';
import memoizeOne from 'memoize-one';
import PropTypes from 'prop-types';
import addEventListener from 'add-dom-event-listener';

import _ from 'lodash';
import { createUidKey, columnsFlatMap, deepFindColumn, formatNumber } from './utils';

import classnames from 'classnames';
import css from './index.module.less';

import { Table } from 'antd';

export class SummationTable extends Component {
  static propTypes = {
    columns: PropTypes.array,
    dataSource: PropTypes.array,
    size: PropTypes.string,
    scroll: PropTypes.object,
    bordered: PropTypes.bool,
    tableWrapRef: PropTypes.object,
    rowSelection: PropTypes.shape({
      columnWidth: PropTypes.number
    })
  };

  summationRef = createRef();

  componentDidMount() {
    setTimeout(() => {
      this.$table = this.getTableContainer(this.props.tableWrapRef.current);
      this.$current = this.getTableContainer(this.summationRef.current);
      this.eventHandler = addEventListener(this.$table, 'scroll', e => {
        this.scrollHandle(e.currentTarget);
      });
      this.scrollHandle(this.$table);
    });
  }

  componentWillUnmount() {
    this.eventHandler.remove();
    this.$table = null;
    this.$current = null;
  }

  get formatColumns() {
    return this.getFormatColumns(this.props.columns);
  }

  getFormatColumns = memoizeOne(columns => {
    return this.createFormatColumns(columns);
  });

  get flatColumns() {
    return this.getFlatColumns(this.formatColumns);
  }

  getFlatColumns = memoizeOne(columns => {
    return columnsFlatMap(columns);
  });

  get summationRowData() {
    const { dataSource } = this.props;
    const summationColumns = this.flatColumns.filter(x => typeof x.summation !== 'undefined');
    // 结果
    const res = { _uid: createUidKey() };
    summationColumns.forEach(column => {
      const {
        dataIndex,
        precision,
        summation: { unit = '' }
      } = column;
      const values = dataSource.map(x => Number(_.get(x, dataIndex, 0)));
      // 累加求和
      let result = values.reduce((prev, curr) => {
        const value = Number(curr);
        if (!isNaN(value)) {
          return prev + curr;
        }
        return prev;
      }, 0);
      // 精度
      result = precision >= 0 ? result.toFixed(precision) : result;
      _.set(res, dataIndex, `${formatNumber(result)} ${unit}`);
    });
    return [res];
  }

  getTableContainer = $wrap => {
    return $wrap.querySelector('.ant-table-container > .ant-table-body') || $wrap.querySelector('.ant-table-container > .ant-table-content');
  };

  scrollHandle = $table => {
    if ($table.scrollLeft !== this.$current.scrollLeft) {
      this.$current.scrollLeft = $table.scrollLeft;
    }
  };

  // 格式化 columns
  createFormatColumns = columns => {
    return columns.map(x => {
      let { dataIndex, title, width, fixed, align, precision, summation } = x;
      let target = { dataIndex, title, width, fixed, align, precision, summation };
      if (Array.isArray(x.children)) {
        target.children = this.createFormatColumns(x.children);
      }
      target.render = text => text;
      return target;
    });
  };

  // 创建合计 columns
  createSummationColumns() {
    const { rowSelection } = this.props;
    if (!rowSelection) {
      const target = deepFindColumn(this.formatColumns, '$action');
      if (target && target.fixed === 'left') {
        target.render = () => '合计';
      }
      return [...this.formatColumns];
    }
    return [
      {
        dataIndex: '$selection',
        title: '',
        fixed: 'left',
        width: rowSelection.columnWidth,
        render: () => '合计'
      },
      ...this.formatColumns
    ];
  }

  render() {
    const { size, bordered, scroll } = this.props;
    const wrapProps = {
      size,
      bordered,
      columns: this.createSummationColumns(),
      dataSource: this.summationRowData,
      scroll,
      showHeader: false,
      pagination: false
    };
    return (
      <div ref={this.summationRef} className={classnames(css[`summation-table-wrap`])}>
        <Table {...wrapProps} rowKey={x => x._uid} />
      </div>
    );
  }
}
