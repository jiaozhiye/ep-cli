/*
 * @Author: 焦质晔
 * @Date: 2020-01-14 20:22:09
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-01-26 21:04:47
 */
import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';

import _ from 'lodash';

const noop = () => {};

export default (options = {}) => {
  return WrappedComponent => {
    class FilterTable extends Component {
      // displayName -> 定义调试时的组件 name
      static displayName = `HOC(${WrappedComponent.displayName || WrappedComponent.name})`;

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
        onColumnsChange: PropTypes.func.isRequired // 表格列 顺序/显示隐藏 变化时的回调
      };

      static defaultProps = {
        dataSource: [],
        datakey: 'records',
        uidkey: 'uid',
        fetch: {}
      };

      get filterColumns() {
        return this.getFilterColumns(this.props.columns);
      }

      getFilterColumns = memoizeOne(columns => {
        return this.createFilterColumns(columns);
      });

      // 创建 FilterTable 组件 columns
      createFilterColumns = columns => {
        return columns;
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

      render() {
        const { forwardedRef, ...rest } = this.props;
        const wrapProps = Object.assign({}, rest, {
          filterTableRef: this,
          columns: this.filterColumns
        });
        return <WrappedComponent ref={forwardedRef} {...wrapProps} />;
      }
    }

    return React.forwardRef((props, ref) => {
      return <FilterTable {...props} forwardedRef={ref} />;
    });
  };
};
