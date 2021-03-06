/*
 * @Author: 焦质晔
 * @Date: 2020-01-14 20:22:09
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-02-08 13:50:22
 */
import React, { Component } from 'react';
import memoizeOne from 'memoize-one';
import { TableContext } from './tableContext';

import _ from 'lodash';
import config from '@/config';
import { createUidKey, columnsFlatMap } from './utils';

const noop = () => {};

export default WrappedComponent => {
  class PageTable extends Component {
    static contextType = TableContext;

    static getDerivedStateFromProps(nextProps, prevState) {
      const { dataSource, fetch, filters, sorter } = nextProps;
      const { pagination } = prevState;
      const fetchParams = Object.assign({}, fetch.params, filters, sorter, { current: pagination.current, pageSize: pagination.pageSize });
      let derivedState = null;
      if (!_.isEqual(fetchParams, prevState.fetchParams)) {
        derivedState = Object.assign({}, derivedState, fetchParams);
      }
      if (fetch.api !== prevState.fetchApi) {
        derivedState = Object.assign({}, derivedState, { fetchApi: fetch.api });
      }
      if (dataSource.length !== prevState._total) {
        derivedState = Object.assign({}, derivedState, { _total: dataSource.length });
      }
      return derivedState;
    }

    constructor(props) {
      super(props);
      this.state = this.initialState();
    }

    // 组件加载的钩子
    componentDidMount() {
      this.getTableList();
    }

    // 组件更新的钩子
    componentDidUpdate(prevProps, prevState) {
      if (!_.isEqual(prevState.fetchParams, this.state.fetchParams)) {
        this.getTableList();
      }
      if (prevState.fetchApi !== this.state.fetchApi) {
        this.getTableList();
      }
      if (prevState._total !== this.state._total) {
        this.context.onTotalChange(this.state._total);
      }
    }

    // 初始化 state
    initialState = () => {
      const { pageNum, pageSize } = config.table;
      const { dataSource, fetch, filters, sorter } = this.props;
      const pagination = { current: pageNum, pageSize };
      const fetchParams = Object.assign({}, fetch.params, filters, sorter, pagination);
      return {
        list: [], // 列表数据
        loading: false, // Table 加载数据的 loading
        pagination, // 分页参数
        fetchApi: fetch.api, // ajax 请求接口
        fetchParams, // ajax 请求参数
        _total: dataSource.length // 传入列表数据的数量(参考变量)
      };
    };

    // 展平后的表格列
    get flatColumns() {
      return this.getFlatColumns(this.props.columns);
    }

    getFlatColumns = memoizeOne(columns => {
      return columnsFlatMap(columns);
    });

    // Table 组件选择列配置
    get rowSelection() {
      return this.getRowSelection(this.props.rowSelection);
    }

    getRowSelection = memoizeOne(options => {
      if (!options) {
        return null;
      }
      const { uidkey } = this.props;
      return Object.assign(
        {},
        { columnWidth: 50, fixed: true, getCheckboxProps: row => ({ disabled: options.disabledRowKeys.includes(row[uidkey]) }) },
        options
      );
    });

    // Table 组件渲染的数据列表
    get dataSource() {
      return this.getDataSource(this.state.list, this.props.dataSource);
    }

    getDataSource = memoizeOne((stateTableList, propTableList) => {
      const { fetch } = this.props;
      return this.createDataSource(fetch.api ? stateTableList : propTableList);
    });

    // 处理 ajax 返回的数据
    createAjaxData = data => {
      const list = this.createDataToArray(data);
      const total = this.createDataTotal(data);
      this.context.onTotalChange(total || list.length);
      this.setState({ list });
    };

    // 数据转数组
    createDataToArray = data => {
      const { datakey } = this.props;
      return Array.isArray(data) ? data : _.get(data, datakey, []) || [];
    };

    // 计算数据总量
    createDataTotal = data => {
      const { datakey } = this.props;
      const totalKey = Array.isArray(datakey) ? [...datakey.slice(0, -1), 'total'] : datakey.replace(/[^.]+$/, 'total');
      return _.get(data, totalKey) || 0;
    };

    // 处理列表数据
    createDataSource = list => {
      const { uidkey } = this.props;
      return list.map((x, i) => {
        const target = this.setInitialValue(x); // 初始化列表数据
        return {
          _uid: x[uidkey] || x._uid || createUidKey(), // 字段值唯一不重复的 key
          index: i,
          ...target
        };
      });
    };

    // 处理列表数据的初始值
    setInitialValue = row => {
      const res = { ...row };
      this.flatColumns.forEach(x => {
        const { dataIndex, precision } = x;
        let val = _.get(row, dataIndex);
        // 设置数据默认值
        if (_.isUndefined(val) || _.isNull(val)) {
          val = '';
        }
        // 处理数值精度
        if (precision >= 0 && !isNaN(Number(val))) {
          val = Number(val).toFixed(precision);
        }
        _.set(res, dataIndex, val);
      });
      return res;
    };

    // ajax 获取列表数据
    getTableList = async () => {
      if (!this.state.fetchApi) return;
      if (process.env.REACT_APP_MOCK_DATA === 'true') {
        const res = require('@/mock/tableData').default;
        this.createAjaxData(res.data);
      } else {
        this.startTableLoading();
        try {
          const res = await this.state.fetchApi(this.state.fetchParams);
          if (res.resultCode === 200) {
            this.createAjaxData(res.data);
          }
        } catch (e) {
          this.createAjaxData({});
        }
        this.stopTableLoading();
      }
    };

    // TableT组件 change 事件，分页、排序、筛选变化时触发
    tableChangeHandle = (pagination, filters, sorter, { currentDataSource }) => {
      const { onFilterOrSorterChange } = this.props;
      const { serverFilter } = config.table;
      onFilterOrSorterChange(filters, sorter);
      // 在非服务端筛选时，处理分页总数
      if (!serverFilter) {
        this.context.onTotalChange(currentDataSource.length);
      }
      // 处理分页
      this.setState(prevState => {
        return { pagination: { ...prevState.pagination, current: pagination.current } };
      });
    };

    // 清空选择列的选中状态
    clearRowSelection = () => {
      const { rowSelection } = this.props;
      if (_.isObject(rowSelection)) {
        rowSelection.onChange([], []);
      }
    };

    // 开始 Table 组件的 loading 效果
    startTableLoading() {
      this.setState({ loading: true });
    }

    // 停止 Table 组件的 loading 效果
    stopTableLoading() {
      this.setState({ loading: false });
    }

    render() {
      const { forwardedRef, ...rest } = this.props;
      const { loading, pagination } = this.state;
      const { total } = this.context;
      const wrapProps = Object.assign({}, rest, {
        pageTableRef: this,
        dataSource: this.dataSource,
        loading,
        pagination: rest.showPagination ? { ...pagination, total } : false,
        rowSelection: this.rowSelection,
        onChange: this.tableChangeHandle
      });
      return <WrappedComponent ref={forwardedRef} {...wrapProps} />;
    }
  }

  return React.forwardRef((props, ref) => {
    return <PageTable {...props} forwardedRef={ref} />;
  });
};
