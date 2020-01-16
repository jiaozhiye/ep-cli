/*
 * @Author: 焦质晔
 * @Date: 2020-01-14 20:22:09
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-01-16 20:13:44
 */
import React, { Component } from 'react';
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

      static getDerivedStateFromProps() {
        return null;
      }

      constructor(props) {
        super(props);
        this.state = this.initialState();
      }

      get flatColumns() {
        return this.getFlatColumns(this.props.columns);
      }

      getFlatColumns = memoizeOne(columns => {
        return this.columnsFlatMap(columns);
      });

      get dataSource() {
        return this.getDataSource(this.props.dataSource, this.state.list);
      }

      getDataSource = memoizeOne((propList, stateList) => {
        return this.createDataSource(this.props.fetch.api ? stateList : propList);
      });

      // 初始化 state
      initialState = () => {
        return {
          list: [], // ajax 请求的数据列表
          pagination: { current: config.table.pageNum, pageSize: config.table.pageSize, total: 0 } // 分页参数
        };
      };

      // 处理数据
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

      // 列字段的深度查找
      deepFindColumn = (columns, mark) => {
        let res = null;
        for (let i = 0; i < columns.length; i++) {
          if (Array.isArray(columns[i].children)) {
            res = this.deepFindColumn(columns[i].children, mark);
          }
          if (res) {
            return res;
          }
          if (columns[i].dataIndex === mark) {
            res = columns[i];
            break;
          }
        }
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

      render() {
        const wrapProps = Object.assign({}, this.props, {
          dataSource: this.dataSource
        });
        return <WrappedComponent {...wrapProps} />;
      }
    }
    return PageTable;
  };
};
