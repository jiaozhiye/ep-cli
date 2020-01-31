/*
 * @Author: 焦质晔
 * @Date: 2020-01-14 20:22:09
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-01-31 11:45:29
 */
import React, { Component } from 'react';
import memoizeOne from 'memoize-one';
import { TableContext } from './tableContext';

import _ from 'lodash';
import moment from 'moment';
import config from '@/config';
import { dateToMoment } from '@/utils';

import { Row, Col, Button, Input, InputNumber, DatePicker } from 'antd';

const { RangePicker } = DatePicker;
const noop = () => {};

export default WrappedComponent => {
  class FilterTable extends Component {
    static contextType = TableContext;

    state = {
      filteredInfo: {},
      sortedInfo: {}
    };

    get filterColumns() {
      return this.createFilterColumns(this.props.columns);
    }

    get filters() {
      return this.getFilters(this.state.filteredInfo);
    }

    getFilters = memoizeOne(filters => {
      const $filters = {};
      Object.keys(filters)
        .filter(x => filters[x])
        .forEach(x => {
          $filters[x] = filters[x][0];
        });
      return $filters;
    });

    get sorter() {
      return this.getSorter(this.state.sortedInfo);
    }

    getSorter = memoizeOne(sorter => {
      return sorter.order ? { fieldSort: `${sorter.columnKey}=${sorter.order}` } : null;
    });

    // 创建 FilterTable 组件 columns
    createFilterColumns = columns => {
      return columns.map(x => {
        let target = { ...x };
        let { dataIndex } = target;
        if (Array.isArray(x.children)) {
          target.children = this.createFilterColumns(x.children);
        }
        // 设置 column 的 key
        target.key = Array.isArray(dataIndex) ? dataIndex.join('.') : dataIndex;
        if (target.filter) {
          target = Object.assign({}, target, this.createFilterProps(target));
        }
        if (target.sorter) {
          target = Object.assign({}, target, this.createSorterProps(target));
        }
        return target;
      });
    };

    // 创建自定义的表头排序
    createSorterProps = column => {
      const { serverSort } = config.table;
      const { dataIndex, key } = column;
      const { sortedInfo } = this.state;
      // 排序算法
      const sorter = (a, b) => {
        const start = _.get(a, dataIndex);
        const end = _.get(b, dataIndex);
        if (!isNaN(Number(start)) && !isNaN(Number(end))) {
          return start - end;
        }
        return start.toString().localeCompare(end.toString());
      };
      return {
        sorter: !serverSort ? sorter : true,
        sortOrder: sortedInfo.columnKey === key && sortedInfo.order
      };
    };

    // 创建自定义的表头筛选
    createFilterProps = column => {
      const { serverFilter } = config.table;
      const { type } = column.filter;
      return this[type](column, serverFilter);
    };

    [`checkbox`] = (column, isServerFilter) => {
      const { dataIndex, key } = column;
      const { items } = column.filter;
      const { filteredInfo } = this.state;
      return {
        filters: items,
        filteredValue: filteredInfo[key] || null,
        onFilter: !isServerFilter ? (value, row) => _.get(row, dataIndex) === value : null
      };
    };

    [`radio`] = (column, isServerFilter) => {
      const { dataIndex, key } = column;
      const { items } = column.filter;
      const { filteredInfo } = this.state;
      return {
        filterMultiple: false,
        filters: items,
        filteredValue: filteredInfo[key] || null,
        onFilter: !isServerFilter ? (value, row) => _.get(row, dataIndex) === value : null
      };
    };

    [`text`] = (column, isServerFilter) => {
      const { dataIndex, key } = column;
      const { filteredInfo } = this.state;
      return {
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
          return (
            <div style={{ padding: 8, width: 188 }}>
              <Input
                ref={node => {
                  this.searchInput = node;
                }}
                placeholder={`Search ${dataIndex}`}
                value={selectedKeys[0]}
                onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => this.onSubmit(confirm)}
              />
              {this.getColumnSearchButtons(confirm, clearFilters)}
            </div>
          );
        },
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => this.searchInput.select());
          }
        },
        filteredValue: filteredInfo[key] || null,
        onFilter: !isServerFilter ? (value, row) => _.get(row, dataIndex).includes(value) : null
      };
    };

    [`number`] = (column, isServerFilter) => {
      const { dataIndex, key } = column;
      const { filteredInfo } = this.state;
      return {
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
          return (
            <div style={{ padding: 8, width: 200 }}>
              <InputNumber
                placeholder={`Search ${dataIndex}`}
                value={selectedKeys[0]}
                style={{ width: '100%' }}
                onChange={val => setSelectedKeys(val ? [val] : [])}
                onPressEnter={() => this.onSubmit(confirm)}
              />
              {this.getColumnSearchButtons(confirm, clearFilters)}
            </div>
          );
        },
        filteredValue: filteredInfo[key] || null,
        onFilter: !isServerFilter ? (value, row) => _.get(row, dataIndex) === value : null
      };
    };

    [`range-number`] = (column, isServerFilter) => {
      const { dataIndex, key } = column;
      const { filteredInfo } = this.state;
      return {
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
          selectedKeys = selectedKeys[0] || [];
          return (
            <div style={{ padding: 8, width: 200 }}>
              <InputNumber
                placeholder={`Start ${dataIndex}`}
                value={selectedKeys[0]}
                style={{ width: 'calc(50% - 5px)' }}
                onChange={val => {
                  setSelectedKeys([[val, selectedKeys[1]]]);
                }}
              />
              <span style={{ display: 'inline-block', width: '10px', textAlign: 'center' }}>-</span>
              <InputNumber
                placeholder={`End ${dataIndex}`}
                value={selectedKeys[1]}
                style={{ width: 'calc(50% - 5px)' }}
                onChange={val => {
                  setSelectedKeys([[selectedKeys[0], val]]);
                }}
                onPressEnter={() => this.onSubmit(confirm)}
              />
              {this.getColumnSearchButtons(confirm, clearFilters)}
            </div>
          );
        },
        filteredValue: filteredInfo[key] || null,
        onFilter: !isServerFilter
          ? (value, row) => {
              const val = _.get(row, dataIndex);
              return val >= value[0] && val <= value[1];
            }
          : null
      };
    };

    [`date`] = (column, isServerFilter) => {
      const { dataIndex, key } = column;
      const { filteredInfo } = this.state;
      return {
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
          return (
            <div style={{ padding: 8, width: 200 }}>
              <DatePicker
                style={{ width: '100%' }}
                value={dateToMoment(selectedKeys[0])}
                onChange={(date, dateString) => {
                  setSelectedKeys([dateString]);
                }}
              />
              {this.getColumnSearchButtons(confirm, clearFilters)}
            </div>
          );
        },
        filteredValue: filteredInfo[key] || null,
        onFilter: !isServerFilter
          ? (value, row) => {
              const val = _.get(row, dataIndex);
              return moment(val).isSame(value, 'day');
            }
          : null
      };
    };

    [`range-date`] = (column, isServerFilter) => {
      const { dataIndex, key } = column;
      const { filteredInfo } = this.state;
      return {
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
          selectedKeys = selectedKeys[0] || [];
          return (
            <div style={{ padding: 8, width: 240 }}>
              <RangePicker
                value={selectedKeys.map(x => dateToMoment(x))}
                onChange={(dates, dateStrings) => {
                  setSelectedKeys([dateStrings]);
                }}
              />
              {this.getColumnSearchButtons(confirm, clearFilters)}
            </div>
          );
        },
        filteredValue: filteredInfo[key] || null,
        onFilter: !isServerFilter
          ? (value, row) => {
              const val = _.get(row, dataIndex);
              return moment(val).isBetween(value[0], value[1], null, '[]');
            }
          : null
      };
    };

    // 获取筛选按钮
    getColumnSearchButtons = (confirm, clearFilters) => (
      <Row style={{ marginTop: 8 }} gutter={8}>
        <Col span={24}>
          <Button type="link" onClick={() => this.onSubmit(confirm)} size="small">
            确定
          </Button>
          <Button onClick={() => this.onReset(clearFilters)} size="small" type="link">
            重置
          </Button>
        </Col>
      </Row>
    );

    // 确定筛选
    onSubmit = confirm => {
      confirm();
    };

    // 清除筛选
    onReset = clearFilters => {
      clearFilters();
    };

    // 清空表头筛选条件
    clearFilters = () => {
      const { serverFilter } = config.table;
      this.setState({ filteredInfo: {} });
      // 在非服务端筛选时，处理分页总数
      if (!serverFilter) {
        this.context.onTotalChange(this.props.dataSource.length);
      }
    };

    // 清空表头排序
    clearSorter = () => {
      this.setState({ sortedInfo: {} });
    };

    // 表头筛选/排序变化时的事件
    filterOrSorterChange = (filters, sorter) => {
      this.setState({ filteredInfo: filters, sortedInfo: sorter });
    };

    render() {
      const { forwardedRef, ...rest } = this.props;
      const wrapProps = Object.assign({}, rest, {
        filterTableRef: this,
        columns: this.filterColumns,
        filters: this.filters,
        sorter: this.sorter,
        onFilterOrSorterChange: this.filterOrSorterChange
      });
      return <WrappedComponent ref={forwardedRef} {...wrapProps} />;
    }
  }

  return React.forwardRef((props, ref) => {
    return <FilterTable {...props} forwardedRef={ref} />;
  });
};
