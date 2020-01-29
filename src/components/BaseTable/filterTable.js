/*
 * @Author: 焦质晔
 * @Date: 2020-01-14 20:22:09
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-01-30 00:06:51
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

    static propTypes = {
      columns: PropTypes.arrayOf(
        PropTypes.shape({
          dataIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired, // 列数据在数据项中对应的数组路径
          title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired // 列头显示文字
        })
      ),
      dataSource: PropTypes.array, // 数据数组
      fetch: PropTypes.shape({
        api: PropTypes.func, // 请求数据列表的 ajax 接口
        params: PropTypes.object // 请求参数
      }),
      datakey: PropTypes.oneOfType([PropTypes.string, PropTypes.array]), // 接口返回的数据数组对应的数组路径
      uidkey: PropTypes.string, // 行数据的 uuid 字段名
      rowSelection: PropTypes.shape({
        type: PropTypes.string, // 多选/单选，checkbox/radio，默认 checkbox
        selectedRowKeys: PropTypes.array.isRequired, // 选中项的 key 数组
        disabledRowKeys: PropTypes.array, // 禁止选中项的 key 数组
        onChange: PropTypes.func.isRequired // 选中项发生变化时的回调
      }),
      sorter: PropTypes.bool, // 列排序
      filter: PropTypes.shape({
        type: PropTypes.string.isRequired, // 列筛选类型 text/checkbox/radio/number/range-number/date/range-date
        items: PropTypes.array // 筛选列表项
      }),
      expandable: PropTypes.shape({
        expandedRowRender: PropTypes.func, // 展开行渲染方法，返回 JSX 节点，可实现嵌套子表格
        onExpand: PropTypes.func // 点击展开图标时触发
      }),
      onColumnsChange: PropTypes.func.isRequired // 表格列 顺序/显示隐藏 变化时的回调
    };

    static defaultProps = {
      dataSource: [],
      datakey: 'records',
      uidkey: 'uid',
      fetch: {}
    };

    constructor(props) {
      super(props);
      this.state = this.initialState();
    }

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

    // 初始化 state
    initialState = () => {
      return {
        filteredInfo: {},
        sortedInfo: {},
        total: 0
      };
    };

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

    // 创建自定义的表头筛选
    createFilterProps = column => {
      const { serverFilter } = config.table;
      const { type } = column.filter;
      return this[type](column, serverFilter);
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
      !serverFilter && this.changeTotalHandle(this.props.dataSource.length);
    };

    // 清空表头排序
    clearSorter = () => {
      this.setState({ sortedInfo: {} });
    };

    // 表头筛选/排序变化时的事件
    filterOrSorterChange = (filters, sorter) => {
      this.setState({ filteredInfo: filters, sortedInfo: sorter });
    };

    changeTotalHandle = val => {
      this.setState({ total: Number(val) });
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
      const contextValue = {
        total: this.state.total,
        onTotalChange: this.changeTotalHandle
      };
      return (
        <TableContext.Provider value={contextValue}>
          <WrappedComponent ref={forwardedRef} {...wrapProps} />
        </TableContext.Provider>
      );
    }
  }

  return React.forwardRef((props, ref) => {
    return <FilterTable {...props} forwardedRef={ref} />;
  });
};
