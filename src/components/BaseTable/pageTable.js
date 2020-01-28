/*
 * @Author: 焦质晔
 * @Date: 2020-01-14 20:22:09
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-01-28 23:48:14
 */
import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';

import _ from 'lodash';
import config from '@/config';

const noop = () => {};

export default (options = {}) => {
  return WrappedComponent => {
    class PageTable extends Component {
      static getDerivedStateFromProps(nextProps, prevState) {
        const { dataSource, fetch, filters, sorter } = nextProps;
        const { pagination } = prevState;
        const fetchParams = Object.assign({}, fetch.params, filters, sorter, {
          current: pagination.current,
          pageSize: pagination.pageSize
        });
        if (!_.isEqual(fetchParams, prevState.fetchParams)) {
          return { fetchParams };
        }
        if (fetch.api !== prevState.fetchApi) {
          return { fetchApi: fetch.api };
        }
        if (!fetch.api && dataSource.length) {
          return { pagination: { ...pagination, total: dataSource.length } };
        }
        return null;
      }

      constructor(props) {
        super(props);
        this.state = this.initialState();
      }

      // 展平后的表格列
      get flatColumns() {
        return this.getFlatColumns(this.props.columns);
      }

      getFlatColumns = memoizeOne(columns => {
        return this.columnsFlatMap(columns);
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
          { columnWidth: '50px', getCheckboxProps: row => ({ disabled: options.disabledRowKeys.includes(row[uidkey]) }) },
          options
        );
      });

      // Table 组件渲染的数据列表
      get dataSource() {
        return this.getDataSource(this.props.dataSource, this.state.list);
      }

      getDataSource = memoizeOne((propTableList, stateTableList) => {
        return this.createDataSource(this.props.fetch.api ? stateTableList : propTableList);
      });

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
      }

      // 初始化 state
      initialState = () => {
        const { pageNum, pageSize } = config.table;
        const { fetch, filters, sorter } = this.props;
        const pagination = { current: pageNum, pageSize, total: 0 };
        const fetchParams = Object.assign({}, fetch.params, filters, sorter, {
          current: pagination.current,
          pageSize: pagination.pageSize
        });
        return {
          list: [], // 列表数据
          loading: false, // Table 加载数据的 loading
          pagination, // 分页参数
          fetchApi: fetch.api, // ajax 请求接口
          fetchParams // ajax 请求参数
        };
      };

      // 处理 ajax 返回的数据
      createAjaxData = data => {
        const list = this.createDataToArray(data);
        const total = this.createDataTotal(data);
        this.setState({ list });
        this.setPaginationTotal(total || list.length);
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
        return list.map(x => {
          const target = this.setInitialValue(x); // 初始化列表数据
          return {
            _uid: x[uidkey] || x._uid || this.createUidKey(), // 字段值唯一不重复的 key
            ...target
          };
        });
      };

      // 处理列表数据的初始值
      setInitialValue = item => {
        this.flatColumns.forEach(x => {
          const { dataIndex, precision } = x;
          let val = _.get(item, dataIndex);
          // 设置数据默认值
          if (_.isUndefined(val) || _.isNull(val)) {
            val = '';
          }
          // 处理数值精度
          if (precision >= 0 && !isNaN(Number(val))) {
            val = Number(val).toFixed(precision);
          }
          _.set(item, dataIndex, val);
        });
        return item;
      };

      // 设置分页总数
      setPaginationTotal = val => {
        this.setState(prevState => {
          const { pagination } = prevState;
          return { pagination: { ...pagination, total: Number(val) } };
        });
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
      tableChangeHandle = (pagination, filters, sorter) => {
        const { filterOrSorterChange = noop } = this.props;
        filterOrSorterChange(filters, sorter);
        // 处理分页
        this.setState(prevState => {
          return { pagination: { ...prevState.pagination, current: pagination.current } };
        });
      };

      // 获取 column 展平后的一维数组
      columnsFlatMap = columns => {
        let res = [];
        columns.forEach(x => {
          let target = { ...x };
          if (Array.isArray(target.children)) {
            res.push(...this.columnsFlatMap(target.children));
          }
          delete target.children;
          res.push(target);
        });
        return res;
      };

      // 生成 uuid key
      createUidKey = () => {
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
          let r = (Math.random() * 16) | 0;
          let v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
        return uuid;
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
        const wrapProps = Object.assign({}, rest, {
          pageTableRef: this,
          dataSource: this.dataSource,
          loading,
          pagination,
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
};
