/*
 * @Author: 焦质晔
 * @Date: 2020-01-14 20:22:09
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2020-02-08 10:12:53
 */
import React, { Component } from 'react';
import memoizeOne from 'memoize-one';
import { TableContext } from './tableContext';

import _ from 'lodash';

const noop = () => {};

export default WrappedComponent => {
  class EditableTable extends Component {
    static contextType = TableContext;

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
