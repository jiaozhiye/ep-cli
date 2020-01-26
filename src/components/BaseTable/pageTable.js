/*
 * @Author: 焦质晔
 * @Date: 2020-01-14 20:22:09
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-01-26 21:02:45
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
      // displayName -> 定义调试时的组件 name
      static displayName = `HOC(${WrappedComponent.displayName || WrappedComponent.name})`;

      static getDerivedStateFromProps(nextProps, prevState) {
        const fetchParams = Object.assign({}, nextProps.fetch.params, nextProps.filters, {
          current: prevState.pagination.current,
          pageSize: prevState.pagination.pageSize
        });
        const fetchApi = nextProps.fetch.fetchApi;
        if (!_.isEqual(fetchParams, prevState.fetchParams)) {
          return { fetchParams };
        }
        if (fetchApi !== prevState.fetchApi) {
          return { fetchApi };
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

      // Table 组件渲染的数据列表
      get dataSource() {
        return this.getDataSource(this.props.dataSource, this.state.tableData);
      }

      getDataSource = memoizeOne((propList, stateList) => {
        return this.createDataSource(this.props.fetch.api ? stateList : propList);
      });

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
        const pagination = { current: pageNum, pageSize, total: 0 };
        const fetchParams = Object.assign({}, this.props.fetch.params, this.props.filters, {
          current: pagination.current,
          pageSize: pagination.pageSize
        });
        return {
          tableData: {}, // ajax 请求的数据
          loading: false, // Table 加载数据的 loading
          pagination, // 分页参数
          fetchApi: this.props.fetch.api, // ajax 请求接口
          fetchParams // ajax 请求参数
        };
      };

      // 处理列表数据
      createDataSource = data => {
        const { datakey, uidkey } = this.props;
        const dataList = Array.isArray(data) ? data : _.get(data, datakey, []) || [];
        // 初始化列表数据
        const list = dataList.map(x => {
          const target = this.setInitialValue(x);
          return {
            _uid: x[uidkey] || x._uid || this.createUidKey(), // 字段值唯一不重复的 key
            ...target
          };
        });
        return list;
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

      // ajax 获取列表数据
      getTableList = async () => {
        if (process.env.REACT_APP_MOCK_DATA === 'true') {
          const res = require('@/mock/tableData').default;
          this.setState(prevState => ({ tableData: res.data }));
        } else {
          this.startTableLoading();
          try {
            const { resultCode, data = {} } = await this.state.fetchApi(this.state.fetchParams);
            if (resultCode === 200) {
              this.setState(prevState => ({ tableData: data }));
            }
          } catch (e) {
            this.setState(prevState => ({ tableData: {} }));
          }
          this.stopTableLoading();
        }
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

      // Table
      // 开始 Table 组件的 loading 效果
      startTableLoading() {
        this.setState(prevState => ({ loading: true }));
      }

      // 停止 Table 组件的 loading 效果
      stopTableLoading() {
        this.setState(prevState => ({ loading: false }));
      }

      render() {
        const { forwardedRef, ...rest } = this.props;
        const { loading, pagination } = this.state;
        const wrapProps = Object.assign({}, rest, {
          pageTableRef: this,
          dataSource: this.dataSource,
          loading,
          total: pagination.total
        });
        return <WrappedComponent ref={forwardedRef} {...wrapProps} />;
      }
    }

    return React.forwardRef((props, ref) => {
      return <PageTable {...props} forwardedRef={ref} />;
    });
  };
};
