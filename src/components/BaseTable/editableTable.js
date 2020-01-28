/*
 * @Author: 焦质晔
 * @Date: 2020-01-14 20:22:09
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-01-28 20:55:47
 */
import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';

import _ from 'lodash';

const noop = () => {};

export default (options = {}) => {
  return WrappedComponent => {
    class EditableTable extends Component {
      // Table 组件可编辑列
      get editableColumns() {
        return this.getEditableColumns(this.props.columns);
      }

      getEditableColumns = memoizeOne(columns => {
        return this.createEditableColumns(columns);
      });

      // 创建 EditableTable 组件 columns
      createEditableColumns = columns => {
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
          editableTableRef: this,
          columns: this.editableColumns
        });
        return <WrappedComponent ref={forwardedRef} {...wrapProps} />;
      }
    }

    return React.forwardRef((props, ref) => {
      return <EditableTable {...props} forwardedRef={ref} />;
    });
  };
};
